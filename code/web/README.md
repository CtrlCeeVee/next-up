# Next-Up marketing site

The public website at https://www.next-up.co.za. Next.js App Router, TypeScript, Tailwind CSS v4. Every route is prerendered to static HTML so search engines get a full page, its own title, canonical and real links without running JavaScript.

The product itself lives in the NextUp Sport mobile app. This site never runs app functionality; it exists to be found and to send people to the app.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (Turbopack)
npm run start   # serve the production build
npm run lint
```

From the repo root: `npm run dev:web`, `npm run build:web`, `npm run lint:web`.

## Layout

- `src/app/` routes. `layout.tsx` owns the shared head, fonts, theme boot script, Organization JSON-LD, header and footer. `sitemap.ts` and `robots.ts` generate their files at build time.
- `src/components/` shared UI. `src/components/ui/` is the design system: `Section` (full-width band plus container), `Panel` (brand or navy CTA block), `Card`, `Button`, `Eyebrow`, `SectionHeading`, `IconTile`, `Stat`, `Monogram`, `PhoneFrame` and the two client helpers `Reveal` (fade-up on scroll) and `HeaderScrollSentinel` (header shadow once scrolled). Other client components: `ThemeToggle`, `HeaderNav`, `MobileMenu`, `StoreButtons`, `ContactForm`.
- `src/app/globals.css` holds the tokens (`@theme`): `court-*` navy for the header, hero, footer and navy panels in both colour modes, `ball` yellow for highlights, `logo-blue`/`logo-teal` for monograms; emerald stays the action colour. Headings use DM Sans (`font-display`), body text Inter, both self-hosted through `next/font`.
- `src/lib/screens.ts` imports the app screenshots in `public/app/` (screen area cropped from the App Store listing; drop in raw app screenshots with the same names to upgrade them).
- `src/lib/site.ts` every external URL and identity string. `src/lib/clubs.ts` club data, currently seeded by hand from Supabase; the shape mirrors `public.leagues` and `public.league_days`.
- `next.config.ts` permanent redirects for the retired product URLs (`/auth`, `/league/:id`, `/leaderboard`, `/profile`).

## Conventions

- Metadata per page: `title`, `description`, `alternates.canonical`, `openGraph.url`. The layout supplies the title template, OG image and app-store meta.
- Internal navigation is `next/link`. No `onClick` navigation; crawlers need `<a href>`.
- Images go through `next/image` with explicit `width` and `height`.
- Update `lastModified` in `sitemap.ts` when a page's copy changes.
- No `backdrop-blur` on cards, no animated blurred blobs, no `transition-all`, no `hover:scale` on large cards: they were the cause of scroll jank on phones. Card hover is a lift plus shadow; everything animated is disabled under `prefers-reduced-motion`.
- Content inside `Reveal` must stay fully readable without JavaScript: the hidden state only applies under `html.js`, which `Reveal` sets after hydration (elements already in view are marked visible in the same pass, so the first paint is never delayed). Never wrap the hero or JSON-LD.
- Breakpoints and mobile rules: see the repo `CLAUDE.md`.

See `Docs/SEO_AUDIT.md` for why the site was rebuilt and the remaining plan.
