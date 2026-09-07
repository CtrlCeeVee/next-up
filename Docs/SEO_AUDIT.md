# SEO Audit: next-up.co.za

Date: 2026-09-06
Scope: the public marketing site at https://www.next-up.co.za (Vite + React SPA on Vercel). The product itself now lives in the NextUp Sport mobile app.

## Evidence used

- Live responses via curl with browser and bot user agents (Googlebot, ClaudeBot, ChatGPT-User, PerplexityBot).
- Rendered DOM via headless Chromium on every route.
- Lighthouse 12.8.2, mobile, simulated throttling, run locally (PageSpeed Insights API quota was exhausted; no CrUX field data exists for this site regardless).
- Source at `origin/master` commit `9dbdeb9` ("Redirect web to native apps and remove PWA", 2026-06-08), which is the deployed build. The working branch `dev/general-updates` does not contain that commit.
- Supabase `public` schema, read-only.
- Web search for the target queries, to classify what already ranks.

Google Search Console (`sc-domain:next-up.co.za`) was read on 2026-09-06 after the property re-pin. See "Search Console evidence" below.

## Search Console evidence (2026-09-06)

16 months, 2025-05-06 to 2026-09-04, web search. Rows grouped by page or query omit anonymised low-volume queries, so they sum to less than the total.

| Page | Clicks | Impressions | Position | Index status |
| --- | --- | --- | --- | --- |
| `/` | 131 | 494 | 5.5 | Indexed, last crawled 2026-08-27 |
| `/auth` | 23 | 72 | 4.8 | Indexed. Google chose `/auth` as canonical despite the page declaring `/`. Now the app interstitial |
| `/about` | 1 | 9 | 5.3 | Unknown to Google |
| apex `next-up.co.za/` | 0 | 13 | 12.2 | Google sometimes indexes the apex because the redirect is 307 |
| `/terms` | 0 | 5 | 2.6 | Unknown to Google |
| `/privacy` | 0 | 2 | 9.0 | Unknown to Google |
| `/contact` | 0 | 0 | | Crawled, not indexed. Canonical mismatch. Linked from the App Store listing |
| `/leagues`, `/league/2`, `/league/3`, `/leaderboard` | 0 | 0 | | Unknown to Google |

Total: 155 clicks, 533 impressions, position 5.7. Almost all clicks are brand queries ("next up", "next-up", "nextup pickleball"). Non-brand demand already exists and lands on the homepage with no matching content:

| Query | Impressions | Position |
| --- | --- | --- |
| northcliff eagles pickleball | 9 | 13.1 |
| gpc pickleball | 4 | 8.5 |
| northcliff country club pickleball | 1 | 13.0 |
| pickleball johannesburg | 1 | 1.0 |
| pickleball south africa leagues | 1 | 12.0 |

Last 90 days versus the 90 before: homepage clicks 19 (down 63), position 7.2 (down 3.5 places). `/auth` clicks 0 (down 13). The June 2026 move to the app interstitial cost the site most of its clicks. The sitemap was last read by Google on 2025-12-24.

Consequences for the rebuild: keep `/`, `/about`, `/contact`, `/privacy` and `/terms` at the same URLs; 308 `/auth` and the other product URLs to the homepage rather than 404; fix the apex redirect to 308; build club pages, because the club-name queries are already being served the homepage at position 8 to 13.

## Verdict

The site can rank for one page at most, and that page says nothing a searcher in South Africa types. Every route returns the same HTML document with the same title, the same description, and a canonical pointing at the homepage. The body is empty until 125 KB of JavaScript runs. The rendered page contains no internal links at all. The club and league pages that the ranking goal depends on do not exist: `/league/2` now renders a "Next-Up has moved to the app" interstitial.

## Findings, ranked

### Blocking

