import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type EyebrowTone = 'brand' | 'blue' | 'on-dark'

const TONES: Record<EyebrowTone, string> = {
  brand: 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  blue: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'on-dark': 'bg-white/10 text-white ring-1 ring-white/15',
}

// Small pill above a heading. On navy the icon takes the pickleball yellow
// so the eyebrow reads as a label rather than a button.
export function Eyebrow({
  icon: Icon,
  tone = 'brand',
  className,
  children,
}: {
  icon?: LucideIcon
  tone?: EyebrowTone
  className?: string
  children: ReactNode
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
        TONES[tone],
        className,
      )}
    >
      {Icon ? (
        <Icon className={cn('h-4 w-4', tone === 'on-dark' && 'text-ball')} aria-hidden="true" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-ball" aria-hidden="true" />
      )}
      <span>{children}</span>
    </p>
  )
}
