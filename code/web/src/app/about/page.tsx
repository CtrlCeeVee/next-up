import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BarChart3,
  CircleHelp,
  ClipboardList,
  Clock,
  Heart,
  MapPin,
  Settings,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { card, ctaPanel, ctaPrimary } from '@/components/ui'
import { ACTIVE_CLUBS, formatSchedule, REGIONS } from '@/lib/clubs'
import { LEGAL_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: 'About Next-Up | Pickleball League Platform, South Africa' },
  description:
    'Next-Up exists to transform how pickleball leagues operate across South Africa: digital check-in, automatic match assignment, live scores and rankings. A product of Nextup Sport (Pty) Ltd.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: '/about',
    title: 'About Next-Up',
    description:
      'Making pickleball leagues across South Africa seamless and fun, with an app that handles check-in, matching, scoring and rankings.',
  },
}

const PROBLEMS = [
  {
    icon: ClipboardList,
    tone: 'bg-red-100 dark:bg-red-900/30',
    iconTone: 'text-red-600 dark:text-red-400',
    title: 'Paper chaos',
    text: 'No more lost sign-up sheets, unclear match schedules or confusing score tracking.',
  },
  {
    icon: Clock,
    tone: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconTone: 'text-yellow-600 dark:text-yellow-400',
    title: 'Wasted time',
    text: 'Automatic match assignment and live court updates keep games flowing all night.',
  },
  {
    icon: CircleHelp,
    tone: 'bg-purple-100 dark:bg-purple-900/30',
    iconTone: 'text-purple-600 dark:text-purple-400',
    title: 'Confusion',
    text: 'Everyone can see their next match, their partner and the league standings.',
  },
] as const

const FEATURES = [
  {
    icon: Users,
    tone: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    title: 'Smart check-ins',
    text: 'Players check in on their phone, so organisers see who is ready to play in real time.',
  },
  {
    icon: Target,
    tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    title: 'Auto-matching',
    text: 'Partner pairing and match assignment happen automatically the moment a court frees up.',
  },
  {
    icon: Trophy,
    tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    title: 'Live scoring',
    text: 'Scores are submitted from the court and standings update instantly.',
  },
  {
    icon: Zap,
    tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    title: 'Real-time updates',
    text: 'Everyone stays informed about match assignments and league progress.',
  },
  {
    icon: BarChart3,
    tone: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    title: 'Player analytics',
    text: 'Track personal progress, win rates, streaks and improvement over time.',
  },
  {
    icon: Settings,
    tone: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    title: 'League management',
    text: 'Complete tools for organisers to run seasons, league nights and tournaments.',
  },
] as const

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <PageIntro
        icon={Zap}
        badge="Revolutionizing Pickleball in South Africa"
        title={
          <>
            Making Pickleball{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              Seamless &amp; Fun
            </span>
          </>
        }
      >
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          Next-Up exists to transform how pickleball leagues operate across
          South Africa, making every game night smoother, more competitive, and
          more enjoyable for everyone involved.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          A product of {LEGAL_NAME}
        </p>
      </PageIntro>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className={card}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
              <Target className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our mission</h2>
          </div>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            To eliminate the chaos of paper-based league management and create a
            seamless digital experience that keeps players engaged, matches
            flowing and communities thriving.
          </p>
        </div>

        <div className={card}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our vision</h2>
          </div>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            Every pickleball league in South Africa running like clockwork, with
            players focused on the game they love rather than logistics.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">What we solve</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Traditional league management creates friction. We remove it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROBLEMS.map((item) => (
            <div key={item.title} className="p-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${item.tone}`}
              >
                <item.icon className={`h-7 w-7 ${item.iconTone}`} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${card} mb-16`}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How we help</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className={`flex-shrink-0 rounded-lg p-2 ${feature.tone}`}>
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Where we play</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Next-Up leagues currently run at these clubs, with more cities on
            the way.
          </p>
        </div>
        <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {ACTIVE_CLUBS.map((club) => (
            <li key={club.id} className={card}>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                {club.name}
              </h3>
              <p className="mb-1 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500 dark:text-blue-400"
                  aria-hidden="true"
                />
                <span>
                  {club.venue}, {club.suburb}, {club.city}
                </span>
              </p>
              <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500 dark:text-orange-400"
                  aria-hidden="true"
                />
                <span>{formatSchedule(club)}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <Link
            href={`/leagues/${REGIONS.johannesburg.slug}`}
            className="font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Pickleball leagues in {REGIONS.johannesburg.name}
          </Link>
        </p>
      </div>

      <div className={ctaPanel}>
        <h2 className="mb-4 text-2xl font-bold">Built for South African Pickleball</h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-green-100">
          Designed specifically for the unique needs of South African pickleball
          communities. From Johannesburg to Cape Town, we understand the local
          league culture and what makes the game special here.
        </p>
        <div className="mt-6">
          <Link href="/#download" className={ctaPrimary}>
            Join a League Today
          </Link>
        </div>
      </div>
    </section>
  )
}
