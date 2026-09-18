import { ACTIVE_CLUBS, clubPath, REGIONS } from './clubs'

// Primary navigation, shared by the desktop header and the mobile menu so
// the two never drift apart.
export const NAV_LINKS = [
  { href: '/leagues/johannesburg', label: 'Leagues' },
  { href: '/for-clubs', label: 'For clubs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export type NavLink = { href: string; label: string }

// Footer columns. Club pages are listed sitewide on purpose: every page
// links to them, which is the internal-link signal the SEO plan asks for.
export const FOOTER_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Players',
    links: [
      { href: '/#clubs', label: 'Find a league' },
      {
        href: `/leagues/${REGIONS.johannesburg.slug}`,
        label: `Pickleball leagues in ${REGIONS.johannesburg.name}`,
      },
      ...ACTIVE_CLUBS.map((club) => ({ href: clubPath(club), label: club.name })),
      { href: '/#download', label: 'Download the app' },
    ],
  },
  {
    title: 'Clubs',
    links: [
      { href: '/for-clubs', label: 'Next-Up for clubs' },
      { href: '/contact', label: 'Contact us' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
]
