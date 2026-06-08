// code/client/src/components/AppDownload.tsx
import { Link } from 'react-router-dom'
import { Apple, Smartphone } from 'lucide-react'
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  getPlatform,
  trackDownloadClick,
} from '../utils/appPromo'

function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackDownloadClick('app_store')}
      className="flex items-center justify-center gap-3 bg-black text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg w-full min-[375px]:w-auto"
    >
      <Apple className="h-7 w-7 flex-shrink-0" />
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">
          Download on the
        </span>
        <span className="block text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  )
}

function PlayStoreBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackDownloadClick('play_store')}
      className="flex items-center justify-center gap-3 bg-black text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg w-full min-[375px]:w-auto"
    >
      {/* Google Play triangle */}
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 flex-shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 2.5v19a1 1 0 0 0 1.5.87l16-9.5a1 1 0 0 0 0-1.74l-16-9.5A1 1 0 0 0 3 2.5z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">
          Get it on
        </span>
        <span className="block text-lg font-semibold -mt-0.5">Google Play</span>
      </span>
    </a>
  )
}

interface StoreButtonsProps {
  className?: string
}

// Platform-aware store badges. iOS shows App Store, Android shows Google Play,
// desktop shows both so the user can grab whichever device they have.
export function StoreButtons({ className = '' }: StoreButtonsProps) {
  const platform = getPlatform()
  const showApple = platform === 'ios' || platform === 'desktop'
  const showPlay = platform === 'android' || platform === 'desktop'

  return (
    <div
      className={`flex flex-col min-[375px]:flex-row gap-3 justify-center items-stretch min-[375px]:items-center ${className}`}
    >
      {showApple && <AppStoreBadge />}
      {showPlay && <PlayStoreBadge />}
    </div>
  )
}

// Full-screen "download the app" page. Used as the route target for every
// interactive path (login, leagues, profile, leaderboard) now that all
// functionality has moved to the native apps.
export function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 text-center">
            <img
              src="/logo.png"
              alt="Next-Up Logo"
              className="h-16 sm:h-20 w-auto mx-auto mb-6"
            />

            <div className="inline-flex items-center space-x-2 bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-5 backdrop-blur-sm">
              <Smartphone className="h-4 w-4" />
              <span>Now on iOS &amp; Android</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                Next-Up has moved to the app
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Checking in, finding partners, live matches, scores and
              leaderboards all happen in the Next-Up app now. Download it free to
              keep playing.
            </p>

            <StoreButtons />

            <div className="mt-8">
              <Link
                to="/"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              >
                &larr; Back to Next-Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
