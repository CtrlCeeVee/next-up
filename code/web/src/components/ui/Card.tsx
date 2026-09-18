import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type CardTone = 'default' | 'navy'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

const TONES: Record<CardTone, string> = {
  // Translucent white over the page gradient. No backdrop-blur on purpose:
  // over a smooth gradient it is invisible and it was the main scroll cost.
  default:
    'border-white/60 bg-white/75 text-gray-900 dark:border-slate-700/60 dark:bg-slate-800/75 dark:text-white',
  navy: 'border-white/10 bg-court-900 text-white',
}

const PADDING: Record<CardPadding, string> = {
  none: '',
  sm: 'p-5',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-10',
}

export function cardClasses({
  tone = 'default',
  padding = 'md',
  interactive = false,
  className,
}: {
  tone?: CardTone
  padding?: CardPadding
  interactive?: boolean
  className?: string
} = {}): string {
  return cn(
    'rounded-3xl border shadow-card',
    TONES[tone],
    PADDING[padding],
    interactive &&
      'transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0',
    className,
  )
}

type Props = {
  tone?: CardTone
  padding?: CardPadding
  interactive?: boolean
  as?: 'div' | 'li' | 'article' | 'section'
  id?: string
  className?: string
  children: ReactNode
}

export function Card({ as = 'div', id, children, ...opts }: Props) {
  const Tag = as
  return (
    <Tag id={id} className={cardClasses(opts)}>
      {children}
    </Tag>
  )
}
