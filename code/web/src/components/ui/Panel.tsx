import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type PanelTone = 'brand' | 'navy'

const TONES: Record<PanelTone, string> = {
  // Deep brand green, only where the action is a conversion (download the
  // app, contact us about a league). One surface in both colour modes, like
  // the navy. Soft closers ("questions?", cross-links) use a plain Card.
  brand: 'bg-brand-deep text-white shadow-card ring-1 ring-white/10',
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
