import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-lg sm:p-10 dark:border-slate-700/50 dark:bg-slate-800/80">
        <p className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
          404
        </p>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          Page not found
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          That page does not exist or has moved. League check-in, matches and
          leaderboards now live in the Next-Up app.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Next-Up
        </Link>
      </div>
    </section>
  )
}
