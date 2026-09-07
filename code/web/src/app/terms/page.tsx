import type { Metadata } from 'next'
import Link from 'next/link'
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
import { card, ctaPanel, ctaPrimary, ctaSecondary } from '@/components/ui'

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
          <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tone}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <PageIntro icon={FileText} badge="Legal agreement" title="Terms of Service" tone="blue">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: <time dateTime={LAST_UPDATED}>1 October 2025</time>
          <br />
          Effective from your first use of Next-Up
        </p>
      </PageIntro>

      <div className={`${card} mb-8`}>
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
            <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Next-Up</h2>
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
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: Users,
            tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            title: 'Fair play',
            text: 'Respectful behaviour and honest scoring are required.',
          },
          {
            icon: Shield,
            tone: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            title: 'Your data',
            text: 'We protect your information and never sell it.',
          },
          {
            icon: Gavel,
            tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            title: 'South African law',
            text: 'Governed by the South African legal framework.',
          },
        ].map((item) => (
          <div key={item.title} className={`${card} text-center`}>
            <div className={`mx-auto mb-4 w-fit rounded-xl p-3 ${item.tone}`}>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your account and responsibilities
            </h2>
          </div>
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
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform use guidelines</h2>
          </div>
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
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <TriangleAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Service availability and limitations
            </h2>
          </div>
          <div className="mb-4 rounded-xl bg-yellow-50/50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Next-Up is provided &ldquo;as is&rdquo;. We aim for 99% uptime but cannot guarantee uninterrupted service.
            </p>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
            {AVAILABILITY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Data, privacy and termination
            </h2>
          </div>
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
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
              <Gavel className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Legal framework</h2>
          </div>
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
        </div>
      </div>

      <div className={`${ctaPanel} mt-12`}>
        <h2 className="mb-4 text-2xl font-bold">Questions about these Terms?</h2>
        <p className="mb-6 text-green-100">
          We will clarify anything that is unclear or answer your legal questions.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/contact" className={ctaPrimary}>
            Contact us
          </Link>
          <Link href="/privacy" className={ctaSecondary}>
            Privacy policy
          </Link>
        </div>
      </div>
    </section>
  )
}
