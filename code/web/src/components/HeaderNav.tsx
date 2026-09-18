'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/nav'
import { cn } from '@/lib/cn'

// Desktop navigation. Client-side only for the active underline; the links
// themselves are plain <a href> in the static HTML.
export function HeaderNav() {
  const pathname = usePathname()
  return (
    <>
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'hidden rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:block',
              active
                ? 'text-white shadow-[inset_0_-2px_0_0_var(--color-emerald-400)]'
                : 'text-white/70 hover:bg-white/5 hover:text-white',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
