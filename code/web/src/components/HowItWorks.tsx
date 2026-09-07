import { BarChart3, CheckCircle2, Shuffle } from 'lucide-react'

// Colour variety follows the old Quick Actions section: green, blue, purple.
const STEPS = [
  {
    icon: CheckCircle2,
    title: 'Check in',
    text: 'Arrive at the club on league night, open the app and check in. Pick a partner or let Next-Up pair you with one.',
    tile: 'from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50',
    icon_: 'text-green-600 dark:text-green-400',
    hover:
      'hover:border-green-200 hover:bg-green-50/50 dark:hover:border-green-700/50 dark:hover:bg-green-900/20',
  },
  {
    icon: Shuffle,
    title: 'Get matched',
    text: 'The moment a court frees up the next game is assigned automatically. Everyone plays everyone, with no queue to manage.',
    tile: 'from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50',
    icon_: 'text-blue-600 dark:text-blue-400',
    hover:
      'hover:border-blue-200 hover:bg-blue-50/50 dark:hover:border-blue-700/50 dark:hover:bg-blue-900/20',
  },
  {
    icon: BarChart3,
    title: 'Track your stats',
    text: 'Submit scores from the court. Wins, streaks and rankings update live in the app for every player in the league.',
    tile: 'from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50',
    icon_: 'text-purple-600 dark:text-purple-400',
    hover:
      'hover:border-purple-200 hover:bg-purple-50/50 dark:hover:border-purple-700/50 dark:hover:bg-purple-900/20',
  },
] as const

export function HowItWorks() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-8 dark:border-slate-700/50 dark:bg-slate-800/60">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          How a league night works
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          No fixtures, no admin. The app runs the night so you just play.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className={`group flex flex-col items-center gap-3 rounded-xl border border-transparent p-4 text-center transition-all duration-300 sm:gap-4 sm:rounded-2xl sm:p-6 ${step.hover}`}
          >
            <div
              className={`rounded-2xl bg-gradient-to-br p-4 transition-transform duration-300 group-hover:scale-110 ${step.tile}`}
            >
              <step.icon className={`h-8 w-8 ${step.icon_}`} aria-hidden="true" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
