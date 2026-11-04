import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, Shield, Eye, Lock, Users, Database, Bell, Globe } from 'lucide-react';

const CONTACT_EMAIL = 'luke.renton@next-up.co.za';
const LEGAL_EMAIL = 'legal@next-up.co.za';
const LEGAL_NAME = 'Nextup Sport (Pty) Ltd';

const linkClass = 'text-green-600 dark:text-green-400 underline underline-offset-2';

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function MailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className={linkClass}>
      {email}
    </a>
  );
}

const sectionClass =
  'bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl';
const bodyClass = 'text-gray-600 dark:text-gray-300 text-sm leading-relaxed';
const headingRow = 'flex items-center mb-6';

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
];

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Your Privacy Matters</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: 4 November 2026
          </p>
        </div>

        <div className={`${sectionClass} mb-8`}>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Who we are</h3>
          </div>
          <div className={`space-y-4 ${bodyClass}`}>
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
              Privacy requests can be sent to <MailLink email={CONTACT_EMAIL} />.
              Legal questions can be sent to <MailLink email={LEGAL_EMAIL} />.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`${sectionClass} text-center`}>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">What we collect</h4>
            <p className={bodyClass}>
              Account details, league activity, club billing contacts, and website visits measured by Google Analytics.
            </p>
          </div>
          <div className={`${sectionClass} text-center`}>
            <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl w-fit mx-auto mb-4">
              <Globe className="h-6 w-6 text-slate-700 dark:text-slate-200" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Where it is stored</h4>
            <p className={bodyClass}>
              League and account records are stored with Supabase in Frankfurt. Supabase does not keep every related process inside that region.
            </p>
          </div>
          <div className={`${sectionClass} text-center`}>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your choices</h4>
            <p className={bodyClass}>
              Email us for a copy or for deletion. You can edit your bio, location text and skill level where the account screen is available.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Information you give us</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account</h4>
                <p className={bodyClass}>
                  When an account is created, we receive an email address, a password, a first name, a last name and a skill level (Beginner, Intermediate or Advanced). The username is made from the name. Sign-in uses the email address and password. Supabase Auth holds the password credential. The password is not written into the player profile. Account and password-reset emails are sent through Supabase Auth. This application does not configure a separate email provider for those messages.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Profile</h4>
                <p className={bodyClass}>
                  Where the account screen is available, you can add a short bio, a location written as text, and a skill level. That location is the text you type. We do not read your device&apos;s GPS position.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Website contact form</h4>
                <p className={bodyClass}>
                  The contact form on www.next-up.co.za asks for your name, email address, topic and message. We send that content through Resend to our inbox. The website does not write the message into the league database. The contact form on this older web app does not send or store the message.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Club billing contacts</h4>
                <p className={bodyClass}>
                  If you are the contact for a club we bill, we store the club&apos;s legal name, a contact name, a billing email, a postal address and an agreement reference. Invoice lines record attendance counts. They do not list player names.
                </p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Information the service creates</h3>
            </div>
            <div className={`space-y-4 ${bodyClass}`}>
              <p>Using the league service creates:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>League membership and role</li>
                <li>Check-in time and whether a check-in is marked paid</li>
                <li>Partnership requests and confirmed partnerships</li>
                <li>Match scores, court assignment and the status of a score</li>
                <li>Statistics for a player in a league: games played, won and lost, points and average</li>
                <li>A voucher code linked to your account, when a league uses vouchers</li>
              </ul>
              <p>
                When match notifications are turned on, we store a web push subscription: the push address, its keys, the browser user agent, the platform and the language. A notification can include a court number, another player&apos;s name and a score. The browser&apos;s push service receives that notification so it can be delivered. You can turn notifications off in the browser, or email us and ask us to remove the subscription. This website does not offer a notification preference centre.
              </p>
              <p>
                While the service is running, it can write a technical log that includes an account identifier or a match identifier. We use those logs to operate the service and investigate faults.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-3">
                <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Information someone else can enter</h3>
            </div>
            <div className={`space-y-4 ${bodyClass}`}>
              <p>
                A league admin or organiser can create an account for a player. They enter the player&apos;s first name, last name and skill level. The service creates an email address ending in @next-up.local and a password, and shows that password to the organiser. The player does not have to sign up themselves.
              </p>
              <p>
                An admin or organiser can also check a player in or out, mark a check-in as paid, create or remove a partnership, and override or cancel a score.
              </p>
              <p>
                Other people in the league can see a player&apos;s name, skill level and match results. League member and leaderboard responses also include the email address, so that address can be received by another person using the service.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg mr-3">
                <Eye className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">What this service does not collect</h3>
            </div>
            <div className={`space-y-4 ${bodyClass}`}>
              <p>The current service does not collect:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>A phone number</li>
                <li>A date of birth or age</li>
                <li>Photographs, videos or other files</li>
                <li>A GPS position at check-in</li>
                <li>Payment card numbers</li>
              </ul>
              <p>
                We do not use Supabase Storage. We do not run a crash-reporting or session-replay tool, an advertising kit, or a tracking pixel in this application. There is no automatic download of your information and no button in the service that deletes an account by itself.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">How we use your information</h3>
            </div>
            <ul className={`list-disc space-y-2 pl-5 ${bodyClass}`}>
              {USES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Who receives information</h3>
            </div>
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
              <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                We do not sell personal information.
              </p>
            </div>
            <ul className={`list-disc space-y-2 pl-5 ${bodyClass}`}>
              <li>People in your league, and league admins and organisers, as described above.</li>
              <li>
                Supabase, which provides the database, authentication and project hosting for the service. Supabase publishes its{' '}
                <ExternalLink href="https://supabase.com/legal/customer-resources/subprocessor-list">
                  subprocessor list
                </ExternalLink>
                . Providers on that list include Amazon Web Services and other companies in the United States, Singapore and elsewhere. The list covers Supabase&apos;s own operations. It does not mean that every provider on it handles player profiles.
              </li>
              <li>Resend, which delivers the website contact form to our inbox.</li>
              <li>
                Google, through Google Analytics on www.next-up.co.za and on this older web app. Google describes its handling of that information in the{' '}
                <ExternalLink href="https://policies.google.com/privacy">Google privacy policy</ExternalLink>.
              </li>
              <li>
                The browser push service that delivers a match notification, when notifications are turned on. That content can include a player&apos;s name and a score.
              </li>
              <li>
                A person or authority where the law requires us to disclose information, or where we need to do so to protect someone&apos;s safety.
              </li>
            </ul>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cookies, analytics and device storage</h3>
            </div>
            <div className={`space-y-4 ${bodyClass}`}>
              <p>
                The website at www.next-up.co.za loads Google Analytics, measurement ID G-72E690CQ8R. Google Analytics uses cookies and receives technical information about the visit, including pages viewed, browser and device type, and IP address. The code on that website does not turn on IP anonymisation. There is no cookie consent banner.
              </p>
              <p>
                This older web app loads the same Google Analytics property and does set IP anonymisation. It also has no consent banner.
              </p>
              <p>
                A theme choice (light or dark) is stored in local storage on the device. Supabase Auth stores the sign-in session on the device. Those are not analytics cookies.
              </p>
              <p>
                The website at www.next-up.co.za reads the browser user agent in the page to choose which app-store badge to emphasise. That check stays in the browser. It is separate from Google Analytics and from the user agent stored with a push subscription.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg mr-3">
                <Globe className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Where information is stored</h3>
            </div>
            <div className={`space-y-4 ${bodyClass}`}>
              <p>
                {LEGAL_NAME} is in South Africa. League and account information is stored in our Supabase project in Frankfurt, Germany. We do not use Supabase Storage, so we do not store photographs or videos there, and we do not use Supabase&apos;s storage content-delivery cache.
              </p>
              <p>
                Supabase&apos;s published region description says that, for a project in Frankfurt, the primary database, the Auth service and backups stay in that region. Supabase also says it does not guarantee that data never leaves the selected region. Its support staff are in more than one country and may access a project when we ask for help or when Supabase responds to a security incident. Supabase says usage logs and telemetry are processed outside the region, and that those logs are stored in European Union data centres. Supabase&apos;s own account and billing information for us, as its customer, may be processed on its central systems. That is our account with Supabase, separate from a player profile.
              </p>
              <p>
                Supabase&apos;s data processing addendum, which forms part of its standard terms, says customer data is stored and primarily processed in the region the customer selects. It also says Supabase may process that data where Supabase or its subprocessors operate when that is needed to provide the service, follow instructions, or comply with law. Supabase says it takes daily backups by default and encrypts them in transit and at rest. How long a backup is kept depends on the Supabase plan.
              </p>
              <p>
                Supabase describes this in its{' '}
                <ExternalLink href="https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq">
                  data residency and transfers FAQ
                </ExternalLink>{' '}
                and its{' '}
                <ExternalLink href="https://supabase.com/legal/customer-resources/data-processing-addendum">
                  data processing addendum
                </ExternalLink>
                .
              </p>
              <p>
                For transfers regulated by European, UK or Swiss law, that addendum uses standard contractual clauses. Those clauses address those laws. They are not a decision under section 72 of the Protection of Personal Information Act (POPIA).
              </p>
              <p>
                South African law allows a transfer of personal information outside South Africa only when a condition in section 72 of POPIA is met. Hosting in Germany does not by itself meet that condition. We transfer league and account information to Supabase so that we can host and provide the service. This policy does not treat European data-protection law as a substitute for section 72.
              </p>
              <p>
                A website message is sent through Resend, and website analytics are sent to Google. Those services can process the information outside South Africa. A match notification is sent through the browser push service, which can also be outside South Africa.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security, retention and children</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h4>
                <p className={bodyClass}>
                  Supabase states that it encrypts stored customer data, including backups, and that connections use TLS. We rely on those measures for information stored in the project. Passwords are handled by Supabase Auth.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How long we keep information</h4>
                <p className={bodyClass}>
                  We keep personal information while we need it to run the league and to meet a legal duty to keep a record, for example a billing record. When you ask us to delete your account, we delete the information we are not required to keep. This policy does not state a fixed number of years.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Children</h4>
                <p className={bodyClass}>
                  We do not ask for a date of birth. A league admin or organiser can add a person&apos;s name and skill level. If you are a parent or guardian and a child&apos;s information has been added, email <MailLink email={CONTACT_EMAIL} /> and we will help you.
                </p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your rights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Access</h4>
                <p className={bodyClass}>
                  You can ask for a copy of the personal information we hold about you. Email <MailLink email={CONTACT_EMAIL} />. The service does not provide an automatic download.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Correction</h4>
                <p className={bodyClass}>
                  Where the account screen is available, you can change your bio, the location text and your skill level. Email us to correct your name, email address or other details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Deletion</h4>
                <p className={bodyClass}>
                  Email us to ask for deletion. You can also use the contact page. We delete what we are not required to keep. There is no delete button that completes this inside the service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Objection and complaints</h4>
                <p className={bodyClass}>
                  You can object to processing and you can lodge a complaint with the{' '}
                  <ExternalLink href="https://inforegulator.org.za/">Information Regulator of South Africa</ExternalLink>
                  . You can also email us first and we will respond.
                </p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headingRow}>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Changes to this policy</h3>
            </div>
            <p className={bodyClass}>
              We will update this policy when the service changes. We will not describe a future feature as something we already do. The date at the top of this page will change when we publish an update.
            </p>
          </section>
        </div>

        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
          <p className="text-green-100 mb-6">
            Email {CONTACT_EMAIL} and we will explain how your information is handled.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              View Terms
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
