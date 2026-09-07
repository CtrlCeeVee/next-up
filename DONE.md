# Done — Next-Up  (archive; newest first)

- [x] T-004 FEAT HIGH — club pages /clubs/<slug> for each club in code/web/src/lib/clubs.ts; /league/2 and /league/3 redirect to them — done 2026-09-07, verified ✅
      static pages with venue, league night, how to join, SportsActivityLocation + BreadcrumbList schema; linked from home, city page, About, For clubs; in sitemap · commit 3a797ac
- [x] T-006 BUG MED — code/web header hid the nav links below sm; mobile menu added — done 2026-09-07, verified ✅
      fix: MobileMenu client component + shared NAV_LINKS; solid panel (nested backdrop-filter composited under content) · commit 9ac2466
- [x] T-005 FEAT MED — contact form on code/web /contact sending via Resend — done 2026-09-07, verified ✅ (test message received)
      server action, honeypot, validation, reply-to = visitor; RESEND_API_KEY in code/web/.env.local, add to Vercel at go-live · commit b3c441e
