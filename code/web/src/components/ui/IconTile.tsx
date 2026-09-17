import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type IconTone =
  | 'emerald'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'yellow'
  | 'red'
  | 'on-dark'
export type IconSize = 'sm' | 'md' | 'lg'

const TONES: Record<IconTone, string> = {
  emerald: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'on-dark': 'bg-white/10 text-white ring-1 ring-white/10',
}

const SIZES: Record<IconSize, { box: string; icon: string }> = {
  sm: { box: 'rounded-lg p-2', icon: 'h-5 w-5' },
  md: { box: 'rounded-xl p-3', icon: 'h-6 w-6' },
  lg: { box: 'rounded-2xl p-4', icon: 'h-8 w-8' },
}

// One tinted tile for every icon on the site, in three sizes. Named tones
// keep the colour variety the pages already had without ad-hoc classes.
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
