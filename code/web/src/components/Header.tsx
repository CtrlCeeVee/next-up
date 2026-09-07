import Image from 'next/image'
import Link from 'next/link'
import { Smartphone } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="relative border-b border-white/20 bg-white/80 shadow-lg backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex flex-shrink-0 items-center" aria-label="Next-Up home">
            <Image
              src="/logo.png"
              alt="Next-Up"
              width={266}
              height={80}
              priority
              className="h-10 w-auto xs:h-12 sm:h-16 md:h-20"
            />
          </Link>

          <nav className="flex flex-shrink-0 items-center gap-2 sm:gap-4" aria-label="Primary">
            <Link
              href="/leagues/johannesburg"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-green-600 sm:block dark:text-gray-300 dark:hover:text-green-400"
            >
              Leagues
            </Link>
            <Link
              href="/for-clubs"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-green-600 sm:block dark:text-gray-300 dark:hover:text-green-400"
            >
              For clubs
            </Link>
            <Link
              href="/about"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-green-600 sm:block dark:text-gray-300 dark:hover:text-green-400"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-green-600 sm:block dark:text-gray-300 dark:hover:text-green-400"
            >
              Contact
            </Link>
            <ThemeToggle />
            <Link
              href="/#download"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl xs:px-4 sm:px-6"
              aria-label="Get the app"
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xs:inline">Get the App</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
