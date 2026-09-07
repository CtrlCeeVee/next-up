'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Smartphone, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/nav'

// Hamburger menu shown below the sm breakpoint. The panel is absolutely
// positioned under the header, so it overlays the page instead of pushing it
// down. Closes on link click, Escape, and route change.
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  // Close when the route changes (browser back/forward). Adjusting state
  // during render is React's recommended pattern for "reset on prop change".
  const [seenPath, setSeenPath] = useState(pathname)
  if (pathname !== seenPath) {
    setSeenPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="rounded-full bg-gray-100/80 p-2 transition-colors hover:bg-gray-200 dark:bg-slate-800/80 dark:hover:bg-slate-700"
      >
        {open ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        // Solid background on purpose: a translucent panel with its own
        // backdrop-filter inside the blurred header composites underneath
        // the page content in Chromium.
        className="absolute inset-x-0 top-full z-50 border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <nav className="mx-auto max-w-7xl px-4 py-3" aria-label="Mobile">
          <ul className="divide-y divide-gray-200/60 dark:divide-slate-700/60">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="block py-3 text-base font-medium text-gray-700 transition-colors hover:text-green-600 aria-[current=page]:text-green-600 dark:text-gray-200 dark:hover:text-green-400 dark:aria-[current=page]:text-green-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#download"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg transition-colors hover:from-green-700 hover:to-emerald-700"
          >
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Get the App
          </Link>
        </nav>
      </div>
    </div>
  )
}
