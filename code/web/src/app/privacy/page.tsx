import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Bell, Database, Eye, Globe, Lock, Shield, Users } from 'lucide-react'
import { PageIntro } from '@/components/PageIntro'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconTile, type IconTone } from '@/components/ui/IconTile'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { CONTACT_EMAIL, LEGAL_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Nextup Sport (Pty) Ltd handles personal information on the Next-Up website and league service, including Supabase hosting in Frankfurt.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy', title: 'Privacy Policy | Next-Up' },
}

const LAST_UPDATED = '2026-11-04'
const LEGAL_EMAIL = 'legal@next-up.co.za'

const SUMMARY: { icon: typeof Eye; tone: IconTone; title: string; text: string }[] = [
  {
    icon: Eye,
    tone: 'blue',
    title: 'What we collect',
    text: 'Account details, league activity, club billing contacts, and website visits measured by Google Analytics.',
  },
  {
    icon: Globe,
    tone: 'navy',
    title: 'Where it is stored',
    text: 'League and account records are stored with Supabase in Frankfurt. Supabase does not keep every related process inside that region.',
  },
  {
    icon: Users,
    tone: 'emerald',
    title: 'Your choices',
    text: 'Email us for a copy or for deletion. You can edit your bio, location text and skill level where the account screen is available.',
  },
]

const USES = [
  'Create your account and let you sign in with your email and password',
  'Run league nights, including check-in, partnerships, court assignment and scores',
  'Show names, skill levels, results and statistics to people in the league',
  'Send a match notification when that feature is turned on',
  'Send account and password-reset email through Supabase Auth',
  'Deliver a message you send from the website contact form',
  'Bill a club that uses the service, using the club contact details we hold',
  'Measure visits to this website with Google Analytics',
  'Operate the service and investigate faults, using technical logs that can include an account or match identifier',
]

function CardHeading({
  icon,
  tone,
  children,
}: {
  icon: typeof Eye
  tone: IconTone
  children: ReactNode
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <IconTile icon={icon} tone={tone} size="sm" />
      <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">{children}</h2>
    </div>
  )
}

function TextLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      className="text-green-600 underline-offset-2 hover:underline dark:text-green-400"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

const prose = 'text-sm leading-relaxed text-gray-600 dark:text-gray-300'
const subhead = 'mb-2 font-semibold text-gray-900 dark:text-white'

