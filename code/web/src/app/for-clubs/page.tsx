import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  LayoutGrid,
  Settings,
  Shuffle,
  ShieldCheck,
} from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { StoreButtons } from '@/components/StoreButtons'
import { card, ctaPanel, ctaPrimary } from '@/components/ui'
import { ACTIVE_CLUBS, clubPath, REGIONS } from '@/lib/clubs'
import { STATS } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: 'Pickleball League Management Software for Clubs | Next-Up' },
  description:
    'Run league nights without spreadsheets. Next-Up auto-matches doubles partners, assigns courts in real time and keeps standings updated. Built for pickleball clubs.',
  alternates: { canonical: '/for-clubs' },
  openGraph: {
    url: '/for-clubs',
    title: 'Pickleball League Management Software for Clubs | Next-Up',
    description:
      'Run league nights without spreadsheets. Next-Up auto-matches doubles partners, assigns courts in real time and keeps standings updated.',
  },
}

const HOW_IT_RUNS = [
  {
    title: 'Players check in',
    text: 'Everyone checks in on their phone as they arrive, so organisers see who is ready to play without a clipboard.',
  },
  {
    title: 'Partners pair up',
    text: 'Players send and accept partner requests in the app to form doubles teams for the night.',
  },
  {
    title: 'Courts fill themselves',
    text: 'When the organiser starts the night, Next-Up assigns matches to every open court, giving priority to teams with the fewest games.',
  },
  {
    title: 'Scores post, the next match starts',
    text: 'Teams submit the score, the court frees up and the next match in the queue is assigned automatically.',
  },
] as const

const ORGANISERS_GET = [
  {
    icon: ClipboardCheck,
    tone: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    title: 'Digital check-in',
    text: 'Live attendance for the night, synced to every phone in real time.',
  },
  {
    icon: Shuffle,
    tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    title: 'Fair auto-matching',
    text: 'Teams with fewer games go first, repeat pairings are avoided and new teams join at the current minimum so nobody waits all night.',
  },
  {
    icon: LayoutGrid,
    tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    title: 'Real-time court board',
    text: 'Every player sees which court they are on and who is up next. Nothing to announce over the noise.',
  },
  {
    icon: ShieldCheck,
    tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    title: 'Validated scoring',
    text: 'Scores are checked as they are entered: first to 15, win by two, no ties.',
  },
  {
    icon: BarChart3,
    tone: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    title: 'Standings and stats',
    text: 'Wins, losses, points and averages update the moment a score is submitted, per league and per player.',
  },
  {
    icon: Settings,
    tone: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    title: 'Organiser controls',
    text: 'Set league days, court counts and labels, start and end nights, and manage memberships from the app.',
  },
] as const

// "Northcliff Eagles at Northcliff Country Club and GPC Pickleball at ..."
// with each club name linking to its page.
function ClubList() {
  return (
    <>
      {ACTIVE_CLUBS.map((club, index) => (
        <span key={club.id}>
          {index > 0 && (index === ACTIVE_CLUBS.length - 1 ? ' and ' : ', ')}
          <Link
            href={clubPath(club)}
            className="font-medium text-green-600 underline-offset-2 hover:underline dark:text-green-400"
          >
            {club.name}
          </Link>{' '}
          at {club.venue}
        </span>
      ))}
    </>
  )
}

export default function ForClubsPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-8">
        <PageIntro
          icon={Building2}
          badge="Built for league organisers"
          title="Pickleball league management software for clubs"
        >
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            Next-Up runs your league night for you. Players check in on their
            phones, the app pairs partners, assigns courts the moment one frees
            up and posts scores to live standings. No spreadsheets, no
            whiteboard, no waiting around.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
            >
              Set up your league
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              See how a night runs
            </a>
          </div>
        </PageIntro>
      </section>

      {/* How a league night runs */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            How a league night runs on Next-Up
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everyone-vs-everyone doubles, from the first check-in to the final score.
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {HOW_IT_RUNS.map((step, index) => (
            <li key={step.title} className={card}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-lg font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* What organisers get */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            What organisers get
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The tools that replace the whiteboard, the clipboard and the spreadsheet.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ORGANISERS_GET.map((item) => (
            <div key={item.title} className={card}>
              <div className={`mb-4 w-fit rounded-xl p-3 ${item.tone}`}>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className={`${card} text-center`}>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            Proven on real league nights
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Next-Up runs <ClubList /> in{' '}
            <Link
              href={`/leagues/${REGIONS.johannesburg.slug}`}
              className="font-medium text-green-600 underline-offset-2 hover:underline dark:text-green-400"
            >
              {REGIONS.johannesburg.name}
            </Link>
            , South Africa.
          </p>
          <dl className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <dd className="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
                {STATS.activePlayers}+
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">Active players</dt>
            </div>
            <div>
              <dd className="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
                {STATS.matchesPlayed}+
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">Matches played</dt>
            </div>
            <div>
              <dd className="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
                {ACTIVE_CLUBS.length}
              </dd>
              <dt className="text-gray-600 dark:text-gray-300">
                {ACTIVE_CLUBS.length === 1 ? 'League' : 'Leagues'} in{' '}
                {REGIONS.johannesburg.name}
              </dt>
            </div>
          </dl>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className={ctaPanel}>
          <h2 className="mb-2 text-2xl font-bold">Ready to run your next league night?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-green-100">
            Tell us about your club, courts and league days and we will get you
            set up. Your players only need the free app.
          </p>
          <Link href="/contact" className={ctaPrimary}>
            Contact us
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Players download the free app
          </p>
          <StoreButtons />
        </div>
      </section>
    </>
  )
}
