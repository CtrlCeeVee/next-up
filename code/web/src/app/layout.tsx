import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
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
  themeColor: '#10b981',
}

// Runs during HTML parsing, before first paint: applies the saved theme (same
// localStorage key as the old site) and stamps the platform for the store
// badges. Wrapped in try/catch for browsers that block storage.
const bootScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}var u=navigator.userAgent||"";var p=(/iPad|iPhone|iPod/.test(u)||(/Macintosh/.test(u)&&"ontouchend" in document))?"ios":(/Android/i.test(u)?"android":"desktop");document.documentElement.setAttribute("data-platform",p)}catch(e){}})()`

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
    <html lang="en-ZA" className={inter.variable} suppressHydrationWarning>
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
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-10 left-10 h-72 w-72 animate-float rounded-full bg-green-300/10 blur-3xl dark:bg-green-500/5" />
          <div
            className="absolute top-32 right-10 h-96 w-96 animate-float rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-500/5"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-10 left-1/3 h-80 w-80 animate-float rounded-full bg-teal-300/10 blur-3xl dark:bg-teal-500/5"
            style={{ animationDelay: '4s' }}
          />
        </div>

        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  )
}
