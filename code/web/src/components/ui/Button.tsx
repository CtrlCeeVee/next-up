import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-dark' | 'on-brand'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold whitespace-nowrap transition-[background-color,box-shadow,transform,color] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-600/25 focus-visible:ring-emerald-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
  secondary:
    'bg-slate-100 text-gray-900 hover:bg-slate-200 focus-visible:ring-emerald-500 focus-visible:ring-offset-white dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-900',
  ghost:
    'text-green-700 hover:bg-green-50 focus-visible:ring-emerald-500 focus-visible:ring-offset-white dark:text-green-400 dark:hover:bg-green-900/20 dark:focus-visible:ring-offset-slate-900',
  // On navy surfaces (header, hero, navy panels).
  'on-dark':
    'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15 focus-visible:ring-white focus-visible:ring-offset-court-950',
  // White button on the deep green panel.
  'on-brand':
    'bg-white text-green-700 shadow-lg shadow-black/10 hover:bg-green-50 focus-visible:ring-white focus-visible:ring-offset-emerald-800',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-7 py-3.5 text-lg',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type LinkProps = Common & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >

type NativeProps = Common & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export type ButtonProps = LinkProps | NativeProps

const EXTERNAL = /^https?:\/\//
const PROTOCOL = /^(mailto:|tel:)/

// Renders next/link for internal paths (crawlers need real <a href>), a
// plain anchor for external or mailto/tel URLs, and a <button> otherwise.
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, variant, size, className, children, ...anchor } = props
    const classes = buttonClasses(variant, size, className)
    if (EXTERNAL.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchor}>
          {children}
        </a>
      )
    }
    if (PROTOCOL.test(href)) {
      return (
        <a href={href} className={classes} {...anchor}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    )
  }

  const { variant, size, className, children, ...button } = props
  return (
    <button type="button" className={buttonClasses(variant, size, className)} {...button}>
      {children}
    </button>
  )
}
