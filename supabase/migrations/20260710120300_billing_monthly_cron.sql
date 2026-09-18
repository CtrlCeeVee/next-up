-- Billing schema v1: monthly draft generation via pg_cron.
--
-- Runs 04:00 UTC on the 1st = 06:00 SAST (SAST is UTC+2, no DST), 2 hours
-- after the existing daily complete-past-league-nights job (jobid 1) — though
-- draft generation does not depend on night status. Creates DRAFT invoices
-- only; issuing and sending remain manual (see Docs/BILLING.md runbook).
-- Health check: SELECT * FROM cron.job_run_details ORDER BY start_time DESC;

SELECT cron.schedule(
  'billing-generate-monthly-drafts',
  '0 4 1 * *',
  'SELECT billing.generate_monthly_drafts()'
);