export default function PrivacyPage() {
  return (
    <>
      <Section tone="navy" size="sm" width="narrow">
        <PageIntro icon={Shield} badge="Your privacy matters" title="Privacy Policy">
          <p className="text-lg text-white/80">
            Last updated: <time dateTime={LAST_UPDATED}>4 November 2026</time>
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="narrow">
        <Card className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <IconTile icon={Shield} tone="emerald" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Who we are
            </h2>
          </div>
          <div className={`space-y-4 ${prose}`}>
            <p>
              {LEGAL_NAME} operates Next-Up. We are a company in South Africa. The
              website and the league service are intended for people in South Africa
              and in other countries.
            </p>
            <p>
              This policy describes the Next-Up website and the personal information
              the Next-Up service processes. If you use a Next-Up application that
              connects to this service, the account and league sections below describe
              that processing. We will update this policy when the service changes,
              and we will change the date at the top of this page.
            </p>
            <p>
              Privacy requests can be sent to{' '}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
              Legal questions can be sent to{' '}
              <TextLink href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</TextLink>.
            </p>
          </div>
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
                Information you give us
              </CardHeading>
              <dl className="space-y-4">
                <div>
                  <dt className={subhead}>Account</dt>
                  <dd className={prose}>
                    When an account is created, we receive an email address, a
                    password, a first name, a last name and a skill level (Beginner,
                    Intermediate or Advanced). The username is made from the name.
                    Sign-in uses the email address and password. Supabase Auth holds
                    the password credential. The password is not written into the
                    player profile. Account and password-reset emails are sent through
                    Supabase Auth. This application does not configure a separate
                    email provider for those messages.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Profile</dt>
                  <dd className={prose}>
                    Where the account screen is available, you can add a short bio, a
                    location written as text, and a skill level. That location is the
                    text you type. We do not read your device&apos;s GPS position.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Website contact form</dt>
                  <dd className={prose}>
                    The contact form on this website asks for your name, email
                    address, topic and message. We send that content through Resend
                    to our inbox. The website does not write the message into the
                    league database. The contact form on the older web app does not
                    send or store the message.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Club billing contacts</dt>
                  <dd className={prose}>
                    If you are the contact for a club we bill, we store the
                    club&apos;s legal name, a contact name, a billing email, a postal
                    address and an agreement reference. Invoice lines record
                    attendance counts. They do not list player names.
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Users} tone="emerald">
                Information the service creates
              </CardHeading>
              <div className={`space-y-4 ${prose}`}>
                <p>Using the league service creates:</p>
                <ul className="list-disc space-y-2 pl-5 marker:text-green-600 dark:marker:text-green-400">
                  <li>League membership and role</li>
                  <li>Check-in time and whether a check-in is marked paid</li>
                  <li>Partnership requests and confirmed partnerships</li>
                  <li>Match scores, court assignment and the status of a score</li>
                  <li>
                    Statistics for a player in a league: games played, won and lost,
                    points and average
                  </li>
                  <li>A voucher code linked to your account, when a league uses vouchers</li>
                </ul>
                <p>
                  When match notifications are turned on, we store a web push
                  subscription: the push address, its keys, the browser user agent,
                  the platform and the language. A notification can include a court
                  number, another player&apos;s name and a score. The browser&apos;s
                  push service receives that notification so it can be delivered.
                  You can turn notifications off in the browser, or email us and ask
                  us to remove the subscription. This website does not offer a
                  notification preference centre.
                </p>
                <p>
                  While the service is running, it can write a technical log that
                  includes an account identifier or a match identifier. We use those
                  logs to operate the service and investigate faults.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Users} tone="yellow">
                Information someone else can enter
              </CardHeading>
              <div className={`space-y-4 ${prose}`}>
                <p>
                  A league admin or organiser can create an account for a player.
                  They enter the player&apos;s first name, last name and skill level.
                  The service creates an email address ending in @next-up.local and a
                  password, and shows that password to the organiser. The player does
                  not have to sign up themselves.
                </p>
                <p>
                  An admin or organiser can also check a player in or out, mark a
                  check-in as paid, create or remove a partnership, and override or
                  cancel a score.
                </p>
                <p>
                  Other people in the league can see a player&apos;s name, skill level
                  and match results. League member and leaderboard responses also
                  include the email address, so that address can be received by
                  another person using the service.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Eye} tone="navy">
                What this service does not collect
              </CardHeading>
              <div className={`space-y-4 ${prose}`}>
                <p>The current service does not collect:</p>
                <ul className="list-disc space-y-2 pl-5 marker:text-blue-600 dark:marker:text-blue-400">
                  <li>A phone number</li>
                  <li>A date of birth or age</li>
                  <li>Photographs, videos or other files</li>
                  <li>A GPS position at check-in</li>
                  <li>Payment card numbers</li>
                </ul>
                <p>
                  We do not use Supabase Storage. We do not run a crash-reporting or
                  session-replay tool, an advertising kit, or a tracking pixel in this
                  application. There is no automatic download of your information and
                  no button in the service that deletes an account by itself.
                </p>
              </div>
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
                Who receives information
              </CardHeading>
              <div className="mb-4 rounded-xl bg-green-50/70 p-4 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  We do not sell personal information.
                </p>
              </div>
              <ul className={`list-disc space-y-2 pl-5 marker:text-blue-600 dark:marker:text-blue-400 ${prose}`}>
                <li>
                  People in your league, and league admins and organisers, as
                  described above.
                </li>
                <li>
                  Supabase, which provides the database, authentication and project
                  hosting for the service. Supabase publishes its{' '}
                  <TextLink
                    href="https://supabase.com/legal/customer-resources/subprocessor-list"
                    external
                  >
                    subprocessor list
                  </TextLink>
                  . Providers on that list include Amazon Web Services and other
                  companies in the United States, Singapore and elsewhere. The list
                  covers Supabase&apos;s own operations. It does not mean that every
                  provider on it handles player profiles.
                </li>
                <li>
                  Resend, which delivers the website contact form to our inbox.
                </li>
                <li>
                  Google, through Google Analytics on this website and on the older
                  web app. Google describes its handling of that information in the{' '}
                  <TextLink href="https://policies.google.com/privacy" external>
                    Google privacy policy
                  </TextLink>
                  .
                </li>
                <li>
                  The browser push service that delivers a match notification, when
                  notifications are turned on. That content can include a
                  player&apos;s name and a score.
                </li>
                <li>
                  A person or authority where the law requires us to disclose
                  information, or where we need to do so to protect someone&apos;s
                  safety.
                </li>
              </ul>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Eye} tone="blue">
                Cookies, analytics and device storage
              </CardHeading>
              <div className={`space-y-4 ${prose}`}>
                <p>
                  This website loads Google Analytics, measurement ID G-72E690CQ8R.
                  Google Analytics uses cookies and receives technical information
                  about the visit, including pages viewed, browser and device type,
                  and IP address. The code on this website does not turn on IP
                  anonymisation. There is no cookie consent banner.
                </p>
                <p>
                  The older web app loads the same Google Analytics property and does
                  set IP anonymisation. It also has no consent banner.
                </p>
                <p>
                  A theme choice (light or dark) is stored in local storage on the
                  device. Supabase Auth stores the sign-in session on the device.
                  Those are not analytics cookies.
                </p>
                <p>
                  This website reads the browser user agent in the page to choose
                  which app-store badge to emphasise. That check stays in the
                  browser. It is separate from Google Analytics and from the user
                  agent stored with a push subscription.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Globe} tone="navy">
                Where information is stored
              </CardHeading>
              <div className={`space-y-4 ${prose}`}>
                <p>
                  {LEGAL_NAME} is in South Africa. League and account information is
                  stored in our Supabase project in Frankfurt, Germany. We do not use
                  Supabase Storage, so we do not store photographs or videos there,
                  and we do not use Supabase&apos;s storage content-delivery cache.
                </p>
                <p>
                  Supabase&apos;s published region description says that, for a
                  project in Frankfurt, the primary database, the Auth service and
                  backups stay in that region. Supabase also says it does not
                  guarantee that data never leaves the selected region. Its support
                  staff are in more than one country and may access a project when
                  we ask for help or when Supabase responds to a security incident.
                  Supabase says usage logs and telemetry are processed outside the
                  region, and that those logs are stored in European Union data
                  centres. Supabase&apos;s own account and billing information for us,
                  as its customer, may be processed on its central systems. That is
                  our account with Supabase, separate from a player profile.
                </p>
                <p>
                  Supabase&apos;s data processing addendum, which forms part of its
                  standard terms, says customer data is stored and primarily
                  processed in the region the customer selects. It also says
                  Supabase may process that data where Supabase or its subprocessors
                  operate when that is needed to provide the service, follow
                  instructions, or comply with law. Supabase says it takes daily
                  backups by default and encrypts them in transit and at rest. How
                  long a backup is kept depends on the Supabase plan.
                </p>
                <p>
                  Supabase describes this in its{' '}
                  <TextLink
                    href="https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq"
                    external
                  >
                    data residency and transfers FAQ
                  </TextLink>{' '}
                  and its{' '}
                  <TextLink
                    href="https://supabase.com/legal/customer-resources/data-processing-addendum"
                    external
                  >
                    data processing addendum
                  </TextLink>
                  .
                </p>
                <p>
                  For transfers regulated by European, UK or Swiss law, that
                  addendum uses standard contractual clauses. Those clauses address
                  those laws. They are not a decision under section 72 of the
                  Protection of Personal Information Act (POPIA).
                </p>
                <p>
                  South African law allows a transfer of personal information
                  outside South Africa only when a condition in section 72 of POPIA
                  is met. Hosting in Germany does not by itself meet that condition.
                  We transfer league and account information to Supabase so that we
                  can host and provide the service. This policy does not treat
                  European data-protection law as a substitute for section 72.
                </p>
                <p>
                  A website message is sent through Resend, and website analytics
                  are sent to Google. Those services can process the information
                  outside South Africa. A match notification is sent through the
                  browser push service, which can also be outside South Africa.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Lock} tone="blue">
                Security, retention and children
              </CardHeading>
              <dl className="space-y-4">
                <div>
                  <dt className={subhead}>Security</dt>
                  <dd className={prose}>
                    Supabase states that it encrypts stored customer data, including
                    backups, and that connections use TLS. We rely on those measures
                    for information stored in the project. Passwords are handled by
                    Supabase Auth.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>How long we keep information</dt>
                  <dd className={prose}>
                    We keep personal information while we need it to run the league
                    and to meet a legal duty to keep a record, for example a billing
                    record. When you ask us to delete your account, we delete the
                    information we are not required to keep. This policy does not
                    state a fixed number of years.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Children</dt>
                  <dd className={prose}>
                    We do not ask for a date of birth. A league admin or organiser
                    can add a person&apos;s name and skill level. If you are a parent
                    or guardian and a child&apos;s information has been added, email{' '}
                    <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>{' '}
                    and we will help you.
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Bell} tone="yellow">
                Your rights
              </CardHeading>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <dt className={subhead}>Access</dt>
                  <dd className={prose}>
                    You can ask for a copy of the personal information we hold about
                    you. Email{' '}
                    <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
                    The service does not provide an automatic download.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Correction</dt>
                  <dd className={prose}>
                    Where the account screen is available, you can change your bio,
                    the location text and your skill level. Email us to correct your
                    name, email address or other details.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Deletion</dt>
                  <dd className={prose}>
                    Email us to ask for deletion. You can also use the contact page.
                    We delete what we are not required to keep. There is no delete
                    button that completes this inside the service.
                  </dd>
                </div>
                <div>
                  <dt className={subhead}>Objection and complaints</dt>
                  <dd className={prose}>
                    You can object to processing and you can lodge a complaint with
                    the{' '}
                    <TextLink href="https://inforegulator.org.za/" external>
                      Information Regulator of South Africa
                    </TextLink>
                    . You can also email us first and we will respond.
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeading icon={Shield} tone="emerald">
                Changes to this policy
              </CardHeading>
              <p className={prose}>
                We will update this policy when the service changes. We will not
                describe a future feature as something we already do. The date at
                the top of this page will change when we publish an update.
              </p>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <Card padding="lg" className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Questions about privacy?
            </h2>
            <p className="mt-3 mb-6 text-gray-600 dark:text-gray-300">
              Email {CONTACT_EMAIL} and we will explain how your information is handled.
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
