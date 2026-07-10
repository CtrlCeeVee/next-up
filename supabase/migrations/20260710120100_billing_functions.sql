-- Billing schema v1: business functions.
--
-- All functions are SECURITY INVOKER with an empty search_path and fully
-- qualified names. They only SELECT from public tables (ACCESS SHARE — can
-- never block app writers) and write only to billing tables.
--
-- Billable-player definition (pinned; see Docs/BILLING.md):
--   COUNT(DISTINCT user_id) checked in for the night (any check-in row counts,
--   regardless of checkout / is_active), MINUS users holding an active
--   league_memberships row with role='admin' for that league (admins play
--   free). Users with no membership row (walk-ins) are billable.
-- A night is included if its date falls in range, it has at least one
-- check-in, and a billing.terms window covers its date (terms are joined
-- per-night, so pre-contract nights drop out and mid-month rate changes bill
-- each night at its own rate).

-- ---------------------------------------------------------------------------
-- statement: read-only per-night computation over a date range.
-- ---------------------------------------------------------------------------
CREATE FUNCTION billing.statement(p_client_id integer, p_from date, p_to date)
RETURNS TABLE (
  league_night_instance_id integer,
  line_date                date,
  total_checkins           integer,
  admin_checkins           integer,
  walkin_checkins          integer,
  billable_players         integer,
  per_player_fee           numeric(10,2),
  service_fee_pct          numeric(5,2),
  gross                    numeric(12,2),
  amount                   numeric(12,2),
  is_written_off           boolean,
  writeoff_reason          text
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  WITH nights AS (
    SELECT lni.id, lni.league_id, lni.date
    FROM public.league_night_instances lni
    JOIN billing.clients c ON c.id = p_client_id AND lni.league_id = c.league_id
    WHERE lni.date BETWEEN p_from AND p_to
  ),
  counts AS (
    SELECT n.id, n.date,
      COUNT(DISTINCT ch.user_id)::integer AS total_checkins,
      COUNT(DISTINCT ch.user_id) FILTER (WHERE lm.role = 'admin')::integer AS admin_checkins,
      COUNT(DISTINCT ch.user_id) FILTER (WHERE lm.user_id IS NULL)::integer AS walkin_checkins
    FROM nights n
    JOIN public.league_night_checkins ch ON ch.league_night_instance_id = n.id
    LEFT JOIN public.league_memberships lm
      ON lm.user_id = ch.user_id
     AND lm.league_id = n.league_id
     AND lm.is_active
    GROUP BY n.id, n.date
  )
  SELECT
    co.id,
    co.date,
    co.total_checkins,
    co.admin_checkins,
    co.walkin_checkins,
    (co.total_checkins - co.admin_checkins) AS billable_players,
    t.per_player_fee,
    t.service_fee_pct,
    round((co.total_checkins - co.admin_checkins) * t.per_player_fee, 2) AS gross,
    CASE WHEN a.id IS NOT NULL THEN 0.00
         ELSE round(round((co.total_checkins - co.admin_checkins) * t.per_player_fee, 2) * t.service_fee_pct / 100, 2)
    END AS amount,
    (a.id IS NOT NULL) AS is_written_off,
    a.reason AS writeoff_reason
  FROM counts co
  JOIN billing.terms t
    ON t.client_id = p_client_id
   AND co.date >= t.effective_from
   AND (t.effective_to IS NULL OR co.date <= t.effective_to)
  LEFT JOIN billing.adjustments a
    ON a.type = 'night_write_off'
   AND a.league_night_instance_id = co.id
  ORDER BY co.date, co.id;
$$;

-- ---------------------------------------------------------------------------
-- generate_invoice: create or idempotently regenerate a DRAFT for a period.
-- Refuses if an issued/paid invoice exists for the period. Returns NULL (with
-- a NOTICE) when there are no billable nights — no R0.00 invoices.
-- Numbering: CODE-YYYY-MM, suffixed -R1/-R2/... after voids.
-- ---------------------------------------------------------------------------
CREATE FUNCTION billing.generate_invoice(p_client_id integer, p_period_start date, p_period_end date)
RETURNS integer
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_client     billing.clients%ROWTYPE;
  v_invoice_id integer;
  v_number     text;
  v_void_count integer;
  v_line_count integer;
  v_total      numeric(12,2);
BEGIN
  SELECT * INTO v_client FROM billing.clients WHERE id = p_client_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'unknown billing client %', p_client_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM billing.invoices i
    WHERE i.client_id = p_client_id
      AND i.period_start = p_period_start
      AND i.status IN ('issued','paid')
  ) THEN
    RAISE EXCEPTION 'an issued/paid invoice already exists for client % period starting % — void it before regenerating',
      v_client.code, p_period_start;
  END IF;

  SELECT i.id INTO v_invoice_id
  FROM billing.invoices i
  WHERE i.client_id = p_client_id
    AND i.period_start = p_period_start
    AND i.status = 'draft'
  FOR UPDATE;

  IF v_invoice_id IS NULL THEN
    SELECT count(*) INTO v_void_count
    FROM billing.invoices i
    WHERE i.client_id = p_client_id
      AND i.period_start = p_period_start
      AND i.status = 'void';
    v_number := v_client.code || '-' || to_char(p_period_start, 'YYYY-MM')
             || CASE WHEN v_void_count > 0 THEN '-R' || v_void_count ELSE '' END;
    INSERT INTO billing.invoices (client_id, invoice_number, period_start, period_end, status)
    VALUES (p_client_id, v_number, p_period_start, p_period_end, 'draft')
    RETURNING id INTO v_invoice_id;
  ELSE
    DELETE FROM billing.invoice_lines il WHERE il.invoice_id = v_invoice_id;
  END IF;

  INSERT INTO billing.invoice_lines (
    invoice_id, line_no, league_night_instance_id, line_date, description,
    total_checkins, admin_checkins, walkin_checkins, billable_players,
    per_player_fee, service_fee_pct, gross, amount, is_written_off, writeoff_reason
  )
  SELECT
    v_invoice_id,
    row_number() OVER (ORDER BY s.line_date, s.league_night_instance_id),
    s.league_night_instance_id,
    s.line_date,
    'League night ' || to_char(s.line_date, 'DD Mon YYYY')
      || CASE WHEN s.is_written_off THEN ' — WRITTEN OFF' ELSE '' END,
    s.total_checkins, s.admin_checkins, s.walkin_checkins, s.billable_players,
    s.per_player_fee, s.service_fee_pct, s.gross, s.amount, s.is_written_off, s.writeoff_reason
  FROM billing.statement(p_client_id, p_period_start, p_period_end) s;

  GET DIAGNOSTICS v_line_count = ROW_COUNT;
  IF v_line_count = 0 THEN
    DELETE FROM billing.invoices i WHERE i.id = v_invoice_id;
    RAISE NOTICE 'no billable nights for client % in % .. % — no invoice created',
      v_client.code, p_period_start, p_period_end;
    RETURN NULL;
  END IF;

  SELECT COALESCE(sum(il.amount), 0) INTO v_total
  FROM billing.invoice_lines il WHERE il.invoice_id = v_invoice_id;

  UPDATE billing.invoices i
  SET total = v_total, period_end = p_period_end, generated_at = now()
  WHERE i.id = v_invoice_id;

  RETURN v_invoice_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- generate_monthly_drafts: pg_cron entry point (1st of month, 06:00 SAST).
