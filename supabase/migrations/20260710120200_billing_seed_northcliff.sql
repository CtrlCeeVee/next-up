-- Billing schema v1: seed Northcliff Eagles (first and currently only client).
--
-- Terms per the signed Services Agreement + Schedule 1 v1.0
-- (Docs/Codes/NextUp-Northcliff-Eagles-Agreement.md): R50 per player per
-- league night, 10% service fee (VAT-inclusive if any), effective from the
-- contract start on 2026-06-04, open-ended.
--
-- Write-off: the 2026-06-24 league night (league_night_instances.id = 143)
-- is not billed due to the app outage that night, by agreement with the club.

INSERT INTO billing.clients (league_id, code, legal_name, contact_name, agreement_ref)
VALUES (
  2,
  'NE',
  'Northcliff Eagles',
  'Paul Goldhawk',
  'Services Agreement + Schedule 1 v1.0 (Docs/Codes/NextUp-Northcliff-Eagles-Agreement.md)'
);

INSERT INTO billing.terms (client_id, per_player_fee, service_fee_pct, effective_from, effective_to, agreement_version, notes)
SELECT c.id, 50.00, 10.00, DATE '2026-06-04', NULL, 'Schedule 1 v1.0',
       'R50 per player per league night; 10% service fee, inclusive of VAT if any'
FROM billing.clients c WHERE c.code = 'NE';

INSERT INTO billing.adjustments (client_id, league_night_instance_id, type, amount, effective_date, reason, created_by)
SELECT c.id, 143, 'night_write_off', NULL, DATE '2026-06-24',
       'App outage during league night — night not billed by agreement with club',
       'Luke Renton'
FROM billing.clients c WHERE c.code = 'NE';
