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
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/ui/IconTile'
import { Panel } from '@/components/ui/Panel'
import { PhoneFrame } from '@/components/ui/PhoneFrame'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stat } from '@/components/ui/Stat'
import { ACTIVE_CLUBS, clubPath, REGIONS } from '@/lib/clubs'
import { cn } from '@/lib/cn'
import { SCREENS } from '@/lib/screens'
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

const ORGANISERS_GET: {
  icon: typeof ClipboardCheck
  tone: IconTone
  title: string
  text: string
}[] = [
  {
    icon: ClipboardCheck,
    tone: 'emerald',
    title: 'Digital check-in',
    text: 'Live attendance for the night, synced to every phone in real time.',
  },
  {
    icon: Shuffle,
    tone: 'blue',
    title: 'Fair auto-matching',
    text: 'Teams with fewer games go first, repeat pairings are avoided and new teams join at the current minimum so nobody waits all night.',
  },
  {
    icon: LayoutGrid,
    tone: 'purple',
    title: 'Real-time court board',
    text: 'Every player sees which court they are on and who is up next. Nothing to announce over the noise.',
  },
  {
    icon: ShieldCheck,
    tone: 'yellow',
    title: 'Validated scoring',
    text: 'Scores are checked as they are entered: first to 15, win by two, no ties.',
  },
  {
    icon: BarChart3,
    tone: 'orange',
    title: 'Standings and stats',
    text: 'Wins, losses, points and averages update the moment a score is submitted, per league and per player.',
  },
  {
    icon: Settings,
    tone: 'pink',
    title: 'Organiser controls',
    text: 'Set league days, court counts and labels, start and end nights, and manage memberships from the app.',
  },
]

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
      <Section tone="navy" size="md" width="wide" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <PageIntro
            icon={Building2}
            badge="Built for league organisers"
            title="Pickleball league management software for clubs"
            align="responsive"
          >
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl lg:mx-0">
              Next-Up runs your league night for you. Players check in on their
              phones, the app pairs partners, assigns courts the moment one frees
              up and posts scores to live standings. No spreadsheets, no
              whiteboard, no waiting around.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button href="/contact">
                Set up your league
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#how-it-works" variant="on-dark">
                See how a night runs
              </Button>
            </div>
          </PageIntro>

          <div className="relative mx-auto w-full max-w-[16rem] animate-rise [animation-delay:150ms] sm:max-w-[18rem] lg:max-w-[20rem]">
            <div
              className="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2 scale-150 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.3),transparent)]"
              aria-hidden="true"
            />
            <div className="relative max-h-[26rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)] lg:max-h-none lg:[mask-image:none]">
              <PhoneFrame
                src={SCREENS.event.src}
                alt={SCREENS.event.alt}
                size="lg"
                preload
                sizes="(min-width: 1024px) 320px, 288px"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section size="md" width="default">
        <div className="space-y-16 sm:space-y-20">
          {/* How a league night runs */}
          <div id="how-it-works" className="scroll-mt-20">
            <SectionHeading
              title="How a league night runs on Next-Up"
              lede="Everyone-vs-everyone doubles, from the first check-in to the final score."
            />
            <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {HOW_IT_RUNS.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 90} className="relative h-full">
                  <Card
                    className={cn(
                      'h-full',
                      index < HOW_IT_RUNS.length - 1 &&
                        'xl:after:absolute xl:after:top-11 xl:after:left-full xl:after:h-px xl:after:w-6 xl:after:bg-emerald-300 dark:xl:after:bg-emerald-700',
                    )}
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 font-display text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {step.text}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* What organisers get */}
          <div>
            <SectionHeading
              title="What organisers get"
              lede="The tools that replace the whiteboard, the clipboard and the spreadsheet."
            />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {ORGANISERS_GET.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 90} className="h-full">
                  <Card className="h-full">
                    <IconTile icon={item.icon} tone={item.tone} className="mb-4" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.text}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Proof */}
          <Reveal>
            <Card className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Proven on real league nights
              </h2>
              <p className="mx-auto mt-3 mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
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
                <Stat value={`${STATS.activePlayers}+`} label="Active players" />
                <Stat value={`${STATS.matchesPlayed}+`} label="Matches played" />
                <Stat
                  value={ACTIVE_CLUBS.length}
                  label={`${ACTIVE_CLUBS.length === 1 ? 'League' : 'Leagues'} in ${REGIONS.johannesburg.name}`}
                />
              </dl>
            </Card>
          </Reveal>

          {/* Closing CTA */}
          <div>
            <Reveal>
              <Panel tone="brand" className="text-center">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to run your next league night?
                </h2>
                <p className="mx-auto mt-3 mb-6 max-w-2xl text-green-100">
                  Tell us about your club, courts and league days and we will get you
                  set up. Your players only need the free app.
                </p>
                <Button href="/contact" variant="on-brand">
                  Contact us
                </Button>
              </Panel>
            </Reveal>
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Players download the free app
              </p>
              <StoreButtons />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
