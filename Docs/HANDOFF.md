# Handoff: where Next-Up stands and how to pick it up

Updated 2026-09-17. Read this first on a new machine or in a fresh Claude session; `CLAUDE.md` points here. Claude Code's own memory is per machine and is not in the repo, so this file is the durable record of decisions and state that the code and git history do not show.

## 1. State of each workstream

Branch: `dev/general-updates`. `master` is what Vercel deploys (the legacy Vite site). On 2026-09-17 the branch was 14 commits ahead of `origin` and had a large uncommitted set (section 5).

| Workstream | State | Tracked in |
|---|---|---|
| Marketing site rebuild (`code/web`) | Phase 1 SEO audit done. Phase 2 done and committed: site foundation, club pages (T-004), Resend contact form (T-005), mobile menu (T-006). Phase 3 design pass (T-007) implemented on 2026-09-07, uncommitted, waiting for the owner's localhost review (section 2). | `Docs/SEO_AUDIT.md`, `todo.md`, `DONE.md` |
| Go-live of the new site (T-009) | Not started. Owner runs the switch: Vercel project `next-up` root directory to `code/web`, framework Next.js, add `RESEND_API_KEY`, apex redirect 307 to 308, submit sitemap in GSC, request indexing. Nothing on Vercel changes before explicit approval. | `todo.md` |
| Billing console (T-002) | Built 2026-07-10: `code/billing-console/` SPA plus the `billing-api` Supabase edge function (deployed). Files were still uncommitted on 2026-09-17. Remaining human steps: log in to verify, connect the Vercel project, DNS for `billing.next-up.co.za`. | `Docs/BILLING.md`, `Docs/Billing/PHASE2.md`, `todo.md` |
| RLS on 11 public tables (T-001, CRIT) | Not started. Enabling without policy review breaks the mobile app; coordinate with the app repo. | `todo.md` |
| Invoicing book of record (T-003) | Open decision: Xero versus the `billing` schema. | `todo.md` Decisions |

Product context: the app lives in the separate NextUp Sport mobile repo. This repo is the marketing site plus the ops and billing home. Supabase project `iwmjssxsonuomxqgtlua` is shared with the mobile app: additive changes only.

## 2. T-007 design pass: what was done and how to review it

Approved plan (2026-09-07, plan-mode questions): keep the existing identity ("tidy what exists"), add navy "court" chrome (header, homepage hero and footer navy in both colour modes), app screenshots in CSS phone frames, keep the light/dark toggle, deliver in one review and one commit. Full plan: `Docs/WEB_DESIGN_PASS.md`.

What changed (all in `code/web`; no copy, URL, metadata, JSON-LD, sitemap, redirect or club-data changes):

- Design system in `src/components/ui/` (`Section`, `Panel`, `Card`, `Button`, `Eyebrow`, `SectionHeading`, `IconTile`, `Stat`, `Monogram`, `PhoneFrame`, `Reveal`, `HeaderScrollSentinel`) and tokens in `src/app/globals.css` (`court-*` navy, `ball` yellow, `logo-blue`/`logo-teal`, DM Sans display font). The old `src/components/ui.ts` class strings are gone.
- Sticky navy header with a shadow once scrolled, active-link underline, navy mobile menu. Navy footer with Players / Clubs / Company columns and store badges; club pages are linked sitewide.
- Homepage: navy hero with two phone mockups and a stats strip, club cards with monograms and pinned buttons (fixes the misaligned cards), "How a league night works" with a phone screen per step, side-by-side "Run a club or league?" (navy) and download (green) panels.
- Inner pages share a compact navy intro band. Johannesburg page gained a Monday-to-Sunday league-night strip. Club pages gained a monogram and fact chips. For clubs has a phone in the hero and connected step cards.
- Smoothness: animated blurred blobs and per-card `backdrop-blur` removed (static gradient glow instead), `transition-all` and `hover:scale` on cards removed, reveal-on-scroll below the fold only, everything off under `prefers-reduced-motion`. First paint is never delayed: `Reveal` only hides content after hydration and only if it is below the fold.
- Assets: `public/app/*.png` are the screen areas cropped from the App Store listing. Raw screenshots from the app with the same file names are a drop-in upgrade.
- Docs: `code/web/README.md` and the root `CLAUDE.md` design-system section describe the new system.

Verified before handoff: `npm run lint` and `npm run build` clean, all 15 routes static; every page screenshotted at 1280 and 375 px in light and dark; mobile menu, keyboard focus rings and the reveal behaviour checked in Playwright; Lighthouse mobile on `/`: performance 92, accessibility 100, best practices 100, SEO 100, CLS 0 (live site: 91 / 78 / 100 / 100, CLS 0.03).

New UI strings introduced (not marketing copy, but flag them if unwanted): footer labels "Find a league", "Download the app", "Privacy policy", "Terms of service"; homepage eyebrow "Free on iOS and Android"; "No league night" on empty days of the Johannesburg strip.

