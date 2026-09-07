'use client'

import { Apple } from 'lucide-react'
import { sendGAEvent } from '@next/third-parties/google'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/site'

const badgeClass =
  'flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3 whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 active:scale-95 sm:w-auto'

function track(store: 'app_store' | 'play_store') {
  sendGAEvent('event', 'app_download_click', { store })
}

export function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-store="apple"
      onClick={() => track('app_store')}
      className={badgeClass}
    >
      <Apple className="h-7 w-7 flex-shrink-0" aria-hidden="true" />
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">
          Download on the
        </span>
        <span className="-mt-0.5 block text-lg font-semibold">App Store</span>
      </span>
    </a>
  )
}

export function PlayStoreBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-store="play"
      onClick={() => track('play_store')}
      className={badgeClass}
    >
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
        <span className="-mt-0.5 block text-lg font-semibold">Google Play</span>
      </span>
    </a>
  )
}

// Both badges are always in the HTML. globals.css hides the irrelevant one
// based on the data-platform attribute set before first paint, so iOS sees
// only the App Store, Android only Google Play, and desktop sees both.
export function StoreButtons({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 sm:flex-row ${className}`}
    >
      <AppStoreBadge />
      <PlayStoreBadge />
    </div>
  )
}
