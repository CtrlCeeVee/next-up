<!-- [ ] todo · [~] done, awaiting verification · [x] verified · [-] cancelled · [!] blocked
     Tags: BUG FEAT SEC CHORE DECISION · Sev: CRIT HIGH MED LOW
     Next ID: T-004 · Spec: /todo-add
     [x] + [-] (except DECISIONs) → DONE.md · resolved decisions stay below -->

# Todo — Next-Up

## Active

- [ ] T-001 SEC CRIT — enable RLS on 11 public tables; anon key can read/write all of them, incl. league_night_checkins that billing invoices derive from _(src: Supabase advisors, chat 07-10)_
      five tables (league_night_checkins, league_night_instances, matches, confirmed_partnerships, partnership_requests) already have policies written but RLS not enabled; six more (VersionInfo, push_devices, league_favourites, league_checkin_verification, league_checkin_pins, api_clients) need policies from scratch. Enabling without policy review will break the mobile app — coordinate with app repo.
- [ ] T-002 FEAT MED — build phase-2 billing console: SPA on Vercel (billing.next-up.co.za) + Supabase Edge Functions (service role), owner-allowlisted auth _(src: chat 07-10)_
      scope: statement view, date-range reports, write-off button, generate/issue/mark-paid, invoice HTML/PDF download. Spec: Docs/Billing/PHASE2.md

## Decisions

- [ ] T-003 DECISION — pick one book of record for invoicing: Xero (INV-000x, holds GPC activation fee) vs billing schema (NE-YYYY-MM) currently coexist; accountant needs a single ledger _(src: chat 07-10)_
