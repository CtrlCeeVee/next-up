import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  title: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  as?: 'h1' | 'h2'
  align?: 'center' | 'left'
  tone?: 'default' | 'on-dark'
  id?: string
  className?: string
}

const TITLE = {
  h1: 'font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl',
  h2: 'font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl',
} as const

export function SectionHeading({
  title,
  eyebrow,
  lede,
  as = 'h2',
  align = 'center',
  tone = 'default',
  id,
  className,
}: Props) {
  const Tag = as
  const onDark = tone === 'on-dark'
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && <div className="mb-5">{eyebrow}</div>}
      <Tag id={id} className={cn(TITLE[as], onDark ? 'text-white' : 'text-gray-900 dark:text-white')}>
        {title}
      </Tag>
      {lede && (
        <div
          className={cn(
            'mt-4 max-w-3xl text-lg leading-relaxed sm:text-xl',
            align === 'center' && 'mx-auto',
            onDark ? 'text-white/80' : 'text-gray-600 dark:text-gray-300',
          )}
        >
          {lede}
        </div>
      )}
    </div>
  )
}
