import type { Metadata } from 'next'
import {
  Check,
  CircleCheck,
  FileText,
  Gavel,
  Shield,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/ui/IconTile'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern use of the Next-Up pickleball league app and website, including fair play, account responsibilities and South African governing law.',
  alternates: { canonical: '/terms' },
  openGraph: { url: '/terms', title: 'Terms of Service | Next-Up' },
}

const LAST_UPDATED = '2025-10-01'

const ALLOWED = [
  'Managing your league participation',
  'Tracking your match statistics',
  'Communicating with league members',
  'Accessing league leaderboards',
  'Giving feedback to improve the platform',
]

const PROHIBITED = [
  "Sharing another person's account",
  'Submitting false scores or information',
  'Harassing or bullying other users',
  'Attempting to hack or disrupt the service',
  'Using the platform for commercial purposes',
]

const AVAILABILITY = [
  'We may update, modify or discontinue features with reasonable notice',
  'Scheduled maintenance will be announced in advance where possible',
  'We are not liable for losses caused by service interruptions',
  'League organisers remain responsible for their league management decisions',
  'Match disputes should be resolved between players first, then escalated if needed',
]

const DATA_RIGHTS = [
  'Access and download your match history',
  'Update your profile information at any time',
  'Delete your account (some statistics may be kept for league integrity)',
  'Control your notification preferences',
]

const TERMINATION = [
  'You can delete your account at any time',
  'We may suspend accounts for violations of these Terms',
  'Match history may be preserved for league records',
  '30 days notice for service discontinuation',
]

const SUMMARY: { icon: typeof Users; tone: IconTone; title: string; text: string }[] = [
  {
    icon: Users,
    tone: 'emerald',
    title: 'Fair play',
    text: 'Respectful behaviour and honest scoring are required.',
  },
  {
    icon: Shield,
    tone: 'blue',
    title: 'Your data',
    text: 'We protect your information and never sell it.',
  },
  {
    icon: Gavel,
    tone: 'navy',
    title: 'South African law',
    text: 'Governed by the South African legal framework.',
  },
]

function IconList({
  items,
  icon: Icon,
  tone,
}: {
  items: string[]
  icon: typeof Check
  tone: string
}) {
  return (
    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function CardHeading({
  icon,
  tone,
  children,
}: {
  icon: typeof Users
  tone: IconTone
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <IconTile icon={icon} tone={tone} size="sm" />
      <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">{children}</h2>
    </div>
  )
}

export default function TermsPage() {
  return (
    <>
      <Section tone="navy" size="sm" width="narrow">
        <PageIntro icon={FileText} badge="Legal agreement" title="Terms of Service">
          <p className="text-lg text-white/80">
            Last updated: <time dateTime={LAST_UPDATED}>1 October 2025</time>
            <br />
            Effective from your first use of Next-Up
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="narrow">
        <Card className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <IconTile icon={CircleCheck} tone="emerald" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Next-Up
            </h2>
          </div>
          <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the
            Next-Up pickleball league platform, including the mobile app and this
            website. By creating an account or using our services you agree to be
            bound by these Terms.
          </p>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            We have written these Terms to be as clear and fair as possible. If
            you have questions, please contact us before using the platform.
          </p>
        </Card>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SUMMARY.map((item, index) => (
            <Reveal key={item.title} delay={index * 90} className="h-full">
              <Card className="h-full text-center">
                <IconTile icon={item.icon} tone={item.tone} className="mb-4" />
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="space-y-8">
          <Reveal>
            <Card>
              <CardHeading icon={Users} tone="emerald">
                Your account and responsibilities
              </CardHeading>
              <dl className="space-y-4">
                <div>
                  <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Account creation</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300">
                    Provide accurate information and keep your account details up to date. One account per person, and you are responsible for keeping your login secure.
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Fair play</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300">
                    Submit honest match scores, treat other players with respect and follow league rules. No cheating, harassment or disruptive behaviour.
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 font-semibold text-gray-900 dark:text-white">League participation</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300">
                    Check in only when you are actually present, communicate clearly with partners and respect other players&apos; time.
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Shield} tone="navy">
                Platform use guidelines
              </CardHeading>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold text-green-600 dark:text-green-400">Allowed uses</h3>
                  <IconList items={ALLOWED} icon={Check} tone="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-red-600 dark:text-red-400">Prohibited uses</h3>
                  <IconList items={PROHIBITED} icon={X} tone="text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={TriangleAlert} tone="yellow">
                Service availability and limitations
              </CardHeading>
              <div className="mb-4 rounded-xl bg-yellow-50/70 p-4 dark:bg-yellow-900/20">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Next-Up is provided &ldquo;as is&rdquo;. We aim for 99% uptime but cannot guarantee uninterrupted service.
                </p>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
                {AVAILABILITY.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Shield} tone="blue">
                Data, privacy and termination
              </CardHeading>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Your data rights</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                    {DATA_RIGHTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Account termination</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                    {TERMINATION.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Gavel} tone="navy">
                Legal framework
              </CardHeading>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Governing law:</strong> these Terms are governed by South African law. Any disputes will be resolved in South African courts.
                </p>
                <p>
                  <strong>Limitation of liability:</strong> Next-Up&apos;s liability is limited to the amount you have paid for our services. We are not responsible for indirect damages.
                </p>
                <p>
                  <strong>Changes to Terms:</strong> we may update these Terms with 30 days notice. Continued use means you accept the new Terms.
                </p>
                <p>
                  <strong>Legal contact:</strong> for legal questions, email{' '}
                  <a
                    href="mailto:legal@next-up.co.za"
                    className="text-green-600 underline-offset-2 hover:underline dark:text-green-400"
                  >
                    legal@next-up.co.za
                  </a>
                </p>
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <Card padding="lg" className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Questions about these Terms?
            </h2>
            <p className="mt-3 mb-6 text-gray-600 dark:text-gray-300">
              We will clarify anything that is unclear or answer your legal questions.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/contact">Contact us</Button>
              <Button href="/privacy" variant="secondary">
                Privacy policy
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  )
}
