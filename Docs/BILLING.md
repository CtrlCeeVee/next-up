# Billing System

Deterministic invoicing for club service fees, computed from App check-in data.
The system of record is the production Supabase database (dedicated `billing`
schema). This repo is the billing home:

| Path | Contents |
|---|---|
| `Docs/BILLING.md` | This document: rules, runbook, procedures |
| `Docs/Billing/agreements/` | Signed club agreements (source of the terms) |
| `Docs/Billing/invoice-template.html` | Invoice document template |
| `Docs/Billing/invoices/` | Issued invoice documents (`NE-2026-06.html/.pdf`) |
| `Docs/Billing/PHASE2.md` | Billing console: architecture, security model, deployment |
| `code/billing-console/` | The console SPA (`npm run dev:billing`) |
| `supabase/functions/billing-api/` | Edge function backing the console (service role, owner allowlist) |
| `supabase/migrations/` | Mirror of the applied DB migration history |

The `billing` schema is **not** exposed through the Supabase API (PostgREST
serves only `public`/`graphql_public`) and all privileges are revoked from
`anon`/`authenticated` — only the service role and direct SQL can touch it.
No billing object references public tables in a way that can block the app:
one outbound FK (`clients.league_id`, ON DELETE SET NULL) and read-only
SELECTs. Nothing is ever sent automatically; the system produces **drafts**.

## The formula

Per league night, per the signed agreement (Schedule 1):

```
gross        = billable_players x per_player_fee     (per night)
service fee  = round(gross x service_fee_pct / 100)  (per night, summed per month)
```

**Billable players** (pinned definition):
`COUNT(DISTINCT user_id)` of check-ins for the night — any check-in counts,
regardless of later checkout, `is_active`, or repeat check-ins — **minus**
users holding an active `league_memberships` row with `role='admin'` for that
league (admins play free). Users with **no** membership row (walk-ins) are
billable. Admin status is read at generation time; regenerating a draft picks
up corrections, issued invoices never change.

**A night is billed** if: its `date` falls in the invoice period, it has at
least one check-in, and a `billing.terms` window covers its date. Terms are
joined per-night, so pre-contract nights drop out automatically and a
mid-month rate change bills each night at its own rate. Zero-check-in nights
never appear. Months with no billable nights produce no invoice (no R0.00
invoices).

**Write-offs**: a `night_write_off` adjustment zeroes a night's fee; the line
still appears on the statement with its would-be numbers and the reason, so
the club sees exactly what was not charged.

## Schema (5 tables, `billing.*`)

| Table | Purpose |
|---|---|
| `clients` | One row per invoiced club. `code` is the invoice prefix (NE). |
| `terms` | Date-versioned Schedule 1 terms (fee, %, effective range). Overlaps rejected by trigger. |
| `adjustments` | Manual entries: `night_write_off` zeroes a night; `credit`/`debit` become their own invoice lines in the period containing `effective_date` (debits add, credits subtract). Always with a reason. |
| `invoices` | Header + status machine: `draft → issued → paid`, `issued → void`. |
| `invoice_lines` | Frozen per-night snapshot (all counts, fee, %, gross, amount). |

Immutability is enforced by triggers, not convention: issued invoices and
their lines reject all edits (even via service role) except the legal
transitions; only drafts can be deleted or regenerated; `paid`/`void` are
fully frozen. One non-void invoice per client per period (partial unique
index) — corrections require void, then reissue as `NE-YYYY-MM-R1`, `-R2`, …

## Functions

| Function | Use |
|---|---|
| `billing.statement(client_id, from, to)` | Read-only per-night report for ANY date range. Writes nothing. Nights only; credit/debit adjustments appear on invoices, not here. |
| `billing.generate_invoice(client_id, period_start, period_end)` | Create/regenerate the period's DRAFT. Idempotent; refuses if issued/paid exists. |
| `billing.generate_monthly_drafts()` | Cron entry point: drafts the prior calendar month (SAST) for all clients with covering terms. |
| `billing.issue_invoice(id)` | draft → issued; stamps `issued_at`, `due_date` = SAST date + 7. |
| `billing.mark_invoice_paid(id)` | issued → paid. |
| `billing.void_invoice(id, reason)` | issued → void (reason appended to notes). |

## Monthly runbook

The pg_cron job `billing-generate-monthly-drafts` (`0 4 1 * *` UTC = 06:00
SAST on the 1st) drafts the previous month. Then review and issue — normally
via the **billing console** (`Docs/Billing/PHASE2.md`): open the draft,
check the lines, Issue, Print/PDF, send, Mark paid on EFT. The SQL
equivalents below remain the fallback:

