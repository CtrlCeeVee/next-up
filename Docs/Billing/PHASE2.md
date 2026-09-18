# Billing Console — Phase 2

Status: **built 2026-07-10** (todo T-002, awaiting owner verification).
Remaining: Vercel project + `billing.next-up.co.za` DNS (see Deployment below).

## What it is

A private web console for the owner to review statements, manage write-offs,
and issue/track invoices without writing SQL. It is a window onto the
`billing` schema; all billing logic stays in the database functions
(`Docs/BILLING.md`).

- **Frontend**: Vite + React + Tailwind SPA in `code/billing-console/`
  (`npm run dev:billing` → http://localhost:5174). Sign in with the owner's
  app account (Supabase Auth email/password).
- **Backend**: one Supabase Edge Function, `billing-api` (source in
  `supabase/functions/billing-api/index.ts`). It connects to Postgres
  directly (postgres.js over the platform-provided `SUPABASE_DB_URL`), which
  is how it reaches the `billing` schema without exposing it through
  PostgREST.

## Security model (unchanged constraints)

- The `billing` schema stays out of PostgREST's exposed schemas; the service
  role key and DB URL never reach the browser. All reads/writes go through
  the edge function.
- Auth: the SPA sends the user's Supabase session JWT; the function resolves
  it with `auth.getUser()` and rejects (403) any user id not in the
  `BILLING_ADMIN_USER_IDS` env var (comma-separated). If the env var is
  unset, it fails closed to the owner's id, which is baked into the source.
  Platform `verify_jwt` is ON as defense in depth, but the in-code check is
  the real gate (the bare anon key passes platform verification and is
  rejected in code).
- The function holds no business logic: writes delegate to the existing
  `billing.*` DB functions or a plain INSERT into `billing.adjustments`; the
  schema's guard triggers and CHECK constraints are the validation layer.
- Read-only against `public` tables (only via `billing.statement()`).

## API routes (billing-api)

| Route | Backs |
|---|---|
| `GET /clients` | client list |
| `GET /statement?client_id&from&to` | `billing.statement()` |
| `GET /invoices`, `GET /invoices/:id` | lists, detail (header + lines + terms date) |
| `POST /invoices/generate` | `billing.generate_invoice()` (NULL = nothing to bill, informational) |
| `POST /invoices/:id/issue` / `mark-paid` / `void {reason}` | status transitions |
| `DELETE /invoices/:id` | draft deletion (guard trigger blocks non-drafts) |
| `GET /adjustments`, `POST /adjustments` | write-offs and once-off credits/debits |
| `GET /cron-health` | last runs of `billing-generate-monthly-drafts` |

## Console features

- **Invoices**: list with status badges; generate a month's draft; detail
  view with lines; actions legal for the status (draft: issue / regenerate /
  delete; issued: mark paid / void with reason), all behind confirm dialogs.
- **Statement**: any client + date range; per-night numbers; write-off button
  per night (reason required, appears verbatim on the invoice), then offers
  to regenerate a covering draft.
- **Adjustments**: list + once-off credit/debit entry.
- **Documents**: renders the formal invoice in-browser from the canonical
  template (`Docs/Billing/invoice-template.html`, imported at build time —
  single source of truth) with View and Print/PDF buttons. Formal-document
  rules are enforced in code: every interpolated value is sanitized so no
  em-dash can reach a document; drafts are watermarked "(DRAFT)".
- **System**: last five runs of the monthly pg_cron job.

## Deployment

- **Edge function**: deployed via Supabase MCP / CLI. Optional secret:
  `BILLING_ADMIN_USER_IDS` (defaults to the owner id if unset).
- **Frontend (pending)**: Vercel project with Root Directory
  `code/billing-console` (framework Vite; the repo's client project on
  Vercel is separate). Env vars: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`. Requires "Include source files outside of the
  Root Directory" (default on) because the invoice template is imported from
  `Docs/Billing/`. Then add `billing.next-up.co.za` as a custom domain (one
  CNAME record).

## Non-goals (still)

Email delivery (Resend deferred by owner 2026-07-10; `clients.billing_email`
must be set before wiring it), client self-service portal, payment
collection, multi-user roles, Xero sync (pending decision T-003).
