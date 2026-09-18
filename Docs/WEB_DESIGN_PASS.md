<!-- Copied from the Claude Code plan file approved on 2026-09-07 (T-007). Kept as the design record for code/web. -->

# T-007 — Design pass on `code/web` (Phase 3)

## Context

The marketing site works and is SEO-complete (T-004 to T-006 done), but it looks flat and scrolls heavily. Luke's words: "super plain / flat", "the smoothness of the website is really bad", "everything is green", and cards "get misaligned". The causes are concrete:

- Every page is text inside outlined translucent boxes on one continuous gradient. Six card variants, three icon-tile sizes, no imagery anywhere. The only asset is the logo.
- Three animated `blur-3xl` blobs, `backdrop-blur` on every card and `hover:scale-105` on large cards are GPU-expensive: that is the scroll jank on phones. The header is not sticky and nothing reacts to scroll.
- Only emerald is used, although the logo is blue-to-teal, the app uses navy with green, blue, purple and orange, and a pickleball is yellow.
- The App Store listing has eight iPhone screenshots; five are straight-on and can be cropped into phone frames.

Decisions from Luke (2026-09-07, plan-mode questions):

| Question | Answer |
|---|---|
| Direction | "Probably closer to tidy what exists. The website itself is really not bad." |
| Imagery | App screenshots in phone frames |
| Theme | Keep the toggle; chrome always navy |
| Delivery | All at once: one review, one commit |

**Reconciled direction:** keep the current identity (page gradient, glass-style translucent cards, emerald gradient buttons, existing copy) and tidy it into one system. Add navy "court" chrome: header, homepage hero and footer are navy in both modes (matches the app and the white-on-transparent logo). CTA panels keep their green gradient so the page has colour rhythm rather than more navy. Phone mockups carry the hero and the feature steps. Motion is added and the expensive effects are removed so the site feels smooth. Copy, URLs, metadata, JSON-LD, sitemap, redirects, club data and the contact form logic do not change.

## Design system

### Tokens (`src/app/globals.css`, `@theme`)

- **Colours**: keep stock `emerald`/`green` as the action colour. Add `--color-court-950: #0b1220`, `--color-court-900: #111a2e`, `--color-court-800: #1a2540` (navy, sampled from the app), `--color-ball: #facc15` (pickleball yellow, highlight only), `--color-logo-blue: #1086f8`, `--color-logo-teal: #0bb5a8` (sampled from `logo.png`). Utility `.bg-logo-gradient` (blue to teal) for monograms and one accent per page.
- **Colour rules**: emerald = actions and links. Blue = venue/location/info tiles. Ball yellow = live dot, eyebrow dot, stat accents. Purple/orange/pink stay on the icon tiles that already use them (that is the variety Luke asked for), but through one `IconTile` component with named tones instead of ad-hoc classes.
- **Type**: DM Sans (variable, `next/font/google`) for h1–h3 and stat numbers via `--font-display`; Inter stays for body. H1 `font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance`. Section H2 `text-3xl sm:text-4xl`.
- **Surfaces**: body keeps `from-slate-50 via-green-50 to-emerald-50` (dark: slate-900 / slate-800 / emerald-900). The three animated blobs are replaced by two static `radial-gradient` glows painted on the body background (same soft look, zero filter cost, no animation).
- **Card**: one class. `rounded-3xl border border-white/40 bg-white/75 shadow-card dark:border-slate-700/50 dark:bg-slate-800/75`. No `backdrop-blur` (over a smooth gradient it is invisible, and it was the main compositing cost). Interactive cards: `hover:-translate-y-1 hover:shadow-card-hover transition-[transform,box-shadow] duration-300`, no `scale`.
- **Radius / shadow scale**: `rounded-3xl` cards and panels, `rounded-2xl` buttons and tiles, `rounded-full` pills. `--shadow-card`, `--shadow-card-hover`, `--shadow-phone`, `--shadow-header`.
- **Buttons**: primary keeps `bg-gradient-to-r from-green-600 to-emerald-600` (dark variant as today). Secondary `bg-slate-100 dark:bg-slate-800`. On-dark `bg-white/10 ring-1 ring-white/20`. All: `active:scale-[0.98]`, `focus-visible:ring-2 ring-emerald-500 ring-offset-2`, `transition-[background-color,box-shadow,transform] duration-200`. No `transition-all` anywhere in the site.
- **Motion tokens**: hover 200–300 ms; reveal 600 ms `cubic-bezier(.2,.7,.2,1)`; hero entrance keyframe `rise` (CSS only). Everything under `@media (prefers-reduced-motion: reduce)` becomes static; `scroll-behavior: smooth` only under `no-preference`.

### Components (`src/components/ui/`, server components unless noted)