1. **One head for every route.** `/`, `/about`, `/leagues`, `/league/2` all return byte-identical HTML. `document.title` is identical on every route after render. `rel=canonical` is `https://www.next-up.co.za/` on all of them. Google resolves every URL to the homepage, so nothing except the homepage can be indexed as its own page.
2. **No server-rendered content.** Raw HTML body is `<div id="root"></div>`. Text appears only after the JS bundle executes. Googlebot does render JavaScript, but low-authority sites sit in the render queue for days to weeks and any render failure yields an empty page. Lighthouse shows the same symptom from the user side: FCP 3.8 s, LCP 4.1 s, and the LCP element is the hero paragraph (text waiting on JS).
3. **Zero crawlable internal links.** The rendered homepage has exactly two `<a>` elements: App Store and Google Play. About, Contact, Privacy, Terms, Leaderboard and the league cards are all `<button onClick={navigate()}>`. Google discovers no internal URLs from any page. The sitemap is the only path to `/about` and friends. Lighthouse's `crawlable-anchors` audit passes only because there are no internal anchors to fail.
4. **No pages for the entities people search for.** Supabase holds 3 real leagues (Northcliff Eagles, GPC Pickleball, Pickle View) with venue, address, days, start times, court labels, member counts and 20 to 71 league nights each. The homepage shows two of them as hard-coded, unlinked cards. `/league/:id` is the app interstitial. For the query "Northcliff Eagles pickleball" the current top results are a Pickleheads court listing, Instagram, Playtomic, Facebook and a Destinali directory entry: the SERP page type is "club or venue listing". A Next-Up club page with address, schedule, courts, membership and how to join fits that SERP. The site currently offers nothing to it.
5. **Soft 404 on every unknown URL.** The Vercel catch-all rewrite returns 200 for any path. `/does-not-exist` renders a blank page with status 200. Google treats these as soft 404s; they waste crawl budget and dilute quality signals.

### Important

6. **Apex redirect is temporary.** `https://next-up.co.za/*` redirects to `https://www.next-up.co.za/*` with 307. It should be 308 (Vercel domain redirect setting) or 301. The www host is the right canonical: OG tags, canonical, robots and sitemap all already use it. `http` to `https` is already 308.
7. **Sitemap is stale and partly wrong.** Seven URLs, every `lastmod` set to 2025-11-30, includes `/auth` (now the app interstitial), omits every league or club URL. `changefreq` and `priority` are ignored by Google. It needs to be generated from data at build time.
8. **Structured data describes a product that no longer exists in that form.** `SoftwareApplication` with `offers.price: "0"` and no `priceCurrency` (invalid Offer). `Organization.sameAs` is empty. No `MobileApplication`, no app store links, no schema for clubs or venues. Three different organisation names in use: "Next-Up" (site), "NextUp Sport" (App Store), "Nextup Sport (PTY) LTD" (contact page).
9. **Titles and copy target the wrong market.** Title and description say "for pickleball clubs worldwide". The ranking goal is South African leagues, clubs, venues and cities. The H1 "Discover Amazing Pickleball Leagues" carries no location. Target terms are: pickleball league Johannesburg / Sandton / Randburg / South Africa, each club name, each venue name.
10. **Thin content.** Visible text: homepage about 1,300 characters, About about 1,800, Contact about 950. Not enough to rank for anything beyond the brand name.

### Performance and accessibility (Lighthouse mobile, simulated)

| Metric | Value |
| --- | --- |
| Performance / Accessibility / Best Practices / SEO | 78 / 78 / 100 / 100 |
| First Contentful Paint | 3.8 s |
| Largest Contentful Paint | 4.1 s (hero paragraph) |
| Total Blocking Time | 10 ms |
| Cumulative Layout Shift | 0 |
| Total transfer | 557 KB over 11 requests |
| Main JS bundle | 125 KB brotli, 441 KB raw, 144 KB reported unused |
| gtag.js | 170 KB, the largest single download |
| logo.png | 179 KB, 931x280, rendered at 266 px, loaded twice, no width/height |
| Render-blocking | Google Fonts CSS (Inter) plus app CSS, estimated 920 ms |

