import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ContainerWidth = 'narrow' | 'default' | 'wide'

const WIDTHS: Record<ContainerWidth, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
}

export function containerClasses(width: ContainerWidth = 'default', className?: string): string {
  return cn('mx-auto w-full px-4 sm:px-6', WIDTHS[width], className)
}

export function Container({
  width = 'default',
  className,
  children,
}: {
  width?: ContainerWidth
  className?: string
  children: ReactNode
}) {
  return <div className={containerClasses(width, className)}>{children}</div>
}
