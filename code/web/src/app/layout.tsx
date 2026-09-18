import type { Metadata, Viewport } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeaderScrollSentinel } from '@/components/ui/HeaderScrollSentinel'
import {
  APP_STORE_ID,
  APP_STORE_URL,
  CONTACT_EMAIL,
  GA_MEASUREMENT_ID,
  LEGAL_NAME,
  ORGANIZATION_ID,
  PLAY_STORE_URL,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Display face for headings and stat numbers; body text stays in Inter.
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Next-Up | Competitive Pickleball Leagues in South Africa',
    template: '%s | Next-Up',
  },
  description:
    "Join dynamic pickleball leagues, track your progress and become part of South Africa's fastest-growing pickleball community with the free Next-Up app.",
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_ZA',
    images: [{ url: '/og-image.png', width: 2094, height: 630, alt: 'Next-Up' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  itunes: {
    appId: APP_STORE_ID,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the navy header so the browser chrome blends into it.
  themeColor: '#0b1220',
}

// Runs during HTML parsing, before first paint: applies the saved theme (same
// localStorage key as the old site) and stamps the platform for the store
// badges. Wrapped in try/catch for browsers that block storage. (The html.js
// flag for reveal-on-scroll is set by Reveal after hydration on purpose, so
// the first paint is never delayed.)
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){d.classList.add("dark")}var u=navigator.userAgent||"";var p=(/iPad|iPhone|iPod/.test(u)||(/Macintosh/.test(u)&&"ontouchend" in document))?"ios":(/Android/i.test(u)?"android":"desktop");d.setAttribute("data-platform",p)}catch(e){}})()`

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  alternateName: 'NextUp Sport',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: CONTACT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressRegion: 'Gauteng',
    addressCountry: 'ZA',
  },
  sameAs: [APP_STORE_URL, PLAY_STORE_URL],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en-ZA"
      className={`${inter.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 text-gray-900 antialiased transition-colors duration-500 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 dark:text-white">
        {/* Static glow; see .page-glow in globals.css. */}
        <div className="page-glow pointer-events-none fixed inset-0" aria-hidden="true" />

        <div className="relative flex min-h-screen flex-col">
          <HeaderScrollSentinel />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  )
}
