<!-- [ ] todo · [~] done, awaiting verification · [x] verified · [-] cancelled · [!] blocked
     Tags: BUG FEAT SEC CHORE DECISION · Sev: CRIT HIGH MED LOW
     Next ID: T-018 · Spec: /todo-add
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
- [ ] T-008 FEAT LOW — FAQ page on code/web (players and clubs sections) only if it targets real queries; check demand before writing _(src: chat 09-07)_
- [ ] T-013 BUG LOW — code/web/src/app/icon.png and apple-icon.png are 119x124 (non-square); supply a 180x180 apple-touch icon and a square favicon source _(src: T-007 design pass)_
- [ ] T-016 FEAT LOW — club logos and league-night photos on club cards and club pages, replacing the initials monograms; needs assets from the clubs _(src: T-007 design pass)_
- [ ] T-010 CHORE — after go-live: delete code/client, update CLAUDE.md, Docs/DEVELOPMENT.md and root package.json scripts _(src: chat 09-07)_
      needs: T-009 verified stable
- [ ] T-011 CHORE — remove stale Docs/SEO_GUIDE.md and Docs/SEO_DEPLOYMENT_CHECKLIST.md; fast-forward local master to origin/master _(src: audit 09-06)_
- [ ] T-012 CHORE — authority: ask each club to link to its Next-Up page from its site and socials; list Next-Up on pickleballsa.com, Pickleheads and Global Pickleball Network _(src: Docs/SEO_AUDIT.md)_
      needs: T-004 live
- [ ] T-014 CHORE — re-encode code/web/public/og-image.png (736 KB) to roughly 150 KB at the same 2094x630 _(src: T-007 design pass)_
- [ ] T-015 CHORE — move the contact phone number from code/web/src/app/contact/page.tsx into code/web/src/lib/site.ts beside CONTACT_EMAIL _(src: T-007 design pass)_
- [ ] T-017 CHORE — root npm audit: two advisories in shell-quote via concurrently 9.2.1 (dev-only, root package.json); run npm audit fix at the root and commit package-lock.json _(src: setup 09-18)_

## Decisions

- [ ] T-003 DECISION — pick one book of record for invoicing: Xero (INV-000x, holds GPC activation fee) vs billing schema (NE-YYYY-MM) currently coexist; accountant needs a single ledger _(src: chat 07-10)_
