import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// A number with its label, for use inside a <dl>. The label is first in the
// DOM (valid dt/dd order) and shown below the number.
export function Stat({
  value,
  label,
  tone = 'default',
  className,
}: {
  value: ReactNode
  label: ReactNode
  tone?: 'default' | 'on-dark'
  className?: string
}) {
  const onDark = tone === 'on-dark'
  return (
    <div className={cn('flex flex-col-reverse items-center text-center', className)}>
      <dt
        className={cn(
          'mt-1 text-xs sm:text-base',
          onDark ? 'text-white/70' : 'text-gray-600 dark:text-gray-300',
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          'font-display text-3xl font-bold tracking-tight sm:text-4xl',
          onDark ? 'text-white' : 'text-green-600 dark:text-green-400',
        )}
      >
        {value}
      </dd>
    </div>
  )
}