How to review: from the repo root run `npm run dev:web` and open http://localhost:3000, or build it the way Vercel will (`cd code/web && npm run build && npx next start -p 3010`). Check both colour modes (toggle in the header), the phone width in Chrome device mode, and any line that reads like a copy change (there should be none). On approval: commit as one commit referencing T-007, move the entry to `DONE.md` with the SHA, then the next item is T-008 (FAQ, only if GSC shows real query demand) and then T-009.

Follow-ups surfaced by the design pass, not logged (owner decides): `src/app/apple-icon.png` and `icon.png` are 119x124 (Apple expects 180x180); `public/og-image.png` is 736 KB; the contact phone number is hardcoded in `contact/page.tsx` instead of `lib/site.ts`; club logos and league-night photos would replace the monograms.

## 3. Owner rules that are not in the code

- Never deploy or change anything on Vercel without explicit approval. Review happens on localhost only; no preview deployments.
- Discuss before making changes. Do not change copy unless it is an improvement. The homepage names only "South Africa"; geography belongs on city and club pages.
- Club data is hand-maintained in `code/web/src/lib/clubs.ts`; the website never reads Supabase. Pickle View is a demo league and must never appear publicly. Do not show court counts.
- Password reset is app-only (`/reset-password` redirects home). No Instagram or Facebook links.
- Go-live is the last item. A FAQ page only if it meaningfully contributes to SEO.
- Work is tracked in `todo.md` through the `/todo-add` and `/todo-do` skills (now in `.claude/skills/`). No todo entry without an explicit go-ahead. Every finished item gets a completion report ending with a distinct follow-ups line. Commit only on approval, one commit per item, message referencing `T-NNN`; never push without the owner.
- One focused change at a time, tested before moving on. Developer-led design. Factual documentation.
- Client-facing documents (invoices, `Docs/Billing/invoice-template.html`, adjustment reasons) are strictly formal: never an em-dash, terms as a numbered list.
- `AskUserQuestion` must never use option previews or notes; put comparisons in the option descriptions or in chat.
- Secrets are never pasted into chat, commits or docs.

## 4. Setting up another machine

1. Clone the repo, check out `dev/general-updates`, run `npm install` at the root and in `code/web` (also `code/client`, `code/server`, `code/billing-console` if you need them).
2. Copy these gitignored files by hand; they hold secrets and are not in git:
   - `code/web/.env.local`: `RESEND_API_KEY`
   - `code/client/.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
   - `code/server/.env`: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
   - `.mcp.json`: the Supabase MCP server (HTTP, `Authorization: Bearer <personal access token>` from supabase.com/dashboard/account/tokens). `.claude/settings.local.json` (tracked) already enables it.
3. Add the Google Search Console MCP server (project scope, it is stored per machine):
   ```
   claude mcp add gsc -e GSC_PROPERTY=sc-domain:next-up.co.za -- npx -y @lukerent/google-search-console-mcp
   ```
   Sign in to Google when the server first runs. The `seo` skill depends on these `mcp__gsc__*` tools.
4. Skills: `seo`, `todo-add` and `todo-do` now live in `.claude/skills/` and travel with the repo. Delete the copies in `~/.claude/skills/` on the old machine to avoid duplicates.
5. Copy `~/.claude/CLAUDE.md` (the user-level rules about `AskUserQuestion` and todo discipline); its content is summarised in section 3.
6. Plugins are per machine; reinstall with `/plugin`: `playwright`, `vercel`, `context7`, `frontend-design`, `claude-md-management`. The Claude in Chrome extension is optional.
7. Claude Code memory does not transfer. Start the first session with "read Docs/HANDOFF.md and todo.md, then continue from the next step in section 6".

## 5. Commits made on 2026-09-17 so the branch can move machines

- `26ec17c` T-007 design pass (all of `code/web`, root `CLAUDE.md`). Committed before the owner's review on purpose; `todo.md` keeps T-007 as `[~]` awaiting verification, so the review still happens and the entry is archived to `DONE.md` on approval.
- `b33473b` T-002 billing console work from 2026-07-10 (`code/billing-console/`, `supabase/functions/billing-api`, the client address migration, billing docs, changelog). Committed as found, not re-reviewed. The only embedded key is the public Supabase anon key with a comment explaining why.
- The commit after this one carries the handoff itself: this file, `Docs/WEB_DESIGN_PASS.md`, `.claude/skills/`, `.gitignore`, `Docs/SEO_AUDIT.md` and `todo.md` (T-013 to T-016 logged from the design pass follow-ups).

Nothing has been pushed by Claude; the owner pushes.

## 6. Next steps, in order

1. Push `dev/general-updates` (`git push -u origin dev/general-updates`).
2. On the other machine: sections 4 then 2. Review T-007 on localhost; on approval move it to `DONE.md` with `26ec17c`, or request changes.
3. T-008: check GSC for FAQ-style queries before writing anything.
4. T-009 go-live, run by the owner, then T-010 to T-016 as they earn their place.