1. **Review the draft** (compare against the club's own numbers):
   ```sql
   SELECT * FROM billing.invoices WHERE status = 'draft';
   SELECT * FROM billing.invoice_lines WHERE invoice_id = <id> ORDER BY line_no;
   ```
2. **Fix if needed** — add a write-off / correct memberships in the app — then
   regenerate (same invoice number, fresh numbers):
   ```sql
   SELECT billing.generate_invoice(<client_id>, '<YYYY-MM-01>', '<YYYY-MM-last>');
   ```
3. **Issue**: `SELECT billing.issue_invoice(<id>);`
4. **Send**: render `Docs/Billing/invoice-template.html` with the invoice data
   and email it to the club (manual for now).
5. **On EFT received**: `SELECT billing.mark_invoice_paid(<id>);`

**Cron health check** (run when reviewing, or if no draft appeared):
```sql
SELECT jobname, status, return_message, start_time
FROM cron.job_run_details d JOIN cron.job j USING (jobid)
WHERE j.jobname = 'billing-generate-monthly-drafts'
ORDER BY start_time DESC LIMIT 5;
```

## Procedures

**Write off a night** (before issuing; regenerate after):
```sql
INSERT INTO billing.adjustments (client_id, league_night_instance_id, type, effective_date, reason, created_by)
VALUES (<client_id>, <instance_id>, 'night_write_off', '<night date>', '<why>', '<who>');
```
The `reason` text appears verbatim on the client's invoice document. Invoices
are formal: use complete, neutral sentences and never em-dashes (rendered as
"Written off: `<reason>`. Not billed.").

**Once-off charge or credit** (e.g. an activation fee; billed on the invoice
whose period contains `effective_date`, so add it before that period is
issued — the reason is the client-facing line description):
```sql
INSERT INTO billing.adjustments (client_id, type, amount, effective_date, reason, created_by)
VALUES (<client_id>, 'debit', 500.00, '<date>', 'Once-off activation and onboarding fee for the NextUp platform', '<who>');
```

**Change rates / new agreement schedule** — never edit the rate on an existing
row; close it and add a new one:
```sql
UPDATE billing.terms SET effective_to = '<last day at old rate>' WHERE id = <current terms id>;
INSERT INTO billing.terms (client_id, per_player_fee, service_fee_pct, effective_from, agreement_version, notes)
VALUES (<client_id>, <fee>, <pct>, '<first day at new rate>', 'Schedule 1 vX', '<summary>');
```

**Correct an issued invoice**: `void_invoice(id, reason)` → fix the underlying
data/adjustments → `generate_invoice(...)` again (new draft gets `-R1` suffix)
→ review → issue.

**Add a client**: insert into `billing.clients` (league_id from
`public.leagues`, unique short `code`) + a `billing.terms` row effective from
the contract start date. The next monthly run picks them up automatically.

## Acceptance record (June 2026, NE-2026-06)

First real invoice, verified 2026-07-10 against raw check-in data. Contract
effective 2026-06-04, so the Jun 1 and Jun 3 nights are excluded; Jun 24
(instance 143) written off due to the app outage.

| Night | Check-ins | Admin (free) | Billable | Gross R | Fee R |
|---|---|---|---|---|---|
| Jun 8 | 38 | 2 | 36 | 1,800.00 | 180.00 |
| Jun 10 | 44 | 2 | 42 | 2,100.00 | 210.00 |
| Jun 15 | 46 | 3 | 43 | 2,150.00 | 215.00 |
| Jun 17 | 37 | 4 | 33 | 1,650.00 | 165.00 |
| Jun 22 | 47 | 2 | 45 | 2,250.00 | 225.00 |
| Jun 24 | 59 | 3 | 56 | 2,800.00 | 0.00 (write-off) |
| Jun 29 | 38 | 3 | 35 | 1,750.00 | 175.00 |
| **Total** | | | | | **1,170.00** |

## Known caveats

- **Source data is unprotected**: RLS is disabled on `league_night_checkins`
  and related public tables, so the billing *basis* is writable with the anon
  key until the deferred RLS project lands. The billing schema itself is not
  reachable, but the counts it reads are only as trustworthy as the app data.
- **Vouchers/PINs are not billing data**: `league_checkin_pins` links to no
  user or night; exemption is role-based only.
- **VAT**: NextUp Sport (Pty) Ltd is not VAT-registered; invoices carry the
  agreement's "inclusive of VAT, if any" wording with no VAT line.
- **Future**: when in-app payments land, the billing basis moves from check-in
  counts to payment records — new terms version + a v2 of
  `billing.statement()`; the snapshot schema needs no change.