The SEO score of 100 is misleading: Lighthouse checks only the homepage's tags, not whether other pages can exist.

Accessibility failures: the viewport meta uses `user-scalable=no` and `maximum-scale=1`, which blocks pinch zoom; the theme toggle button has no accessible name.

The service worker is still registered on the deployed build. A marketing site does not need one, and it is a known source of stale content.

### Fine as is

- robots.txt allows everything relevant. `Disallow: /admin/` and `/api/` are harmless. `Crawl-delay` is ignored by Google and can go.
- HTTPS and HSTS are in place. Bot user agents get 200 on www; nothing is blocked at the edge.
- `meta keywords`, `revisit-after` and geo tags are ignored by Google. Harmless, can be removed for cleanliness.
- The `apple-itunes-app` smart banner meta is on the deployed build.
- FAQ and HowTo rich results are dead. Do not build them.

## Authority

No GSC data yet, so no impression or ranking evidence. A web search for `site:next-up.co.za` surfaced no pages. Backlinks cannot be measured without tooling. Realistic authority sources, in order of ease:

1. Each partner club linking to its own Next-Up club page from its website, Instagram and Facebook profile.
2. Listing on pickleballsa.com (federation), Pickleheads and Global Pickleball Network.
3. Local Johannesburg sports and community sites.

For a site this small, a handful of real referring domains will move rankings more than any on-page work. The on-page work is still a prerequisite: there has to be a page worth linking to.

## Decisions (2026-09-06, owner)

- **Renderer:** Next.js App Router, one codebase. The web will never run app functionality again, but may later host an admin panel (league setup, live data) under `/admin`. Chosen over Astro because an admin panel is the likely extension and one codebase is preferred.
- **Public page scope:** clubs and leagues only. No player names, leaderboards or profiles on the web.
- **Search Console property:** `sc-domain:next-up.co.za`. The GSC MCP server for this project was re-pinned to it on 2026-09-06; takes effect after a Claude Code restart.
- **Starting point:** `origin/master` (deployed code), merged into the working branch. The merge touches 9 client files and no uncommitted work.
- **Copy and geography (2026-09-07):** the homepage keeps the original marketing copy and names only "South Africa". City and club terms live on dedicated pages (`/leagues/johannesburg` first), so expansion to new cities adds pages instead of rewriting the homepage. Do not change existing copy unless it is an improvement.
- **Club data (2026-09-07):** maintained by hand in `code/web/src/lib/clubs.ts`, no Supabase on the website. Pickle View is a demo league and is excluded. Court counts are not shown.
- **Review (2026-09-07):** on localhost only. No preview deployments. Nothing changes on Vercel without owner approval.

## Phase 2 status (2026-09-06)

Done, in `code/web` (Next.js 16 App Router, Tailwind v4, not yet deployed):

