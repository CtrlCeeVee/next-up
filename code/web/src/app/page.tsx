import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, Smartphone, Zap } from 'lucide-react'
import { ClubCard } from '@/components/ClubCard'
import { HowItWorks } from '@/components/HowItWorks'
import { StoreButtons } from '@/components/StoreButtons'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { PhoneFrame } from '@/components/ui/PhoneFrame'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stat } from '@/components/ui/Stat'
import { ACTIVE_CLUBS, REGIONS } from '@/lib/clubs'
import { SCREENS } from '@/lib/screens'
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

      {/* Hero: navy band in both modes, phones on the right. */}
      <Section tone="navy" size="md" width="wide" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="animate-rise text-center lg:text-left">
            <Eyebrow icon={Zap} tone="on-dark">
              South Africa&apos;s Premier Pickleball Platform
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              <span className="text-white">Discover Amazing</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Pickleball Leagues
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl lg:mx-0">
              Join dynamic leagues, track your progress, and become part of South
              Africa&apos;s fastest-growing pickleball community.
              <span className="font-semibold text-emerald-300">
                {' '}
                Download the app to get started!
              </span>
            </p>

            <div
              id="download"
              className="mt-8 flex scroll-mt-20 flex-col items-center gap-4 lg:items-start"
            >
              <p className="text-sm font-medium text-white/70">
                Download the free app to check in, play and track your stats
              </p>
              <StoreButtons align="start" />
              <p className="text-xs text-white/60">
                Run a club or league?{' '}
                <Link
                  href="/for-clubs"
                  className="font-medium text-emerald-300 underline-offset-2 hover:underline"
                >
                  See Next-Up for clubs
                </Link>
              </p>
            </div>
          </div>

          {/* Two app screens. Clipped on small screens so the hero does not
              become a full phone tall; full height from lg up. */}
          <div className="relative mx-auto w-full max-w-sm animate-rise [animation-delay:100ms] lg:max-w-none">
            <div
              className="absolute inset-x-0 top-1/2 -z-0 aspect-square -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.35),transparent)]"
              aria-hidden="true"
            />
            <div className="relative max-h-[30rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)] lg:max-h-none lg:[mask-image:none]">
              <div className="relative mx-auto flex max-w-[26rem] items-start justify-center px-4 pt-6">
                <PhoneFrame
                  src={SCREENS.event.src}
                  alt={SCREENS.event.alt}
                  tilt="left"
                  size="md"
                  sizes="(min-width: 1024px) 200px, 38vw"
                  className="hidden w-[42%] translate-y-10 sm:block"
                />
                <PhoneFrame
                  src={SCREENS.home.src}
                  alt={SCREENS.home.alt}
                  tilt="right"
                  size="lg"
                  preload
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 48vw, 70vw"
                  className="w-[68%] sm:-ml-6 sm:w-[52%]"
                />
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:mt-20">
          <Stat tone="on-dark" value={`${STATS.activePlayers}+`} label="Active Players" />
          <Stat
            tone="on-dark"
            value={ACTIVE_CLUBS.length}
            label={ACTIVE_CLUBS.length === 1 ? 'League' : 'Leagues'}
          />
          <Stat tone="on-dark" value={`${STATS.matchesPlayed}+`} label="Matches Played" />
        </dl>
      </Section>

      {/* Leagues */}
      <Section id="clubs" size="md" width="wide" className="scroll-mt-20">
        <SectionHeading
          title={
            <>
              Active <span className="text-green-600 dark:text-green-400">Leagues</span>
            </>
          }
          lede="Browse leagues in your area and find the perfect fit for your skill level"
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {ACTIVE_CLUBS.map((club, index) => (
            <Reveal key={club.id} delay={index * 90} className="h-full">
              <ClubCard club={club} />
            </Reveal>
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
      </Section>

      {/* How it works */}
      <Section size="sm" width="wide">
        <HowItWorks />
      </Section>

      {/* Clubs and download */}
      <Section size="md" width="wide" className="pt-0 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="h-full">
            <Panel tone="navy" className="flex h-full flex-col items-start text-left">
              <Eyebrow icon={Building2} tone="on-dark">
                Built for league organisers
              </Eyebrow>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Run a club or league?
              </h2>
              <p className="mt-3 leading-relaxed text-white/80">
                Next-Up runs your league night for you. Players check in on their
                phones, the app pairs partners, assigns courts the moment one frees
                up and posts scores to live standings. No spreadsheets, no
                whiteboard, no waiting around.
              </p>
              <Button href="/for-clubs" variant="on-dark" className="mt-6">
                See Next-Up for clubs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Panel>
          </Reveal>
          <Reveal delay={90} className="h-full">
            <Panel tone="brand" className="flex h-full flex-col items-center text-center">
              <Eyebrow icon={Smartphone} tone="on-dark">
                Free on iOS and Android
              </Eyebrow>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Download the app to get started!
              </h2>
              <p className="mt-3 text-green-100">
                Download the free app to check in, play and track your stats
              </p>
              <StoreButtons className="mt-6" />
            </Panel>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
