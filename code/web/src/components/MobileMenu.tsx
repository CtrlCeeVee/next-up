'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Smartphone, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/nav'
import { Button } from './ui/Button'

// Hamburger menu shown below the sm breakpoint. The panel is absolutely
// positioned under the sticky header, so it overlays the page instead of
// pushing it down. Closes on link click, Escape, and route change.
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
        className="rounded-full p-2 text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        // Solid background on purpose: a translucent panel with its own
        // backdrop-filter inside the blurred header composites underneath
        // the page content in Chromium.
        className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-court-950 text-white shadow-header motion-safe:animate-menu-in"
      >
        <nav className="mx-auto max-w-7xl px-4 py-3" aria-label="Mobile">
          <ul className="divide-y divide-white/10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="block py-3 text-base font-medium text-white/80 transition-colors hover:text-white aria-[current=page]:text-emerald-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/#download" onClick={() => setOpen(false)} className="mt-3 w-full">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Get the App
          </Button>
        </nav>
      </div>
    </div>
  )
}
