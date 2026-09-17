import type { Metadata } from 'next'
import { Clock, Mail, MapPin, MessageSquare, Phone, Trash2 } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { PageIntro } from '@/components/PageIntro'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile } from '@/components/ui/IconTile'
import { Panel } from '@/components/ui/Panel'
import { Section } from '@/components/ui/Section'
import { CONTACT_EMAIL, LEGAL_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: 'Contact Next-Up | Pickleball League Support' },
  description:
    'Get in touch with Next-Up about pickleball leagues, league night support, running a league at your club, or deleting your account.',
  alternates: { canonical: '/contact' },
  openGraph: {
    url: '/contact',
    title: 'Contact Next-Up',
    description: 'Questions about a league, league night support, or your account.',
  },
}

const PHONE_DISPLAY = '+27 60 728 9497'
const PHONE_TEL = '+27607289497'

const HOURS = [
  { day: 'Monday to Friday', time: '8:00 to 18:00' },
  { day: 'Saturday', time: '9:00 to 14:00' },
  { day: 'Sunday', time: 'Closed' },
] as const

export default function ContactPage() {
  return (
    <>
      <Section tone="navy" size="sm" width="default">
        <PageIntro icon={MessageSquare} badge="We reply to every message" title="Contact Next-Up">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Questions about a league, help on a league night, or want Next-Up at
            your club? Send us a message, email or call and we will get back to you.
          </p>
          <p className="mt-3 text-sm text-white/60">
            {LEGAL_NAME}, Johannesburg, South Africa
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="default">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <Card>
              <h2 className="mb-6 font-display text-2xl font-bold text-gray-900 dark:text-white">
                Send us a message
              </h2>
              <ContactForm />
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-4">
                <IconTile icon={Trash2} tone="red" />
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Account deletion
                </h2>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                To permanently delete your Next-Up account, email{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20Next-Up%20account`}
                  className="text-green-600 underline-offset-2 hover:underline dark:text-green-400"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                from the address on your account.
              </p>
              <div className="mt-4 rounded-xl bg-blue-50/70 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>What remains after deletion:</strong> we store no
                  personal information about you once your account is deleted.
                  Matches you played stay in league records under an
                  &ldquo;unknown&rdquo; player name.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <Card>
              <h2 className="mb-6 font-display text-2xl font-bold text-gray-900 dark:text-white">
                Contact details
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <IconTile icon={Mail} tone="blue" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all text-gray-600 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <IconTile icon={Phone} tone="emerald" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="text-gray-600 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <IconTile icon={MapPin} tone="purple" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-300">Johannesburg, South Africa</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-4">
                <IconTile icon={Clock} tone="orange" />
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Support hours
                </h2>
              </div>
              <dl className="space-y-2">
                {HOURS.map((row) => (
                  <div key={row.day} className="flex justify-between gap-4">
                    <dt className="text-gray-600 dark:text-gray-300">{row.day}</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{row.time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl bg-green-50/70 p-4 dark:bg-green-900/20">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>League night support:</strong> include your league name
                  and what is happening on court so we can help faster.
                </p>
              </div>
            </Card>

            <Panel tone="brand" className="p-8 text-center sm:p-8">
              <h2 className="font-display text-xl font-bold">Looking for a league?</h2>
              <p className="mt-2 mb-5 text-green-100">
                See the clubs Next-Up runs league nights at across Johannesburg.
              </p>
              <Button href="/#clubs" variant="on-brand">
                View leagues
              </Button>
            </Panel>
          </div>
        </div>
      </Section>
    </>
  )
}
