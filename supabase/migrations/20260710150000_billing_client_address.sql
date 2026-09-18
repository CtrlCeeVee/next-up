-- Billing: client postal address for invoice documents ({{CLIENT_ADDRESS}}).
-- Additive, billing schema only; no public schema objects touched.

ALTER TABLE billing.clients ADD COLUMN address text;

UPDATE billing.clients
SET address = '1 Fir Drive, Northcliff, Johannesburg, 2195'
WHERE code = 'NE';
