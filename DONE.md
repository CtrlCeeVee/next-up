# Done — Next-Up  (archive; newest first)

- [x] T-009 FEAT HIGH — go live: www.next-up.co.za now serves code/web from Vercel (root directory code/web, Next.js preset, RESEND_API_KEY, apex 308), sitemap resubmitted in GSC — done 2026-09-18, verified ✅
      PR #23 merged d17b0ea; live heads, canonicals, JSON-LD, 404, 308 redirects and bot access verified; Lighthouse and remaining owner step (Request indexing) in Docs/SEO_AUDIT.md · commits d17b0ea, 47fb4e4
- [x] T-007 FEAT MED — design pass on code/web (Phase 3): navy court chrome, design system in src/components/ui/, app screens in phone frames, deep green conversion panels, icon tones with meaning — done 2026-09-18, verified ✅
      design pass 26ec17c (2026-09-07) + review round 1 colour consolidation aed7df7 (2026-09-18); record in Docs/WEB_DESIGN_PASS.md · commits 26ec17c, aed7df7
- [x] T-004 FEAT HIGH — club pages /clubs/<slug> for each club in code/web/src/lib/clubs.ts; /league/2 and /league/3 redirect to them — done 2026-09-07, verified ✅
      static pages with venue, league night, how to join, SportsActivityLocation + BreadcrumbList schema; linked from home, city page, About, For clubs; in sitemap · commit 3a797ac
- [x] T-006 BUG MED — code/web header hid the nav links below sm; mobile menu added — done 2026-09-07, verified ✅
      fix: MobileMenu client component + shared NAV_LINKS; solid panel (nested backdrop-filter composited under content) · commit 9ac2466
- [x] T-005 FEAT MED — contact form on code/web /contact sending via Resend — done 2026-09-07, verified ✅ (test message received)
      server action, honeypot, validation, reply-to = visitor; RESEND_API_KEY in code/web/.env.local, add to Vercel at go-live · commit b3c441e
