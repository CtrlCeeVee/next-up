import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { clubPath, formatSchedule, type Club } from '@/lib/clubs'

export function ClubCard({ club }: { club: Club }) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 ${
        club.isActive
          ? 'border border-green-200/50 bg-white/80 shadow-xl backdrop-blur-lg hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10 dark:border-green-700/50 dark:bg-slate-800/80 dark:hover:border-green-600 dark:hover:shadow-green-400/10'
          : 'border border-slate-200/50 bg-white/60 opacity-75 backdrop-blur-lg hover:opacity-90 dark:border-slate-700/50 dark:bg-slate-800/60'
      }`}
    >
      <div
        className={`absolute inset-0 opacity-5 ${
          club.isActive
            ? 'bg-gradient-to-br from-green-400 to-emerald-600'
            : 'bg-gradient-to-br from-gray-400 to-slate-600'
        }`}
      />

      {club.isActive && (
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500 dark:bg-green-400" />
          <span className="rounded-full bg-green-100/80 px-2 py-1 text-xs font-medium text-green-600 backdrop-blur-sm dark:bg-green-900/30 dark:text-green-400">
            LIVE
          </span>
        </div>
      )}

      {/* Flex column so the details list and button sit at the same height
          on every card in a row, whatever the description length. */}
      <div className="relative flex flex-1 flex-col p-4 sm:p-6 md:p-8">
        <div className="mb-4 flex flex-1 flex-col sm:mb-6">
          <h3 className="mb-2 pr-16 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600 sm:mb-3 sm:text-2xl dark:text-white dark:group-hover:text-green-400">
            <Link href={clubPath(club)}>{club.name}</Link>
          </h3>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {club.description}
          </p>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin
                className="mr-3 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
                aria-hidden="true"
              />
              <span>{club.venue}</span>
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar
                className="mr-3 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
                aria-hidden="true"
              />
              <span>{formatSchedule(club)}</span>
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <Users
                className="mr-3 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
                aria-hidden="true"
              />
              <span>{club.members} active members</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200/50 pt-6 sm:flex-row dark:border-slate-600/50">
          <Link
            href={clubPath(club)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-slate-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
          >
            League details
          </Link>
          <Link
            href="/#download"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
          >
            <span>Get the App</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
