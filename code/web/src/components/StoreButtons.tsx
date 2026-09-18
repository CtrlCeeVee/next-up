'use client'

import { Apple } from 'lucide-react'
import { sendGAEvent } from '@next/third-parties/google'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/site'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'compact'

const BADGE: Record<Variant, string> = {
  default:
    'flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3 whitespace-nowrap text-white shadow-lg ring-1 ring-white/15 transition-[background-color,transform,box-shadow] duration-200 hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:w-auto',
  compact:
    'flex items-center justify-center gap-2.5 rounded-xl bg-black px-4 py-2 whitespace-nowrap text-white ring-1 ring-white/15 transition-[background-color,transform] duration-200 hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
}

const SUB: Record<Variant, string> = {
  default: 'block text-[10px] uppercase tracking-wide opacity-80',
  compact: 'block text-[9px] uppercase tracking-wide opacity-80',
}

const MAIN: Record<Variant, string> = {
  default: '-mt-0.5 block text-lg font-semibold',
  compact: '-mt-0.5 block text-sm font-semibold',
}

function track(store: 'app_store' | 'play_store') {
  sendGAEvent('event', 'app_download_click', { store })
}

export function AppStoreBadge({ variant = 'default' }: { variant?: Variant }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-store="apple"
      onClick={() => track('app_store')}
      className={BADGE[variant]}
    >
      <Apple
        className={variant === 'compact' ? 'h-5 w-5 shrink-0' : 'h-7 w-7 shrink-0'}
        aria-hidden="true"
      />
      <span className="text-left leading-tight">
        <span className={SUB[variant]}>Download on the</span>
        <span className={MAIN[variant]}>App Store</span>
      </span>
    </a>
  )
}

export function PlayStoreBadge({ variant = 'default' }: { variant?: Variant }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-store="play"
      onClick={() => track('play_store')}
      className={BADGE[variant]}
    >
      <svg
        viewBox="0 0 24 24"
        className={variant === 'compact' ? 'h-4 w-4 shrink-0' : 'h-6 w-6 shrink-0'}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 2.5v19a1 1 0 0 0 1.5.87l16-9.5a1 1 0 0 0 0-1.74l-16-9.5A1 1 0 0 0 3 2.5z" />
      </svg>
      <span className="text-left leading-tight">
        <span className={SUB[variant]}>Get it on</span>
        <span className={MAIN[variant]}>Google Play</span>
      </span>
    </a>
  )
}

// Both badges are always in the HTML. globals.css hides the irrelevant one
// based on the data-platform attribute set before first paint, so iOS sees
// only the App Store, Android only Google Play, and desktop sees both.
export function StoreButtons({
  variant = 'default',
  align = 'center',
  className,
}: {
  variant?: Variant
  align?: 'center' | 'start'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-3',
        variant === 'default' && 'flex-col items-center sm:flex-row',
        align === 'center' ? 'justify-center' : 'justify-center sm:justify-start',
        className,
      )}
    >
      <AppStoreBadge variant={variant} />
      <PlayStoreBadge variant={variant} />
    </div>
  )
}
