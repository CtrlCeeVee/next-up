import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { ClubCard } from '@/components/ClubCard'
import { HowItWorks } from '@/components/HowItWorks'
import { PageIntro } from '@/components/PageIntro'
import { StoreButtons } from '@/components/StoreButtons'
import { ctaPanel, ctaPrimary } from '@/components/ui'
import { clubPath, clubsInRegion, formatSchedule, fullAddress, REGIONS } from '@/lib/clubs'
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

export default function JohannesburgPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <PageIntro icon={MapPin} badge={region.name} title={`Pickleball Leagues in ${region.name}`}>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          Next-Up runs weekly competitive social pickleball leagues at clubs
          across Johannesburg, from Randburg to Sandton. Turn up on league
          night, check in on the app, and get matched into games all evening.
          Players of every level are welcome.
        </p>
      </PageIntro>

      <div className="mb-16 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
        {clubs.map((club) => (
          <div key={club.id} id={club.slug} className="h-full scroll-mt-24">
            <ClubCard club={club} />
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Venues and league nights
        </h2>
        <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60"
            >
              <dt className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{club.name}</dt>
              <dd className="text-sm text-gray-600 dark:text-gray-300">
                <p>{club.venue}</p>
                <p>{fullAddress(club)}</p>
                <p className="mt-2 font-medium text-gray-900 dark:text-white">
                  League night: {formatSchedule(club)}
                </p>
                <Link
                  href={clubPath(club)}
                  className="mt-3 inline-block font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  About {club.name}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mb-16">
        <HowItWorks />
      </div>

      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Join a league</h2>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Download the free app, pick your club and check in on your first
          league night. That is the whole sign-up.
        </p>
        <StoreButtons />
      </div>

      <div className={ctaPanel}>
        <h2 className="mb-2 text-2xl font-bold">Want Next-Up at your club?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-green-100">
          We set up and run league nights for clubs across South Africa. See
          what your club gets and how to get started.
        </p>
        <Link href="/for-clubs" className={ctaPrimary}>
          Next-Up for clubs
        </Link>
      </div>
    </section>
  )
}
