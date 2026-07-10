# Billing Console — Phase 2 Spec

Status: not started (todo T-002). Depends on billing v1 (live since 2026-07-10).

## Goal

A private web console for the owner to review statements, manage write-offs,
and issue/track invoices without writing SQL. It is a window onto the
`billing` schema; all billing logic stays in the database functions
(`Docs/BILLING.md`).

## Constraints (non-negotiable)

- The `billing` schema stays out of PostgREST's exposed schemas; the service
  role key never reaches the browser. All reads/writes go through Supabase
  Edge Functions that hold the service role server-side.
- Auth: Supabase Auth session, verified in the edge function, checked against
  an owner allowlist (env var `BILLING_ADMIN_USER_IDS`). Everyone else gets 403.
- Console actions call the existing DB functions (`generate_invoice`,
  `issue_invoice`, `mark_invoice_paid`, `void_invoice`) and insert into
  `adjustments`. No SQL logic duplicated in TypeScript.
- Read-only against `public` tables; the console must never write to app data.

## Architecture

- **Frontend**: Vite + React + Tailwind SPA in `code/billing-console/`,
  deployed to Vercel at `billing.next-up.co.za`. Design system per CLAUDE.md
  (emerald glass morphism).
- **Backend**: one Supabase Edge Function (`billing-api`) with routes:
  - `GET  /statement?client&from&to` — arbitrary-range per-night report
  - `GET  /invoices` / `GET /invoices/:id` (header + lines)
  - `POST /invoices/generate` `{client_id, period_start, period_end}`
  - `POST /invoices/:id/issue` | `/mark-paid` | `/void {reason}`
  - `POST /adjustments` `{type, league_night_instance_id?, amount?, effective_date, reason}`
  - `GET  /clients`, `GET /cron-health` (last runs of the monthly job)

## Milestones

1. **Read-only**: clients, monthly statement view, custom date range,
   invoice list with status badges, line drill-down.
2. **Actions**: write-off button on a night row, regenerate draft, issue,
   mark paid, void with reason. Confirm dialogs on all state transitions.
3. **Documents**: render the invoice from `invoice-template.html` in-browser,
   download as PDF (print stylesheet). Formal-document rules apply: no
   em-dashes, terms as the single reference line.
4. **Deploy**: Vercel project + `billing.next-up.co.za` DNS, edge function
   deployed with `BILLING_ADMIN_USER_IDS` set.

## Non-goals (phase 2)

Email delivery, client self-service portal, payment collection, multi-user
roles, Xero sync (pending decision T-003).