- Every route is prerendered static HTML with its own title, description, canonical and Open Graph URL. Findings 1, 2 and 9 closed.
- All navigation is real `<a href>` via `next/link`. Header, footer, club cards, and the About, Contact, Privacy and Terms pages ported. Finding 3 closed.
- Real 404 with status 404 and `noindex`. Finding 5 closed.
- 308 redirects for `/auth`, `/leagues`, `/league/:id`, `/league/:id/night/:nightId`, `/leaderboard`, `/profile`, `/profile/:username`.
- Generated `sitemap.xml` (five URLs, per-page `lastmod`) and `robots.txt`. Finding 7 closed once submitted.
- One `Organization` (brand Next-Up, legal name Nextup Sport (Pty) Ltd, alternate NextUp Sport) with `sameAs` to both stores; `MobileApplication` with a valid ZAR offer. Finding 8 closed except social profile URLs.
- Inter self-hosted through `next/font`, logo served as WebP at rendered size with dimensions, gtag loaded after hydration, no service worker, pinch zoom allowed, theme toggle has an accessible name. Lighthouse items addressed; re-measure after deploy.
- `/for-clubs` targets "pickleball league management software for clubs" for organisers: how a night runs, what organisers get, proof from the real clubs, contact CTA. Linked from the header, footer, the homepage download footnote and the Johannesburg page.
- Homepage keeps the original copy at brand level. `/leagues/johannesburg` carries the city and club terms: both real clubs with venue, address and league night, `ItemList` of `SportsActivityLocation` schema, linked from the header, the homepage and About. `/leagues` 308s to it.
- Club pages `/clubs/<slug>` (2026-09-07, T-004): one static page per club in `clubs.ts` with venue, directions, league night, how to join, `SportsActivityLocation` and `BreadcrumbList` schema; `/league/2` and `/league/3` 308 to them; linked from the home cards, the city page, About and For clubs; in the sitemap. Findings 4 and 10 addressed.
- Contact form via Resend (T-005) and a mobile menu (T-006), same day. Owner reviewed all three on localhost and approved.

Still open:

1. A `/leagues` index page once a second city exists.
2. Design pass (T-007), FAQ only if it targets real queries (T-008).
3. Switchover, only on owner approval: change the existing Vercel project's root directory from `code/client` to `code/web` and framework to Next.js, set the apex redirect to 308, then submit the sitemap in GSC, request indexing on the five URLs by hand, and re-run Lighthouse (steps 6 and 10).
4. Resolved 2026-09-07: password reset is handled entirely in the app, so `/reset-password` now 308s to `/`. No Instagram or Facebook profiles to add to `sameAs`.

The remaining work is tracked in `todo.md` (T-007 to T-012; T-004 to T-006 are in `DONE.md`). Order agreed 2026-09-07: design pass, FAQ if it earns its place, then go-live last.

## Proposed Phase 2 order

1. Start from `origin/master` (the deployed code). Merge it into the working branch.
2. Rebuild the marketing site in Next.js so every route ships its own HTML, head, canonical and real `<a href>` links. Before changing any URL, read GSC index status and impressions for the existing URLs so nothing with equity is dropped without a redirect.
3. Public club pages generated from Supabase (`leagues` joined to `league_days`, membership and night counts): `/clubs/northcliff-eagles` and so on, plus a `/clubs` index. Schema: `SportsActivityLocation` or `SportsClub` with `Place` and `PostalAddress`, opening schedule, court count, CTA to the app. City pages only once there are enough clubs per city to avoid thin pages.
4. Real 404 with status 404.
5. Generated `sitemap.xml` with true `lastmod`, without `/auth`. Submit through GSC.
6. Apex redirect 307 to 308 in Vercel domain settings.
7. Schema: one `Organization` with a single legal and brand name and `sameAs` to App Store, Google Play, Instagram, Facebook; `MobileApplication`; per-club schema; fix or drop the Offer.
8. Per-page titles and descriptions with South African and city terms; homepage H1 with a location.
9. Performance: self-host or preload Inter, or use the system font stack; logo as WebP or AVIF at rendered size with explicit dimensions; defer gtag; remove the service worker; remove `user-scalable=no`.
10. Re-pin GSC to the next-up property, submit the new sitemap, request indexing on key URLs by hand in the Search Console UI, and schedule a four-week check.

## Verify-later plan

- After deploy: `inspect_url` on `/`, `/clubs` and each club page. Expect "Indexed" within one to three weeks of requesting indexing.
- GSC search analytics filtered by page contains `/clubs/`: expect first impressions for club-name queries within four to six weeks.
- Re-run Lighthouse mobile. Targets: LCP under 2.5 s, FCP under 1.8 s, Performance above 90, Accessibility above 95.
- The Google-confirmed metric misreporting window (2025-05-13 to 2026-04-27) does not affect any comparison started after this audit.
