<!-- [ ] todo · [~] done, awaiting verification · [x] verified · [-] cancelled · [!] blocked
     Tags: BUG FEAT SEC CHORE DECISION · Sev: CRIT HIGH MED LOW
     Next ID: T-013 · Spec: /todo-add
     [x] + [-] (except DECISIONs) → DONE.md · resolved decisions stay below -->

# Todo — Next-Up

## Active

- [ ] T-001 SEC CRIT — enable RLS on 11 public tables; anon key can read/write all of them, incl. league_night_checkins that billing invoices derive from _(src: Supabase advisors, chat 07-10)_
      five tables (league_night_checkins, league_night_instances, matches, confirmed_partnerships, partnership_requests) already have policies written but RLS not enabled; six more (VersionInfo, push_devices, league_favourites, league_checkin_verification, league_checkin_pins, api_clients) need policies from scratch. Enabling without policy review will break the mobile app — coordinate with app repo.
- [ ] T-009 FEAT HIGH — go live: switch Vercel project next-up root directory to code/web (framework Next.js), add RESEND_API_KEY, apex 307 to 308, submit sitemap in GSC, request indexing, re-run Lighthouse _(src: chat 09-07)_
      needs: T-004, T-005, T-006, T-007. Owner runs the switch; nothing changes on Vercel before explicit approval.
- [~] T-002 FEAT MED — build phase-2 billing console: SPA on Vercel (billing.next-up.co.za) + Supabase Edge Functions (service role), owner-allowlisted auth _(src: chat 07-10)_
      scope: statement view, date-range reports, write-off button, generate/issue/mark-paid, invoice HTML/PDF download. Spec: Docs/Billing/PHASE2.md
      built 07-10: code/billing-console + billing-api edge function (deployed). Remaining human steps: log in to verify, connect Vercel project, DNS.
- [ ] T-007 FEAT MED — design pass on code/web (Phase 3): agree one visual direction first, then header/footer structure (players, clubs, company), hero imagery, section rhythm, card styling, page by page _(src: chat 09-07)_
- [ ] T-008 FEAT LOW — FAQ page on code/web (players and clubs sections) only if it targets real queries; check demand before writing _(src: chat 09-07)_
- [ ] T-010 CHORE — after go-live: delete code/client, update CLAUDE.md, Docs/DEVELOPMENT.md and root package.json scripts _(src: chat 09-07)_
      needs: T-009 verified stable
- [ ] T-011 CHORE — remove stale Docs/SEO_GUIDE.md and Docs/SEO_DEPLOYMENT_CHECKLIST.md; fast-forward local master to origin/master _(src: audit 09-06)_
- [ ] T-012 CHORE — authority: ask each club to link to its Next-Up page from its site and socials; list Next-Up on pickleballsa.com, Pickleheads and Global Pickleball Network _(src: Docs/SEO_AUDIT.md)_
      needs: T-004 live

## Decisions

- [ ] T-003 DECISION — pick one book of record for invoicing: Xero (INV-000x, holds GPC activation fee) vs billing schema (NE-YYYY-MM) currently coexist; accountant needs a single ledger _(src: chat 07-10)_