-- Drafts the prior SAST calendar month for every client whose terms overlap
-- it. Per-client exception blocks so one failure cannot abort the others;
-- failures surface as WARNINGs in cron.job_run_details.
-- ---------------------------------------------------------------------------
CREATE FUNCTION billing.generate_monthly_drafts()
RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_period_start date := date_trunc('month', (now() AT TIME ZONE 'Africa/Johannesburg')::date - 1)::date;
  v_period_end   date;
  v_failed       integer := 0;
  r              RECORD;
BEGIN
  v_period_end := (v_period_start + interval '1 month' - interval '1 day')::date;
  FOR r IN
    SELECT DISTINCT c.id, c.code
    FROM billing.clients c
    JOIN billing.terms t ON t.client_id = c.id
     AND t.effective_from <= v_period_end
     AND (t.effective_to IS NULL OR t.effective_to >= v_period_start)
    ORDER BY c.id
  LOOP
    BEGIN
      PERFORM billing.generate_invoice(r.id, v_period_start, v_period_end);
    EXCEPTION WHEN OTHERS THEN
      v_failed := v_failed + 1;
      RAISE WARNING 'billing draft generation failed for client % (id %): %', r.code, r.id, SQLERRM;
    END;
  END LOOP;
  IF v_failed > 0 THEN
    RAISE WARNING 'billing.generate_monthly_drafts: % client(s) failed for period % .. %',
      v_failed, v_period_start, v_period_end;
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Status transitions. due_date = issue date (SAST) + 7 days per agreement.
-- ---------------------------------------------------------------------------
CREATE FUNCTION billing.issue_invoice(p_invoice_id integer)
RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  UPDATE billing.invoices i
  SET status = 'issued',
      issued_at = now(),
      due_date = (now() AT TIME ZONE 'Africa/Johannesburg')::date + 7
  WHERE i.id = p_invoice_id AND i.status = 'draft';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'invoice % is not an existing draft', p_invoice_id;
  END IF;
END;
$$;

CREATE FUNCTION billing.void_invoice(p_invoice_id integer, p_reason text)
RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  UPDATE billing.invoices i
  SET status = 'void',
      notes = COALESCE(i.notes || E'\n', '') || 'VOID: ' || p_reason
  WHERE i.id = p_invoice_id AND i.status = 'issued';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'invoice % is not an issued invoice (only issued invoices can be voided; drafts are deleted/regenerated)', p_invoice_id;
  END IF;
END;
$$;

CREATE FUNCTION billing.mark_invoice_paid(p_invoice_id integer)
RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  UPDATE billing.invoices i
  SET status = 'paid', paid_at = now()
  WHERE i.id = p_invoice_id AND i.status = 'issued';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'invoice % is not an issued invoice', p_invoice_id;
  END IF;
END;
$$;

-- Function grants: service_role only (schema USAGE already limits access).
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA billing FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA billing TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA billing REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
