import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { containerClasses, type ContainerWidth } from './Container'

export type SectionTone = 'default' | 'navy'
export type SectionSize = 'sm' | 'md' | 'lg'

const TONES: Record<SectionTone, string> = {
  // Transparent: sits on the page gradient.
  default: '',
  // Same navy in both colour modes; the chrome never flips.
  navy: 'bg-court-950 text-white',
}

const SIZES: Record<SectionSize, string> = {
  sm: 'py-10 sm:py-14',
  md: 'py-14 sm:py-20',
  lg: 'py-16 sm:py-24',
}

type Props = {
  tone?: SectionTone
  size?: SectionSize
  width?: ContainerWidth
  as?: 'section' | 'div'
  id?: string
  className?: string
  containerClassName?: string
  children: ReactNode
}

// Full-width band with vertical rhythm and a centred container. Pages are a
// stack of these, so spacing lives in one place.
export function Section({
  tone = 'default',
  size = 'md',
  width = 'default',
  as = 'section',
  id,
  className,
  containerClassName,
  children,
}: Props) {
  const Tag = as
  return (
    <Tag id={id} className={cn('relative', TONES[tone], SIZES[size], className)}>
      <div className={containerClasses(width, containerClassName)}>{children}</div>
    </Tag>
  )
}
