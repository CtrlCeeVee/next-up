// Club data for the marketing site. Maintained by hand: edit this file when a
// club joins, changes its schedule, or its numbers move. Nothing here reads
// from Supabase, so test and demo leagues never reach the public site.
//
// Field notes:
// - `id` matches public.leagues.id, used to redirect old /league/:id URLs.
// - `sessions` lists each weekly league night; `day` uses 0 = Sunday ... 6 = Saturday.
// - `latitude`/`longitude` match public.leagues (venue pin), used in structured
//   data. Leave them out until the venue has a real pin.
// - `metaTitle` overrides the default "<League> | <Venue>" page title, for
//   venues whose name is long or does not say where the club is.
// - `members` is a marketing number; round it and update it occasionally.
//   Leave it out while a club is too new for the number to help.

export type Region = {
  slug: string
  name: string
  /** Province, used as schema.org addressRegion. */
  province: string
}

// Each region has a page at /leagues/<slug>; add the page when adding a region.
export const REGIONS = {
  johannesburg: { slug: 'johannesburg', name: 'Johannesburg', province: 'Gauteng' },
  portAlfred: { slug: 'port-alfred', name: 'Port Alfred', province: 'Eastern Cape' },
} satisfies Record<string, Region>

export type Session = {
  /** 0 = Sunday ... 6 = Saturday */
  day: number
  /** 24h "HH:MM" */
  startTime: string
  /** 24h "HH:MM", optional. Shown as a range when present. */
  endTime?: string
}

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
  latitude?: number
  longitude?: number
  sessions: Session[]
  metaTitle?: string
  members?: number
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
    latitude: -26.1344398,
    longitude: 27.9651254,
    sessions: [
      { day: 1, startTime: '18:30' },
      { day: 3, startTime: '18:30' },
    ],
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
    sessions: [{ day: 6, startTime: '14:00', endTime: '16:00' }],
    members: 39, // Supabase membership count, 2026-09-06
    isActive: true,
  },
  {
    id: 7,
    slug: 'kowie-pickleball',
    name: 'Kowie Pickleball',
    description:
      'Pop-up pickleball in Port Alfred and Nemato, with Tuesday and Saturday socials at the Titi Jonas Multi-Purpose Community Centre.',
    venue: 'Titi Jonas Multi-Purpose Community Centre',
    street: 'Cnr Joe Slovo & Bathurst Roads',
    suburb: 'Thornhill',
    city: 'Port Alfred',
    postalCode: '6170',
    region: REGIONS.portAlfred,
    latitude: -33.5656,
    longitude: 26.8954,
    metaTitle: 'Kowie Pickleball | Pickleball in Port Alfred',
    sessions: [
      { day: 2, startTime: '17:00', endTime: '21:00' },
      { day: 6, startTime: '15:00', endTime: '18:00' },
    ],
    isActive: true,
  },
]

export const ACTIVE_CLUBS = CLUBS.filter((club) => club.isActive)

export function clubsInRegion(region: Region): Club[] {
  return ACTIVE_CLUBS.filter((club) => club.region.slug === region.slug)
}

/** Regions with at least one active club, in REGIONS order. */
export function activeRegions(): Region[] {
  return Object.values(REGIONS).filter((region) => clubsInRegion(region).length > 0)
}

export function clubBySlug(slug: string): Club | undefined {
  return ACTIVE_CLUBS.find((club) => club.slug === slug)
}

export function clubPath(club: Club): string {
  return `/clubs/${club.slug}`
}

export const LEAGUES_PATH = '/leagues'

export function regionPath(region: Region): string {
  return `${LEAGUES_PATH}/${region.slug}`
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

export function timeRange(session: Session): string {
  return session.endTime ? `${session.startTime} to ${session.endTime}` : session.startTime
}

/** The club's session on a given day, if it plays that day. */
export function sessionOn(club: Club, day: number): Session | undefined {
  return club.sessions.find((session) => session.day === day)
}

/**
 * "Monday, Wednesday at 18:30" or "Saturday, 14:00 to 16:00" when every
 * session shares its times; "Tuesday 17:00 to 21:00, Saturday 15:00 to 18:00"
 * when they differ.
 */
export function formatSchedule(club: Club): string {
  const [first] = club.sessions
  const sameTimes = club.sessions.every(
    (session) => session.startTime === first.startTime && session.endTime === first.endTime,
  )
  if (sameTimes) {
    const days = formatDays(club.sessions.map((session) => session.day))
    return first.endTime ? `${days}, ${timeRange(first)}` : `${days} at ${first.startTime}`
  }
  return club.sessions
    .map((session) => `${DAY_NAMES[session.day] ?? ''} ${timeRange(session)}`)
    .join(', ')
}
