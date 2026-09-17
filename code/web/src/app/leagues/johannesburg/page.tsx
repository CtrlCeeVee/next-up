import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { ClubCard } from '@/components/ClubCard'
import { HowItWorks } from '@/components/HowItWorks'
import { PageIntro } from '@/components/PageIntro'
import { StoreButtons } from '@/components/StoreButtons'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Monogram } from '@/components/ui/Monogram'
import { Panel } from '@/components/ui/Panel'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import {
  clubPath,
  clubsInRegion,
  formatSchedule,
  fullAddress,
  REGIONS,
  type Club,
} from '@/lib/clubs'
import { cn } from '@/lib/cn'
import { ORGANIZATION_ID, SITE_URL } from '@/lib/site'

const region = REGIONS.johannesburg
const clubs = clubsInRegion(region)
const path = `/leagues/${region.slug}`

export const metadata: Metadata = {
  title: { absolute: `Pickleball Leagues in ${region.name} | Next-Up` },
  description: `Join a Next-Up pickleball league in Johannesburg: ${clubs
    .map((club) => `${club.name} at ${club.venue} in ${club.city}`)
    .join(' and ')}. Weekly league nights, automatic matchmaking and live standings in the free app.`,
  alternates: { canonical: path },
  openGraph: {
    url: path,
    title: `Pickleball Leagues in ${region.name}`,
    description:
      'Weekly competitive social pickleball leagues at clubs across Johannesburg. Check in on the app and get matched all night.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Next-Up pickleball leagues in ${region.name}`,
  url: `${SITE_URL}${path}`,
  itemListElement: clubs.map((club, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SportsActivityLocation',
      name: club.name,
      description: club.description,
      sport: 'Pickleball',
      url: `${SITE_URL}${clubPath(club)}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: club.street,
        addressLocality: club.city,
        addressRegion: 'Gauteng',
        postalCode: club.postalCode,
        addressCountry: 'ZA',
      },
      containedInPlace: { '@type': 'Place', name: club.venue },
      memberOf: { '@id': ORGANIZATION_ID },
    },
  })),
}

// Monday first; `days` in clubs.ts uses 0 = Sunday.
const WEEK = [
  { day: 1, short: 'Mon', long: 'Monday' },
  { day: 2, short: 'Tue', long: 'Tuesday' },
  { day: 3, short: 'Wed', long: 'Wednesday' },
  { day: 4, short: 'Thu', long: 'Thursday' },
  { day: 5, short: 'Fri', long: 'Friday' },
  { day: 6, short: 'Sat', long: 'Saturday' },
  { day: 0, short: 'Sun', long: 'Sunday' },
]

function timeRange(club: Club): string {
  return club.endTime ? `${club.startTime} to ${club.endTime}` : club.startTime
}

export default function JohannesburgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Section tone="navy" size="sm" width="wide">
        <PageIntro icon={MapPin} badge={region.name} title={`Pickleball Leagues in ${region.name}`}>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Next-Up runs weekly competitive social pickleball leagues at clubs
            across Johannesburg, from Randburg to Sandton. Turn up on league
            night, check in on the app, and get matched into games all evening.
            Players of every level are welcome.
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="wide">
        <div className="space-y-16 sm:space-y-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {clubs.map((club, index) => (
              <div key={club.id} id={club.slug} className="h-full scroll-mt-20">
                <Reveal delay={index * 90} className="h-full">
                  <ClubCard club={club} />
                </Reveal>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Venues and league nights
            </h2>

            {/* The week at a glance: which club plays on which day. */}
            <Reveal>
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {WEEK.map(({ day, short, long }) => {
                  const nights = clubs.filter((club) => club.days.includes(day))
                  return (
                    <li
                      key={day}
                      className={cn(
                        'rounded-2xl border p-3 text-center',
                        nights.length > 0
                          ? 'border-emerald-200/80 bg-white/75 shadow-card dark:border-emerald-800/50 dark:bg-slate-800/75'
                          : 'border-dashed border-slate-300/80 text-gray-400 dark:border-slate-700 dark:text-gray-500',
                      )}
                    >
                      <p className="text-xs font-semibold tracking-wide uppercase">
                        <span className="lg:hidden">{short}</span>
                        <span className="hidden lg:inline">{long}</span>
                      </p>
                      {nights.length > 0 ? (
                        nights.map((club) => (
                          <Link
                            key={club.id}
                            href={clubPath(club)}
                            className="mt-2 block rounded-xl bg-emerald-50 px-2 py-2 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40"
                          >
                            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                              {club.name}
                            </span>
                            <span className="block text-xs text-gray-600 dark:text-gray-300">
                              {timeRange(club)}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="mt-2 text-xs">No league night</p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            <dl className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              {clubs.map((club, index) => (
                <Reveal key={club.id} delay={index * 90} className="h-full">
                  <Card className="h-full">
                    <dt className="flex items-center gap-3 font-display text-lg font-bold text-gray-900 dark:text-white">
                      <Monogram name={club.name} size="sm" />
                      {club.name}
                    </dt>
                    <dd className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>{club.venue}</p>
                      <p>{fullAddress(club)}</p>
                      <p className="mt-2 font-medium text-gray-900 dark:text-white">
                        League night: {formatSchedule(club)}
                      </p>
                      <Link
                        href={clubPath(club)}
                        className="mt-3 inline-flex items-center gap-1.5 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        About {club.name}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </dd>
                  </Card>
                </Reveal>
              ))}
            </dl>
          </div>

          <HowItWorks />

          <Reveal className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Join a league
            </h2>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Download the free app, pick your club and check in on your first
              league night. That is the whole sign-up.
            </p>
            <StoreButtons />
          </Reveal>

          <Reveal>
            <Panel tone="brand" className="text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Want Next-Up at your club?
              </h2>
              <p className="mx-auto mt-3 mb-6 max-w-2xl text-green-100">
                We set up and run league nights for clubs across South Africa. See
                what your club gets and how to get started.
              </p>
              <Button href="/for-clubs" variant="on-brand">
                Next-Up for clubs
              </Button>
            </Panel>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
