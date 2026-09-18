import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { clubPath, formatSchedule, type Club } from '@/lib/clubs'
import { Button } from './ui/Button'
import { cardClasses } from './ui/Card'
import { Monogram } from './ui/Monogram'

export function ClubCard({ club }: { club: Club }) {
  return (
    <article
      className={cardClasses({
        padding: 'none',
        interactive: club.isActive,
        className: `group relative flex h-full flex-col overflow-hidden ${
          club.isActive ? '' : 'opacity-75'
        }`,
      })}
    >
      {club.isActive && (
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            LIVE
          </span>
        </div>
      )}

      {/* Flex column with the footer pinned to the bottom, so the buttons sit
          at the same height on every card in a row whatever the description
          length. */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-4 pr-16">
          <Monogram name={club.name} />
          <h3 className="font-display text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            <Link
              href={clubPath(club)}
              className="transition-colors duration-200 group-hover:text-green-600 dark:group-hover:text-green-400"
            >
              {club.name}
            </Link>
          </h3>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {club.description}
        </p>

        <ul className="mt-5 mb-6 space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400" aria-hidden="true" />
            <span>{club.venue}</span>
          </li>
          <li className="flex items-center gap-3">
            <Calendar className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            <span>{formatSchedule(club)}</span>
          </li>
          <li className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
            <span>{club.members} active members</span>
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-3 border-t border-gray-200/70 pt-6 sm:flex-row dark:border-slate-600/50">
          <Button href={clubPath(club)} variant="secondary" className="flex-1">
            League details
          </Button>
          <Button href="/#download" className="flex-1">
            <span>Get the App</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  )
}
