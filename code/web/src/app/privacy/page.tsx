import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell, Database, Eye, Lock, Shield, Users } from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { card, ctaPanel, ctaPrimary, ctaSecondary } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Next-Up collects, uses, protects and shares information about players in its pickleball league app and website.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy', title: 'Privacy Policy | Next-Up' },
}

const LAST_UPDATED = '2025-10-01'

const USES = [
  'Provide league management and match coordination services',
  'Generate player statistics and league leaderboards',
  'Send important league notifications and updates',
  'Improve the platform based on user feedback and usage patterns',
  'Ensure fair play and maintain league integrity',
]

const SHARING = [
  'With other league members: name, skill level and match statistics only',
  'With league organisers, for management purposes',
  'When required by law or to protect the safety of our users',
]

const RIGHTS = [
  {
    title: 'Access and update',
    text: 'View and change your profile information at any time in the app.',
  },
  {
    title: 'Delete your account',
    text: 'Request complete deletion of your account and associated data from the contact page.',
  },
  {
    title: 'Data export',
    text: 'Ask for a copy of your league statistics and match history.',
  },
  {
    title: 'Communication',
    text: 'Control which notifications and emails you receive from us.',
  },
]

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <PageIntro icon={Shield} badge="Your privacy matters" title="Privacy Policy" tone="blue">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated:{' '}
          <time dateTime={LAST_UPDATED}>1 October 2025</time>
        </p>
      </PageIntro>

      <div className={`${card} mb-8`}>
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our commitment to you</h2>
        </div>
        <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
          Next-Up takes your privacy seriously. This policy explains how we
          collect, use, protect and share information about you when you use
          the Next-Up app and website.
        </p>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          We believe in transparency and want you to understand exactly how
          your information is handled when you are part of the Next-Up
          community.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: Eye,
            tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            title: 'What we collect',
            text: 'Only the information needed to run leagues and league nights.',
          },
          {
            icon: Lock,
            tone: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            title: 'How we protect it',
            text: 'Industry-standard encryption and access controls.',
          },
          {
            icon: Users,
            tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            title: 'Your control',
            text: 'Access, update or delete your data at any time.',
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
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Information we collect</h2>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Account information</dt>
              <dd className="text-sm text-gray-600 dark:text-gray-300">
                Name, email address, phone number and skill level, to create and manage your account.
              </dd>
            </div>
            <div>
              <dt className="mb-2 font-semibold text-gray-900 dark:text-white">League activity</dt>
              <dd className="text-sm text-gray-600 dark:text-gray-300">
                Match scores, partnership preferences, check-in times and league participation.
              </dd>
            </div>
            <div>
              <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Usage information</dt>
              <dd className="text-sm text-gray-600 dark:text-gray-300">
                How you interact with the app and website, including screens visited and features used, in anonymised form.
              </dd>
            </div>
          </dl>
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">How we use your information</h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 marker:text-green-600 dark:text-gray-300 dark:marker:text-green-400">
            {USES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Information sharing</h2>
          </div>
          <div className="mb-4 rounded-xl bg-green-50/50 p-4 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              We never sell your personal information to third parties.
            </p>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            We only share information in these limited circumstances:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 marker:text-blue-600 dark:text-gray-300 dark:marker:text-blue-400">
            {SHARING.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={card}>
          <div className="mb-6 flex items-center">
            <div className="mr-3 rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
              <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your rights and choices</h2>
          </div>
          <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {RIGHTS.map((right) => (
              <div key={right.title}>
                <dt className="mb-2 font-semibold text-gray-900 dark:text-white">{right.title}</dt>
                <dd className="text-sm text-gray-600 dark:text-gray-300">{right.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`${ctaPanel} mt-12`}>
        <h2 className="mb-4 text-2xl font-bold">Questions about privacy?</h2>
        <p className="mb-6 text-green-100">
          We are happy to explain how your information is protected.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/contact" className={ctaPrimary}>
            Contact us
          </Link>
          <Link href="/terms" className={ctaSecondary}>
            View terms
          </Link>
        </div>
      </div>
    </section>
  )
}
