import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

// Tones carry meaning, so the same concept gets the same colour on every
// page. The four decorative tones are colours the site already uses: the
// action green, the logo blue, the ball yellow and the court navy.
export type IconTone = 'emerald' | 'blue' | 'yellow' | 'navy' | 'red' | 'on-dark'
export type IconSize = 'sm' | 'md' | 'lg'

const TONES: Record<IconTone, string> = {
  // Playing: check-in, scoring, fair play, ways to contact us.
  emerald: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  // The system doing the work: matching, court board, live updates, data.
  blue: 'bg-logo-blue/10 text-logo-blue dark:bg-logo-blue/20 dark:text-blue-300',
  // Results and notices: standings, stats, schedules, limitations.
  yellow: 'bg-ball/15 text-yellow-600 dark:bg-ball/15 dark:text-ball',
  // Organisers, clubs, venues and the rules.
  navy: 'bg-court-900 text-white dark:bg-court-800 dark:ring-1 dark:ring-white/10',
  // Warnings only: pain points, account deletion, prohibited use.
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  // Icons on navy surfaces.
  'on-dark': 'bg-white/10 text-white ring-1 ring-white/10',
}

const SIZES: Record<IconSize, { box: string; icon: string }> = {
  sm: { box: 'rounded-lg p-2', icon: 'h-5 w-5' },
  md: { box: 'rounded-xl p-3', icon: 'h-6 w-6' },
  lg: { box: 'rounded-2xl p-4', icon: 'h-8 w-8' },
}

// One tinted tile for every icon on the site, in three sizes.
export function IconTile({
  icon: Icon,
  tone = 'emerald',
  size = 'md',
  className,
}: {
  icon: LucideIcon
  tone?: IconTone
  size?: IconSize
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        TONES[tone],
        SIZES[size].box,
        className,
      )}
    >
      <Icon className={SIZES[size].icon} aria-hidden="true" />
    </div>
  )
}
