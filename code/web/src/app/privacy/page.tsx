import type { Metadata } from 'next'
import { Bell, Database, Eye, Lock, Shield, Users } from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/ui/IconTile'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'

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

const SUMMARY: { icon: typeof Eye; tone: IconTone; title: string; text: string }[] = [
  {
    icon: Eye,
    tone: 'blue',
    title: 'What we collect',
    text: 'Only the information needed to run leagues and league nights.',
  },
  {
    icon: Lock,
    tone: 'navy',
    title: 'How we protect it',
    text: 'Industry-standard encryption and access controls.',
  },
  {
    icon: Users,
    tone: 'emerald',
    title: 'Your control',
    text: 'Access, update or delete your data at any time.',
  },
]

function CardHeading({
  icon,
  tone,
  children,
}: {
  icon: typeof Eye
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

export default function PrivacyPage() {
  return (
    <>
      <Section tone="navy" size="sm" width="narrow">
        <PageIntro icon={Shield} badge="Your privacy matters" title="Privacy Policy">
          <p className="text-lg text-white/80">
            Last updated: <time dateTime={LAST_UPDATED}>1 October 2025</time>
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="narrow">
        <Card className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <IconTile icon={Shield} tone="emerald" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Our commitment to you
            </h2>
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
              <CardHeading icon={Database} tone="blue">
                Information we collect
              </CardHeading>
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
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Users} tone="emerald">
                How we use your information
              </CardHeading>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 marker:text-green-600 dark:text-gray-300 dark:marker:text-green-400">
                {USES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Lock} tone="navy">
                Information sharing
              </CardHeading>
              <div className="mb-4 rounded-xl bg-green-50/70 p-4 dark:bg-green-900/20">
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
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Bell} tone="yellow">
                Your rights and choices
              </CardHeading>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {RIGHTS.map((right) => (
                  <div key={right.title}>
                    <dt className="mb-2 font-semibold text-gray-900 dark:text-white">{right.title}</dt>
                    <dd className="text-sm text-gray-600 dark:text-gray-300">{right.text}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <Card padding="lg" className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Questions about privacy?
            </h2>
            <p className="mt-3 mb-6 text-gray-600 dark:text-gray-300">
              We are happy to explain how your information is protected.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/contact">Contact us</Button>
              <Button href="/terms" variant="secondary">
                View terms
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  )
}
