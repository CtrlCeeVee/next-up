import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { ClubCard } from '@/components/ClubCard'
import { HowItWorks } from '@/components/HowItWorks'
import { StoreButtons } from '@/components/StoreButtons'
import { ACTIVE_CLUBS, REGIONS } from '@/lib/clubs'
import {
  APP_NAME,
  APP_STORE_URL,
  ORGANIZATION_ID,
  PLAY_STORE_URL,
  SITE_URL,
  STATS,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Next-Up | Competitive Pickleball Leagues in South Africa',
  description:
    "Join dynamic pickleball leagues, track your progress and become part of South Africa's fastest-growing pickleball community. Check in, get matched and play with the free Next-Up app.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: 'Next-Up | Competitive Pickleball Leagues in South Africa',
    description:
      "Join dynamic pickleball leagues, track your progress and become part of South Africa's fastest-growing pickleball community.",
  },
}

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: APP_NAME,
  operatingSystem: 'iOS, Android',
  applicationCategory: 'SportsApplication',
  description:
    'League check-in, automatic match assignment, live scores and rankings for Next-Up pickleball leagues.',
  installUrl: [APP_STORE_URL, PLAY_STORE_URL],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ZAR',
  },
  author: { '@id': ORGANIZATION_ID },
  url: SITE_URL,
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-16">
        <div className="mb-8 text-center sm:mb-16">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100/80 px-4 py-2 text-sm font-medium text-green-800 backdrop-blur-sm dark:bg-green-900/30 dark:text-green-300">
            <Zap className="h-4 w-4" aria-hidden="true" />
            <span>South Africa&apos;s Premier Pickleball Platform</span>
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-5xl md:text-7xl">
            <span className="bg-gradient-to-r from-slate-900 via-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-white dark:via-green-400 dark:to-emerald-400">
              Discover Amazing
            </span>{' '}
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              Pickleball Leagues
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-3xl px-4 text-base text-gray-600 sm:mb-8 sm:px-0 sm:text-xl dark:text-gray-300">
            Join dynamic leagues, track your progress, and become part of South
            Africa&apos;s fastest-growing pickleball community.
            <span className="font-semibold text-green-600 dark:text-green-400">
              {' '}
              Download the app to get started!
            </span>
          </p>

          <div id="download" className="mb-12 flex scroll-mt-24 flex-col items-center gap-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Download the free app to check in, play and track your stats
            </p>
            <StoreButtons />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Run a club or league?{' '}
              <Link
                href="/for-clubs"
                className="font-medium text-green-600 underline-offset-2 hover:underline dark:text-green-400"
              >
                See Next-Up for clubs
              </Link>
            </p>
          </div>

          <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <dd className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {STATS.activePlayers}+
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">Active Players</dt>
            </div>
            <div className="text-center">
              <dd className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {ACTIVE_CLUBS.length}
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">
                {ACTIVE_CLUBS.length === 1 ? 'League' : 'Leagues'}
              </dt>
            </div>
            <div className="text-center">
              <dd className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {STATS.matchesPlayed}+
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">Matches Played</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* Leagues */}
      <section id="clubs" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Active <span className="text-green-600 dark:text-green-400">Leagues</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Browse leagues in your area and find the perfect fit for your skill level
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
          {ACTIVE_CLUBS.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link
            href={`/leagues/${REGIONS.johannesburg.slug}`}
            className="inline-flex items-center gap-2 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            All pickleball leagues in {REGIONS.johannesburg.name}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:pb-16">
        <HowItWorks />
      </section>
    </>
  )
}
