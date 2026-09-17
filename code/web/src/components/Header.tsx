import Image from 'next/image'
import Link from 'next/link'
import { Smartphone } from 'lucide-react'
import { HeaderNav } from './HeaderNav'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/Button'

// Sticky navy header, the same in both colour modes. z-40 keeps the open
// mobile menu above positioned page content; the shadow appears once the
// page is scrolled (HeaderScrollSentinel in the layout).
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-court-950/95 text-white backdrop-blur transition-shadow duration-300 scrolled:shadow-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Next-Up home"
        >
          {/* Declared close to the rendered size so next/image serves a small
              variant instead of the 2x of the source width. */}
          <Image
            src="/logo.png"
            alt="Next-Up"
            width={120}
            height={36}
            preload
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Primary">
          <HeaderNav />
          <ThemeToggle />
          <Button
            href="/#download"
            size="sm"
            className="ml-1 rounded-full px-3 sm:px-5"
            aria-label="Get the app"
          >
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            {/* Icon-only below sm so the hamburger fits at 320px; the menu carries the full label. */}
            <span className="hidden sm:inline">Get the App</span>
          </Button>
          <MobileMenu />
        </nav>
      </div>
    </header>
  )
}
