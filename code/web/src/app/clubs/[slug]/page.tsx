import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ChevronRight, ExternalLink, MapPin, Trophy, Users } from 'lucide-react'
import { HowItWorks } from '@/components/HowItWorks'
import { PageIntro } from '@/components/PageIntro'
import { StoreButtons } from '@/components/StoreButtons'
import { card, ctaPanel, ctaPrimary } from '@/components/ui'
import {
  ACTIVE_CLUBS,
  clubBySlug,
  clubPath,
  clubsInRegion,
  formatSchedule,
  fullAddress,
  leagueTitle,
  mapsUrl,
  type Club,
} from '@/lib/clubs'
import { ORGANIZATION_ID, SITE_URL } from '@/lib/site'

type Params = { slug: string }

// Every club in clubs.ts gets a static page; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return ACTIVE_CLUBS.map((club) => ({ slug: club.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const club = clubBySlug((await params).slug)
  if (!club) return {}
  const path = clubPath(club)
  const description = `Join the ${club.name} pickleball league at ${club.venue}, ${club.city}. League nights: ${formatSchedule(club)}. Download the free Next-Up app to play.`
  return {
    title: { absolute: `${leagueTitle(club)} | ${club.venue}` },
    description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `${leagueTitle(club)} at ${club.venue}`,
      description,
    },
  }
}

const JOIN_STEPS = (club: Club) => [
  {
    title: 'Download the free app',
    text: 'Get Next-Up from the App Store or Google Play and create your player profile.',
  },
  {
    title: `Join ${club.name}`,
    text: `Find ${club.name} under leagues in the app and join. There is no sign-up form and no fixtures to book.`,
  },
  {
    title: 'Come to league night',
    text: `Arrive at ${club.venue} on league night, check in on the app, and get matched into games all session.`,
  },
]

function jsonLd(club: Club) {
  const url = `${SITE_URL}${clubPath(club)}`
  const region = club.region
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
          addressRegion: 'Gauteng',
          postalCode: club.postalCode,
          addressCountry: 'ZA',
        },
        hasMap: mapsUrl(club),
        containedInPlace: { '@type': 'Place', name: club.venue },
        memberOf: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Pickleball leagues in ${region.name}`,
            item: `${SITE_URL}/leagues/${region.slug}`,
          },
          { '@type': 'ListItem', position: 3, name: club.name, item: url },
        ],
      },
    ],
  }
}

export default async function ClubPage({ params }: { params: Promise<Params> }) {
  const club = clubBySlug((await params).slug)
  if (!club) notFound()

  const region = club.region
  const regionPath = `/leagues/${region.slug}`
  const others = clubsInRegion(region).filter((other) => other.id !== club.id)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(club)).replace(/</g, '\\u003c'),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="transition-colors hover:text-green-600 dark:hover:text-green-400">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link
              href={regionPath}
              className="transition-colors hover:text-green-600 dark:hover:text-green-400"
            >
              Leagues in {region.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-white">
            {club.name}
          </li>
        </ol>
      </nav>

      <PageIntro icon={Trophy} badge={`Pickleball league in ${club.city}`} title={club.name}>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          {club.description}
        </p>
      </PageIntro>

      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={card}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Venue</h2>
          </div>
          <p className="font-medium text-gray-900 dark:text-white">{club.venue}</p>
          <p className="text-gray-600 dark:text-gray-300">{fullAddress(club)}</p>
          <a
            href={mapsUrl(club)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Get directions
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className={card}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-xl bg-orange-100 p-3 dark:bg-orange-900/30">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">League night</h2>
          </div>
          <p className="font-medium text-gray-900 dark:text-white">{formatSchedule(club)}</p>
          <p className="mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" aria-hidden="true" />
            {club.members} active members
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Check in on the app when you arrive and the night runs itself.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          How to join {club.name}
        </h2>
        <ol className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {JOIN_STEPS(club).map((step, index) => (
            <li key={step.title} className={`${card} relative`}>
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-lg font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-16">
        <HowItWorks />
      </div>

      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Play at {club.name}</h2>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Download the free app, join {club.name} and check in on your next
          league night.
        </p>
        <StoreButtons />
      </div>

      <div className={ctaPanel}>
        <h2 className="mb-2 text-2xl font-bold">
          {others.length > 0 ? `More leagues in ${region.name}` : `Leagues in ${region.name}`}
        </h2>
        {others.length > 0 && (
          <p className="mx-auto mb-6 max-w-2xl text-green-100">
            Next-Up also runs{' '}
            {others.map((other, index) => (
              <span key={other.id}>
                {index > 0 && (index === others.length - 1 ? ' and ' : ', ')}
                <Link href={clubPath(other)} className="font-semibold underline underline-offset-2">
                  {other.name}
                </Link>{' '}
                at {other.venue}
              </span>
            ))}
            .
          </p>
        )}
        <Link href={regionPath} className={ctaPrimary}>
          All leagues in {region.name}
        </Link>
      </div>
    </section>
  )
}
