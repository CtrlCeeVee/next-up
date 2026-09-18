import Image from 'next/image'
import Link from 'next/link'
import { FOOTER_GROUPS } from '@/lib/nav'
import { LEGAL_NAME } from '@/lib/site'
import { StoreButtons } from './StoreButtons'

const linkClass =
  'text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400'

export function Footer() {
  return (
    <footer className="bg-court-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Next-Up home"
            >
              <Image src="/logo.png" alt="Next-Up" width={120} height={36} className="h-9 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Revolutionizing pickleball leagues across South Africa
            </p>
            <StoreButtons variant="compact" align="start" className="mt-6" />
          </div>

          <nav aria-label="Footer" className="contents">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-base font-semibold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
          </p>
          <p>Johannesburg, South Africa</p>
        </div>
      </div>
    </footer>
  )
}
