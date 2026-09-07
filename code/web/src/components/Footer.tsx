import Image from 'next/image'
import Link from 'next/link'
import { LEGAL_NAME } from '@/lib/site'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/for-clubs', label: 'For clubs' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
] as const

export function Footer() {
  return (
    <footer className="relative border-t border-white/20 bg-white/40 backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Next-Up"
              width={266}
              height={80}
              className="h-20 w-auto sm:h-24"
            />
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Revolutionizing pickleball leagues across South Africa
          </p>
          <nav
            className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
            aria-label="Footer"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 hover:text-green-600 dark:hover:text-green-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