| File | Purpose |
|---|---|
| `Button.tsx` | `variant` primary / secondary / ghost / on-dark, `size`, renders `next/link` for internal `href`, `<a target=_blank rel=noopener>` for external, `<button>` otherwise. Forwards `data-*` (needed by StoreButtons). |
| `Card.tsx` | the one card; `interactive`, `padding`, `as`. Exports `cardClasses()`. |
| `Section.tsx` | vertical rhythm + container: `tone` default (transparent on page gradient) / navy; `size` sm / md / lg; `width` narrow (4xl) / default (6xl) / wide (7xl). |
| `Panel.tsx` | rounded coloured block inside a section: `tone` brand (existing green gradient CTA look) / navy. Replaces `ctaPanel`. |
| `Eyebrow.tsx` | small pill/label with icon, tones brand / blue / on-dark. Replaces the duplicated badge markup. |
| `SectionHeading.tsx` | eyebrow + title + lede, `align`, `as` h1/h2. `PageIntro` becomes a thin wrapper so pages migrate without API churn. |
| `IconTile.tsx` | icon in a tinted tile; `tone` emerald / blue / purple / orange / pink / yellow / red, `size` sm / md / lg. Replaces the three ad-hoc sizes. |
| `Stat.tsx` | number + label; `on-dark` variant; DM Sans numerals. Used by homepage hero strip and for-clubs proof. |
| `Monogram.tsx` | club initials on the logo gradient (NE, GP). Gives club cards and club pages a visual anchor until club logos exist. |
| `PhoneFrame.tsx` | CSS bezel (`rounded-[2.75rem] bg-slate-950 p-1.5 ring-1 ring-white/15 shadow-phone`) around a `next/image` static import, `aspect-[1170/2532]`, `tilt` left / right / none, `preload` for the LCP phone. |
| `Reveal.tsx` (client) | fade-up once on scroll. One shared IntersectionObserver, toggles `data-reveal="in"` on the DOM, no React state (passes `react-hooks/set-state-in-effect`). Hidden state only applies under `html.js` (set by the existing boot script), so crawlers and no-JS get full content. `delay` prop for stagger. Never wraps the hero or JSON-LD. |
| `HeaderScrollSentinel.tsx` (client) | 1px sentinel at page top observed by IntersectionObserver; toggles `data-scrolled` on `<html>`; CSS adds the header shadow. No scroll listener. |
| `src/lib/cn.ts` | tiny class joiner, no dependency. |

`src/components/ui.ts` is deleted and its seven consumers migrated in the same pass (about, contact, clubs/[slug], for-clubs, leagues/johannesburg, privacy, terms). No `ui/index.ts` barrel (it would be shadowed by `ui.ts` if both existed; not needed).

### Header (`Header.tsx`, `MobileMenu.tsx`, `ThemeToggle.tsx`)

- `sticky top-0 z-40 h-16 bg-court-950/95 backdrop-blur` (the one blur that is visible, because content scrolls under it), `border-b border-white/10`, shadow once scrolled (`html[data-scrolled]`).
- Logo `h-8 sm:h-9` (today it reaches `h-20`), `preload` instead of the Next 16-deprecated `priority`.
- Nav labels unchanged (Leagues, For clubs, About, Contact): `text-white/70 hover:text-white`, active page gets a 2px emerald underline. ThemeToggle on-dark (`bg-white/10`). "Get the App" pill keeps the emerald gradient.
- Mobile menu panel becomes `bg-court-950` (still solid, same logic), dividers `white/10`, short `motion-safe` fade/slide on open.
- Anchor offsets `scroll-mt-24` become `scroll-mt-20` to match the 64px header.

### Footer (`Footer.tsx`, data in `lib/nav.ts`)

Navy, `grid md:grid-cols-[1.4fr_1fr_1fr_1fr]`:
- Brand column: logo `h-9`, existing tagline "Revolutionizing pickleball leagues across South Africa", compact store badges.
- **Players**: Find a league (`/#clubs`), Pickleball leagues in Johannesburg, Northcliff Eagles, GPC Pickleball (derived from `ACTIVE_CLUBS`, sitewide internal links to the club pages), Download the app (`/#download`).
- **Clubs**: Next-Up for clubs, Contact us.
- **Company**: About, Contact, Privacy, Terms.
- Bottom bar: © year `LEGAL_NAME`, "Johannesburg, South Africa". Links `text-white/70 hover:text-white`.

## Pages (copy unchanged; only layout, styling and imagery)

