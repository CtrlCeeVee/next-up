import type { MetadataRoute } from 'next'
import { ACTIVE_CLUBS, activeRegions, clubPath, LEAGUES_PATH, regionPath } from '@/lib/clubs'
import { SITE_URL } from '@/lib/site'

// lastModified is the date the page content last changed, not the build
// date. Update the entry when you change a page's copy. Google ignores
// changeFrequency and priority, so they are left out.
// Club and region pages share templates; one date covers a template change.
const CLUB_PAGES_UPDATED = '2026-10-09'

const PAGES: Array<{ path: string; lastModified: string }> = [
  { path: '/', lastModified: '2026-10-09' },
  { path: LEAGUES_PATH, lastModified: '2026-10-09' },
  ...activeRegions().map((region) => ({ path: regionPath(region), lastModified: CLUB_PAGES_UPDATED })),
  // Club pages render from clubs.ts; bump the date when a club's details change.
  ...ACTIVE_CLUBS.map((club) => ({ path: clubPath(club), lastModified: CLUB_PAGES_UPDATED })),
  { path: '/for-clubs', lastModified: '2026-10-09' },
  { path: '/about', lastModified: '2026-10-09' },
  { path: '/contact', lastModified: '2026-10-09' },
  { path: '/privacy', lastModified: '2025-10-01' },
  { path: '/terms', lastModified: '2025-10-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
    lastModified: page.lastModified,
  }))
}
