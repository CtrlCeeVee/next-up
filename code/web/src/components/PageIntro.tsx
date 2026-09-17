import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Eyebrow } from './ui/Eyebrow'

const ALIGN = {
  center: 'text-center',
  left: 'text-left',
  // Centred on small screens, left-aligned beside an image from lg up.
  responsive: 'text-center lg:text-left',
} as const

type Props = {
  icon: LucideIcon
  badge: string
  title: ReactNode
  /** Lede and any extra lines; style them for the navy band (text-white/80). */
  children?: ReactNode
  align?: keyof typeof ALIGN
  className?: string
}

// Page header for inner pages. Rendered inside <Section tone="navy">, so the
// eyebrow, title and lede are always on the navy band.
export function PageIntro({ icon, badge, title, children, align = 'center', className }: Props) {
  return (
    <div className={cn('animate-rise', ALIGN[align], className)}>
      <Eyebrow icon={icon} tone="on-dark">
        {badge}
      </Eyebrow>
      <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
        {title}
      </h1>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
