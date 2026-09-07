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
- `src/components/` shared UI. `ThemeToggle` and `StoreButtons` are the only client components.
- `src/lib/site.ts` every external URL and identity string. `src/lib/clubs.ts` club data, currently seeded by hand from Supabase; the shape mirrors `public.leagues` and `public.league_days`.
- `next.config.ts` permanent redirects for the retired product URLs (`/auth`, `/league/:id`, `/leaderboard`, `/profile`).

## Conventions

- Metadata per page: `title`, `description`, `alternates.canonical`, `openGraph.url`. The layout supplies the title template, OG image and app-store meta.
- Internal navigation is `next/link`. No `onClick` navigation; crawlers need `<a href>`.
- Images go through `next/image` with explicit `width` and `height`.
- Update `lastModified` in `sitemap.ts` when a page's copy changes.
- Design system, breakpoints and mobile rules: see the repo `CLAUDE.md`.

See `Docs/SEO_AUDIT.md` for why the site was rebuilt and the remaining plan.
