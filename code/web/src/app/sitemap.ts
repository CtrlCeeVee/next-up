import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// lastModified is the date the page content last changed, not the build
// date. Update the entry when you change a page's copy. Google ignores
// changeFrequency and priority, so they are left out.
const PAGES: Array<{ path: string; lastModified: string }> = [
  { path: '/', lastModified: '2026-09-07' },
  { path: '/leagues/johannesburg', lastModified: '2026-09-07' },
  { path: '/for-clubs', lastModified: '2026-09-07' },
  { path: '/about', lastModified: '2026-09-07' },
  { path: '/contact', lastModified: '2026-09-07' },
  { path: '/privacy', lastModified: '2025-10-01' },
  { path: '/terms', lastModified: '2025-10-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
    lastModified: page.lastModified,
  }))
}
