-- Line descriptions and write-off reasons appear verbatim on client invoice
-- documents, which are formal: no em-dashes. Replace the description's
-- '— WRITTEN OFF' suffix with ' (written off)'. Only the description
-- expression changes; all other logic is identical to billing_functions.

CREATE OR REPLACE FUNCTION billing.generate_invoice(p_client_id integer, p_period_start date, p_period_end date)
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
      || CASE WHEN s.is_written_off THEN ' (written off)' ELSE '' END,
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
