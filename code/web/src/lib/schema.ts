import { clubPath, mapsUrl, type Club } from './clubs'
import { ORGANIZATION_ID, SITE_URL } from './site'

// schema.org builders shared by the leagues hub, region pages and club pages,
// so a club is described the same way wherever it appears.

const SCHEMA_DAYS = [
  'https://schema.org/Sunday',
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
]

export function clubSchema(club: Club) {
  const url = `${SITE_URL}${clubPath(club)}`
  // Hours need both ends; sessions without an end time are left out.
  const hours = club.sessions
    .filter((session) => session.endTime)
    .map((session) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAYS[session.day],
      opens: session.startTime,
      closes: session.endTime,
    }))
  return {
    '@type': 'SportsActivityLocation',
    '@id': `${url}#venue`,
    name: club.name,
    description: club.description,
    sport: 'Pickleball',
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.street,
      addressLocality: club.city,
      addressRegion: club.region.province,
      postalCode: club.postalCode,
      addressCountry: 'ZA',
    },
    ...(club.latitude !== undefined && club.longitude !== undefined
      ? { geo: { '@type': 'GeoCoordinates', latitude: club.latitude, longitude: club.longitude } }
      : {}),
    ...(hours.length > 0 ? { openingHoursSpecification: hours } : {}),
    hasMap: mapsUrl(club),
    containedInPlace: { '@type': 'Place', name: club.venue },
    memberOf: { '@id': ORGANIZATION_ID },
  }
}

export function clubListSchema(name: string, path: string, clubs: Club[]) {
  return {
    '@type': 'ItemList',
    name,
    url: `${SITE_URL}${path}`,
    itemListElement: clubs.map((club, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: clubSchema(club),
    })),
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  }
}

/** Serialise a @graph for a <script type="application/ld+json"> tag. */
export function jsonLdGraph(...nodes: object[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')
}
