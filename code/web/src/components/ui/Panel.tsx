import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type PanelTone = 'brand' | 'navy'

const TONES: Record<PanelTone, string> = {
  // The green gradient CTA block the site already used.
  brand:
    'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-card dark:from-green-500 dark:to-emerald-500',
  navy: 'bg-court-950 text-white shadow-card ring-1 ring-white/10',
}

export function panelClasses(tone: PanelTone = 'brand', className?: string): string {
  return cn('rounded-3xl p-8 sm:p-10', TONES[tone], className)
}

export function Panel({
  tone = 'brand',
  className,
  children,
}: {
  tone?: PanelTone
  className?: string
  children: ReactNode
}) {
  return <div className={panelClasses(tone, className)}>{children}</div>
}