**Home `/`**
1. Hero, navy band, `lg:grid-cols-[1.05fr_.95fr]`. Left: eyebrow (Zap, existing badge text), H1 (line 1 white, line 2 green gradient text), lede, "Download the free app…" line, `StoreButtons`, the "Run a club or league?" footnote, `id="download"` kept. Right: two `PhoneFrame`s, home screen front (`preload`), event screen behind, tilted, on a static emerald radial glow; second phone `hidden sm:block`. Bottom of the band: stats strip (300+ / 2 / 1000+, existing labels) with a `border-t border-white/10`, DM Sans numerals, ball-yellow accent.
2. Active Leagues: `SectionHeading` (existing text), two `ClubCard`s in `Reveal` with stagger, link "All pickleball leagues in Johannesburg".
3. How a league night works: same panel, three steps; each gets a small `PhoneFrame` (home / event / ranking) above the existing green / blue / purple tile, title and text. Cards equal height.
4. `Panel tone="navy"`: H2 "Run a club or league?" (existing footnote text), lede reused from the for-clubs page, button "Next-Up for clubs".
5. `Panel tone="brand"`: "Download the free app to check in, play and track your stats" + `StoreButtons`.

**`ClubCard`**: `Monogram` + name + LIVE badge, description, detail rows (MapPin blue, Calendar orange, Users emerald), footer pinned with `mt-auto` so "League details" / "Get the App" align across cards regardless of description length (the misalignment Luke flagged). Hover lift, no scale.

**Inner pages** share a compact navy intro band: `Section tone="navy" size="sm"` containing breadcrumb (club pages), `Eyebrow` on-dark, H1 white, lede `text-white/80`. Content then continues on the page gradient.

- **`/leagues/johannesburg`**: intro band; club cards; "Venues and league nights" becomes a 7-day schedule strip (Mon–Sun chips showing club + time from `formatSchedule`) with each venue's address and "About {club}" link beneath; `HowItWorks`; "Join a league" + `StoreButtons`; for-clubs `Panel`. JSON-LD untouched.
- **`/clubs/[slug]`**: intro band with breadcrumb, `Monogram`, H1, description and three fact chips (venue, schedule, members). Venue card (blue tile, Get directions) and League night card (orange tile); "How to join" as three equal-height numbered cards (`Reveal` stagger); `HowItWorks`; "Play at {club}" brand `Panel` + `StoreButtons`; "More leagues" navy `Panel`. `generateStaticParams`, metadata, JSON-LD untouched.
- **`/for-clubs`**: intro band two-column with the event-screen `PhoneFrame`; four steps as numbered cards with a connecting line on `xl`; "What organisers get" six `IconTile`s (existing tones); proof `Panel` with three `Stat`s; brand `Panel` (contact) + `StoreButtons`.
- **`/about`**: intro band; mission / vision cards; "What we solve" three tiles (red / yellow / purple kept); "How we help" card; "Where we play" cards with `Monogram`s; brand `Panel`.
- **`/contact`**: intro band; existing 3/2 grid; form inputs solid (`bg-white dark:bg-slate-900`, emerald focus ring); detail cards with `IconTile`. `ContactForm` logic untouched.
- **`/privacy`, `/terms`**: intro band (blue eyebrow kept); cards through `Card`/`IconTile`; CTA `Panel` with primary + on-dark buttons.
- **`not-found`**: one `Card`, same button.

## Smoothness (the concrete list)

1. Remove animated blobs and per-card `backdrop-blur`; static radial glows instead. Biggest main-thread win.
2. Sticky header with shadow on scroll via sentinel, no scroll handler.
3. `Reveal` on section content below the fold (once, 600 ms, 80 ms stagger), hero enters with a CSS keyframe so LCP is unaffected and the page is never blank without JS.
4. Property-specific transitions only; card hover = lift + shadow; buttons `active:scale-[0.98]`; icon tiles keep `group-hover:scale-110`.
5. Mobile menu opens with a 150 ms `motion-safe` fade/slide; Escape / route-change close kept.
6. Images via `next/image` static imports (auto width/height, blur placeholder, hashed caching), `sizes` per placement, WebP automatic; front hero phone `preload`, others lazy.
7. Fonts via `next/font` (self-hosted, `display: swap`, size-adjusted fallbacks): zero CLS from type.
8. `prefers-reduced-motion` disables reveal, hero rise, float, pulse and smooth scroll.
9. Focus-visible rings on every link and button; `aria-current` kept in header and mobile menu.
10. View transitions: not in this pass (Next 16 supports them without a flag, but they interact with `Reveal`; possible follow-up).

## Assets

- Crop the screen area from the five straight-on App Store images (public listing, full-size variant of each `mzstatic` URL saved in the scratchpad `appstore/shots.txt`) with the bundled `sharp`: `public/app/home.png`, `event.png`, `score.png`, `ranking.png`, `stats.png`, each ≤ ~400 KB. The tilted images (leagues, matches, profile) are not usable.
- Raw screenshots from the app are a drop-in upgrade later: same filenames, same folder.
- `viewport.themeColor` in `layout.tsx` changes from emerald to `court-950`.

