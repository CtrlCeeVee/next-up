// Club data for the marketing site. Maintained by hand: edit this file when a
// club joins, changes its schedule, or its numbers move. Nothing here reads
// from Supabase, so test and demo leagues never reach the public site.
//
// Field notes:
// - `id` matches public.leagues.id, used to redirect old /league/:id URLs.
// - `days` uses 0 = Sunday ... 6 = Saturday.
// - `members` is a marketing number; round it and update it occasionally.

export type Region = {
  slug: string
  name: string
}

export const REGIONS = {
  johannesburg: { slug: 'johannesburg', name: 'Johannesburg' },
} satisfies Record<string, Region>

export type Club = {
  id: number
  slug: string
  name: string
  description: string
  venue: string
  street: string
  suburb: string
  city: string
  postalCode: string
  region: Region
  /** 0 = Sunday ... 6 = Saturday */
  days: number[]
  /** 24h "HH:MM" */
  startTime: string
  /** 24h "HH:MM", optional. Shown as a range when present. */
  endTime?: string
  members: number
  isActive: boolean
}

export const CLUBS: Club[] = [
  {
    id: 2,
    slug: 'northcliff-eagles',
    name: 'Northcliff Eagles',
    description:
      'Premier pickleball league at Northcliff Country Club featuring competitive play for passionate players of all skill levels.',
    venue: 'Northcliff Country Club',
    street: '271 Pendoring Rd',
    suburb: 'Northcliff',
    city: 'Randburg',
    postalCode: '2115',
    region: REGIONS.johannesburg,
    days: [1, 3],
    startTime: '18:30',
    members: 425, // Supabase membership count, 2026-09-06
    isActive: true,
  },
  {
    id: 3,
    slug: 'gpc-pickleball',
    name: 'GPC Pickleball',
    description:
      'GPC Pickleball is a premier pickleball complex in South Africa. Featuring brand new courts, GPC Pickleball offers an unparalleled playing experience.',
    venue: 'German Country Club',
    street: '131 Holkam Rd',
    suburb: 'Paulshof',
    city: 'Sandton',
    postalCode: '2056',
    region: REGIONS.johannesburg,
    days: [6],
    startTime: '14:00',
    endTime: '16:00',
    members: 39, // Supabase membership count, 2026-09-06
    isActive: true,
  },
]

export const ACTIVE_CLUBS = CLUBS.filter((club) => club.isActive)

export function clubsInRegion(region: Region): Club[] {
  return ACTIVE_CLUBS.filter((club) => club.region.slug === region.slug)
}

export function clubBySlug(slug: string): Club | undefined {
  return ACTIVE_CLUBS.find((club) => club.slug === slug)
}

export function clubPath(club: Club): string {
  return `/clubs/${club.slug}`
}

/** "GPC Pickleball League", "Northcliff Eagles Pickleball League". */
export function leagueTitle(club: Club): string {
  return /pickleball/i.test(club.name)
    ? `${club.name} League`
    : `${club.name} Pickleball League`
}

export function fullAddress(club: Club): string {
  return `${club.street}, ${club.suburb}, ${club.city}, ${club.postalCode}`
}

export function mapsUrl(club: Club): string {
  const query = `${club.venue}, ${fullAddress(club)}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function formatDays(days: number[]): string {
  return days.map((d) => DAY_NAMES[d] ?? '').filter(Boolean).join(', ')
}

export function formatSchedule(club: Club): string {
  const days = formatDays(club.days)
  return club.endTime
    ? `${days}, ${club.startTime} to ${club.endTime}`
    : `${days} at ${club.startTime}`
}
