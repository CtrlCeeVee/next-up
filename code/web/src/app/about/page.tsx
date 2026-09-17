import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
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
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/ui/IconTile'
import { Monogram } from '@/components/ui/Monogram'
import { Panel } from '@/components/ui/Panel'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ACTIVE_CLUBS, clubPath, formatSchedule, REGIONS } from '@/lib/clubs'
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

const PROBLEMS: { icon: typeof ClipboardList; tone: IconTone; title: string; text: string }[] = [
  {
    icon: ClipboardList,
    tone: 'red',
    title: 'Paper chaos',
    text: 'No more lost sign-up sheets, unclear match schedules or confusing score tracking.',
  },
  {
    icon: Clock,
    tone: 'yellow',
    title: 'Wasted time',
    text: 'Automatic match assignment and live court updates keep games flowing all night.',
  },
  {
    icon: CircleHelp,
    tone: 'purple',
    title: 'Confusion',
    text: 'Everyone can see their next match, their partner and the league standings.',
  },
]

const FEATURES: { icon: typeof Users; tone: IconTone; title: string; text: string }[] = [
  {
    icon: Users,
    tone: 'emerald',
    title: 'Smart check-ins',
    text: 'Players check in on their phone, so organisers see who is ready to play in real time.',
  },
  {
    icon: Target,
    tone: 'blue',
    title: 'Auto-matching',
    text: 'Partner pairing and match assignment happen automatically the moment a court frees up.',
  },
  {
    icon: Trophy,
    tone: 'purple',
    title: 'Live scoring',
    text: 'Scores are submitted from the court and standings update instantly.',
  },
  {
    icon: Zap,
    tone: 'yellow',
    title: 'Real-time updates',
    text: 'Everyone stays informed about match assignments and league progress.',
  },
  {
    icon: BarChart3,
    tone: 'orange',
    title: 'Player analytics',
    text: 'Track personal progress, win rates, streaks and improvement over time.',
  },
  {
    icon: Settings,
    tone: 'pink',
    title: 'League management',
    text: 'Complete tools for organisers to run seasons, league nights and tournaments.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Section tone="navy" size="sm" width="narrow">
        <PageIntro
          icon={Zap}
          badge="Revolutionizing Pickleball in South Africa"
          title={
            <>
              Making Pickleball{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Seamless &amp; Fun
              </span>
            </>
          }
        >
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Next-Up exists to transform how pickleball leagues operate across
            South Africa, making every game night smoother, more competitive, and
            more enjoyable for everyone involved.
          </p>
          <p className="mt-4 text-sm text-white/60">A product of {LEGAL_NAME}</p>
        </PageIntro>
      </Section>

      <Section size="md" width="narrow">
        <div className="space-y-16 sm:space-y-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <Reveal className="h-full">
              <Card className="h-full">
                <div className="mb-4 flex items-center gap-4">
                  <IconTile icon={Target} tone="emerald" size="lg" />
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                    Our mission
                  </h2>
                </div>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  To eliminate the chaos of paper-based league management and create a
                  seamless digital experience that keeps players engaged, matches
                  flowing and communities thriving.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={90} className="h-full">
              <Card className="h-full">
                <div className="mb-4 flex items-center gap-4">
                  <IconTile icon={Heart} tone="blue" size="lg" />
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                    Our vision
                  </h2>
                </div>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Every pickleball league in South Africa running like clockwork, with
                  players focused on the game they love rather than logistics.
                </p>
              </Card>
            </Reveal>
          </div>

          <div>
            <SectionHeading
              title="What we solve"
              lede="Traditional league management creates friction. We remove it."
            />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {PROBLEMS.map((item, index) => (
                <Reveal key={item.title} delay={index * 90} className="p-4 text-center">
                  <IconTile icon={item.icon} tone={item.tone} size="lg" className="mb-4" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <Card>
              <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                How we help
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <IconTile icon={feature.icon} tone={feature.tone} size="sm" />
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <div>
            <SectionHeading
              title="Where we play"
              lede="Next-Up leagues currently run at these clubs, with more cities on the way."
            />
            <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {ACTIVE_CLUBS.map((club, index) => (
                <Reveal as="li" key={club.id} delay={index * 90} className="h-full">
                  <Card interactive className="h-full">
                    <h3 className="mb-3 flex items-center gap-3 font-display text-lg font-bold text-gray-900 dark:text-white">
                      <Monogram name={club.name} size="sm" />
                      <Link
                        href={clubPath(club)}
                        className="transition-colors hover:text-green-600 dark:hover:text-green-400"
                      >
                        {club.name}
                      </Link>
                    </h3>
                    <p className="mb-1 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400"
                        aria-hidden="true"
                      />
                      <span>
                        {club.venue}, {club.suburb}, {club.city}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock
                        className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400"
                        aria-hidden="true"
                      />
                      <span>{formatSchedule(club)}</span>
                    </p>
                  </Card>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-center">
              <Link
                href={`/leagues/${REGIONS.johannesburg.slug}`}
                className="inline-flex items-center gap-2 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                Pickleball leagues in {REGIONS.johannesburg.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          </div>

          <Reveal>
            <Panel tone="brand" className="text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Built for South African Pickleball
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-green-100">
                Designed specifically for the unique needs of South African pickleball
                communities. From Johannesburg to Cape Town, we understand the local
                league culture and what makes the game special here.
              </p>
              <Button href="/#download" variant="on-brand" className="mt-6">
                Join a League Today
              </Button>
            </Panel>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