## Files touched

- `src/app/globals.css`, `src/app/layout.tsx` (fonts, `js` class in boot script, blobs out, sentinel, themeColor, body surfaces)
- `src/components/ui/*` (new), `src/lib/cn.ts` (new), `src/components/ui.ts` (deleted)
- `Header.tsx`, `MobileMenu.tsx`, `ThemeToggle.tsx`, `Footer.tsx`, `StoreButtons.tsx` (keep `data-store`), `ClubCard.tsx`, `HowItWorks.tsx`, `PageIntro.tsx`, `ContactForm.tsx` (classes only)
- `src/lib/nav.ts` (footer groups), `next.config.ts` only if `images.qualities` is needed after viewing the phones
- `src/app/page.tsx`, `leagues/johannesburg/page.tsx`, `clubs/[slug]/page.tsx`, `for-clubs/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `not-found.tsx`
- `public/app/*.png` (new)
- Docs: `code/web/README.md` (client components list, design tokens pointer), root `CLAUDE.md` design-system section scoped to `code/client` with a short `code/web` token summary so the glass/blob pattern is not reintroduced.

Not touched: `lib/clubs.ts`, `lib/site.ts` (except nothing), `contact/actions.ts`, `sitemap.ts`, `robots.ts`, redirects, any JSON-LD, any copy string.

## Verification

Already covered by me before the report:
1. `npm run lint` and `npm run build` in `code/web`; every route still prerendered static; no `ui.ts` imports remain (`grep`).
2. Serve the production build on `localhost:3010` and screenshot every page at 375, 768 and 1280 px in light and dark; check header shadow, mobile menu, reveal, card alignment, phone rendering, no horizontal scroll at 320 px.
3. Keyboard pass: tab order, focus rings, Escape closes the menu.
4. Reduced-motion pass (emulate in DevTools): content visible, no animation.
5. Curl a page with JS disabled semantics (raw HTML): all section text present, `data-reveal` elements not hidden.
6. Lighthouse mobile on `/` and `/clubs/northcliff-eagles` before and after (via `npx lighthouse` if it installs cleanly; otherwise DevTools by Luke), targets: performance ≥ 95, CLS 0, no accessibility regressions.

For Luke to check on localhost: overall look in both modes, the navy hero against the light content, the phone screens, mobile menu feel, and anything that reads as a copy change (there should be none).

Delivery per the /todo-do contract: implement everything, sanity-check, one completion report, wait for explicit approval, then one commit referencing T-007, archive to `DONE.md`. Nothing pushed, nothing on Vercel.

## Surfaced while planning (not in scope; for Luke to decide on)

- `src/app/apple-icon.png` and `icon.png` are 119×124 (non-square); Apple expects 180×180.
- `public/og-image.png` is 736 KB; could be re-encoded to ~150 KB.
- Contact phone number is hardcoded in `contact/page.tsx` rather than `lib/site.ts`.
- Club logos and league night photos would replace monograms and add proof; none exist in the repo.

## Review round 1 (2026-09-18)

Luke's localhost review of the pass above: the look was approved, with two refinements requested, both about colour.

1. The green CTA panel was too bright, especially in dark mode (`dark:from-green-500 dark:to-emerald-500`), and it closed every page. Now `Panel tone="brand"` is a deep green surface (`bg-brand-deep` in `globals.css`: emerald-800 to green-900 with a soft top-left highlight), identical in both colour modes like the navy, and it appears only where the action is a conversion: home (download), club pages (download), for-clubs (contact us) and about (join a league). The soft closers on contact, leagues/johannesburg, privacy and terms became a plain `Card` with the standard primary and secondary buttons, so the deep green is the site's one loud moment beside the navy chrome.
2. The icon tiles used eight tones, and purple, orange and pink were hues found nowhere else on the site. `IconTile` now has four decorative tones drawn from the site's own colours, each with a meaning, plus red for warnings: `emerald` playing (check-in, scoring, fair play, contact actions), `blue` the system at work (matching, court board, live updates, data; the logo blue), `yellow` results and notices (standings, stats, schedules, limitations; the ball yellow), `navy` organisers, clubs, venues and rules (the court navy), `red` warnings only (the problems trio on About, account deletion). The same concept gets the same tone on every page, so a six-item grid shows four hues with considered repeats instead of a rainbow.

Files: `globals.css`, `ui/Panel.tsx`, `ui/IconTile.tsx`, `ui/Button.tsx` (on-brand focus offset), `HowItWorks.tsx`, the about, for-clubs, contact, clubs/[slug], leagues/johannesburg, privacy and terms pages, `code/web/README.md`, root `CLAUDE.md`. No copy changes. The "Colour rules" bullet and the Panel and IconTile rows above describe the original plan and are superseded by this section.
