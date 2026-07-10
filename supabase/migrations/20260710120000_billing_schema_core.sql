-- Billing schema v1: core tables, constraints, guard triggers, grants.
--
-- Additive only: no DDL on any public table. The billing schema is NOT in
-- PostgREST's exposed schemas (public, graphql_public), so nothing here is
-- reachable with the anon or authenticated API keys regardless of RLS.
-- The single outbound FK to public.leagues is ON DELETE SET NULL so billing
-- can never block an app-side write or delete.

SET lock_timeout = '2s';

CREATE SCHEMA billing;

REVOKE ALL ON SCHEMA billing FROM PUBLIC;
GRANT USAGE ON SCHEMA billing TO service_role;

-- ---------------------------------------------------------------------------
-- clients: one row per invoiced legal entity (club).
-- ---------------------------------------------------------------------------
CREATE TABLE billing.clients (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  league_id     integer UNIQUE REFERENCES public.leagues(id) ON DELETE SET NULL,
  code          text NOT NULL UNIQUE,
  legal_name    text NOT NULL,
  contact_name  text,
  billing_email text,
  agreement_ref text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE billing.clients IS 'Invoiced club entities. code is the invoice-number prefix (e.g. NE).';

-- ---------------------------------------------------------------------------
-- terms: date-versioned commercial terms (mirrors agreement Schedule 1).
-- Rate changes are new rows with new effective dates, never UPDATEs.
-- ---------------------------------------------------------------------------
CREATE TABLE billing.terms (
  id                integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id         integer NOT NULL REFERENCES billing.clients(id),
  per_player_fee    numeric(10,2) NOT NULL CHECK (per_player_fee >= 0),
  service_fee_pct   numeric(5,2) NOT NULL CHECK (service_fee_pct >= 0 AND service_fee_pct <= 100),
  effective_from    date NOT NULL,
  effective_to      date,
  agreement_version text,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT terms_valid_range CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

COMMENT ON TABLE billing.terms IS 'Versioned Schedule 1 terms. effective_to NULL = open-ended current terms.';

CREATE FUNCTION billing.guard_terms_overlap() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  -- Serialize concurrent terms writes for the same client.
  PERFORM 1 FROM billing.clients c WHERE c.id = NEW.client_id FOR UPDATE;
  IF EXISTS (
    SELECT 1 FROM billing.terms t
    WHERE t.client_id = NEW.client_id
      AND t.id IS DISTINCT FROM NEW.id
      AND daterange(t.effective_from, COALESCE(t.effective_to, 'infinity'::date), '[]')
       && daterange(NEW.effective_from, COALESCE(NEW.effective_to, 'infinity'::date), '[]')
  ) THEN
    RAISE EXCEPTION 'billing.terms: date range overlaps an existing terms row for client %', NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER terms_no_overlap
  BEFORE INSERT OR UPDATE ON billing.terms
  FOR EACH ROW EXECUTE FUNCTION billing.guard_terms_overlap();

-- ---------------------------------------------------------------------------
-- adjustments: manual corrections. night_write_off zeroes a night's fee
-- (the line still appears on the statement with the reason shown).
-- league_night_instance_id is a soft reference (no FK to public) so billing
-- can never constrain app behavior.
-- ---------------------------------------------------------------------------
CREATE TABLE billing.adjustments (
  id                       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id                integer NOT NULL REFERENCES billing.clients(id),
  league_night_instance_id integer,
  type                     text NOT NULL CHECK (type IN ('night_write_off','credit','debit')),
  amount                   numeric(12,2),
  effective_date           date NOT NULL,
  reason                   text NOT NULL,
  created_by               text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT writeoff_has_night CHECK (type <> 'night_write_off' OR league_night_instance_id IS NOT NULL),
  CONSTRAINT credit_debit_has_amount CHECK (type = 'night_write_off' OR amount IS NOT NULL)
);

CREATE UNIQUE INDEX adjustments_one_writeoff_per_night
  ON billing.adjustments (league_night_instance_id)
  WHERE type = 'night_write_off';

-- ---------------------------------------------------------------------------
-- invoices + invoice_lines: frozen snapshots once issued.
-- ---------------------------------------------------------------------------
CREATE TABLE billing.invoices (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id      integer NOT NULL REFERENCES billing.clients(id),
  invoice_number text NOT NULL UNIQUE,
  period_start   date NOT NULL,
  period_end     date NOT NULL,
  status         text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','paid','void')),
  total          numeric(12,2) NOT NULL DEFAULT 0,
  generated_at   timestamptz NOT NULL DEFAULT now(),
  issued_at      timestamptz,
  due_date       date,
  paid_at        timestamptz,
  notes          text,
  CONSTRAINT invoice_valid_period CHECK (period_end >= period_start)
);

-- At most one non-void invoice per client per period; corrections require
-- void first, then reissue (numbered -R1, -R2, ...).
CREATE UNIQUE INDEX invoices_one_live_per_period
  ON billing.invoices (client_id, period_start)
  WHERE status <> 'void';

CREATE TABLE billing.invoice_lines (
  id                       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_id               integer NOT NULL REFERENCES billing.invoices(id) ON DELETE CASCADE,
  line_no                  integer NOT NULL,
  league_night_instance_id integer,
  line_date                date NOT NULL,
  description              text NOT NULL,
  total_checkins           integer NOT NULL,
  admin_checkins           integer NOT NULL,
  walkin_checkins          integer NOT NULL,
  billable_players         integer NOT NULL,
  per_player_fee           numeric(10,2) NOT NULL,
  service_fee_pct          numeric(5,2) NOT NULL,
  gross                    numeric(12,2) NOT NULL,
  amount                   numeric(12,2) NOT NULL,
  is_written_off           boolean NOT NULL DEFAULT false,
  writeoff_reason          text,
  UNIQUE (invoice_id, line_no)
);

-- ---------------------------------------------------------------------------
-- Immutability guards. Issued invoices are frozen snapshots: only the legal
-- status transitions may touch them, even with the service role.
--   draft  -> draft (regeneration) | issued
--   issued -> paid | void (notes may be edited while issued)
--   paid / void -> immutable
-- ---------------------------------------------------------------------------
CREATE FUNCTION billing.guard_invoice_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF OLD.status = 'draft' THEN
    IF NEW.status NOT IN ('draft','issued') THEN
      RAISE EXCEPTION 'invalid invoice transition draft -> %', NEW.status;
    END IF;
    RETURN NEW;
  END IF;

  IF OLD.status IN ('paid','void') THEN
    RAISE EXCEPTION 'invoice % is % and immutable', OLD.invoice_number, OLD.status;
  END IF;

  -- OLD.status = 'issued': frozen financial/identity fields.
  IF NEW.client_id      IS DISTINCT FROM OLD.client_id
  OR NEW.invoice_number IS DISTINCT FROM OLD.invoice_number
  OR NEW.period_start   IS DISTINCT FROM OLD.period_start
  OR NEW.period_end     IS DISTINCT FROM OLD.period_end
  OR NEW.total          IS DISTINCT FROM OLD.total
  OR NEW.generated_at   IS DISTINCT FROM OLD.generated_at
  OR NEW.issued_at      IS DISTINCT FROM OLD.issued_at
  OR NEW.due_date       IS DISTINCT FROM OLD.due_date THEN
    RAISE EXCEPTION 'invoice % is issued; its contents are immutable', OLD.invoice_number;
  END IF;

  IF NEW.status = 'issued' THEN
    IF NEW.paid_at IS DISTINCT FROM OLD.paid_at THEN
      RAISE EXCEPTION 'paid_at may only be set when marking invoice % paid', OLD.invoice_number;
    END IF;
    RETURN NEW; -- notes edits while issued
  ELSIF NEW.status IN ('paid','void') THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'invalid invoice transition issued -> %', NEW.status;
END;
$$;

CREATE FUNCTION billing.guard_invoice_delete() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF OLD.status <> 'draft' THEN
    RAISE EXCEPTION 'invoice % is % and cannot be deleted', OLD.invoice_number, OLD.status;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER invoices_guard_update
  BEFORE UPDATE ON billing.invoices
  FOR EACH ROW EXECUTE FUNCTION billing.guard_invoice_update();

CREATE TRIGGER invoices_guard_delete
  BEFORE DELETE ON billing.invoices
  FOR EACH ROW EXECUTE FUNCTION billing.guard_invoice_delete();

CREATE FUNCTION billing.guard_invoice_lines() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE
  v_status text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.invoice_id IS DISTINCT FROM OLD.invoice_id THEN
    RAISE EXCEPTION 'invoice lines cannot be moved between invoices';
  END IF;
  SELECT i.status INTO v_status
  FROM billing.invoices i
  WHERE i.id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  -- Parent already gone => this is the ON DELETE CASCADE of a draft delete.
  IF v_status IS NOT NULL AND v_status <> 'draft' THEN
    RAISE EXCEPTION 'invoice lines are immutable once the invoice is %', v_status;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER invoice_lines_guard
  BEFORE INSERT OR UPDATE OR DELETE ON billing.invoice_lines
  FOR EACH ROW EXECUTE FUNCTION billing.guard_invoice_lines();

-- ---------------------------------------------------------------------------
-- Grants: service_role only. anon/authenticated have no schema USAGE and get
-- explicit revokes as a second gate.
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA billing TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA billing TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA billing GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA billing GRANT USAGE ON SEQUENCES TO service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA billing FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA billing FROM PUBLIC, anon, authenticated;
