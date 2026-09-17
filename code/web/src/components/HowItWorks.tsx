import { BarChart3, CheckCircle2, Shuffle } from 'lucide-react'
import { SCREENS } from '@/lib/screens'
import { cardClasses } from './ui/Card'
import { IconTile, type IconTone } from './ui/IconTile'
import { PhoneFrame } from './ui/PhoneFrame'
import { Reveal } from './ui/Reveal'

// Colour variety follows the old Quick Actions section: green, blue, purple.
// Each step shows the matching app screen above its icon.
const STEPS: {
  icon: typeof CheckCircle2
  tone: IconTone
  title: string
  text: string
  screen: (typeof SCREENS)[keyof typeof SCREENS]
}[] = [
  {
    icon: CheckCircle2,
    tone: 'emerald',
    title: 'Check in',
    text: 'Arrive at the club on league night, open the app and check in. Pick a partner or let Next-Up pair you with one.',
    screen: SCREENS.home,
  },
  {
    icon: Shuffle,
    tone: 'blue',
    title: 'Get matched',
    text: 'The moment a court frees up the next game is assigned automatically. Everyone plays everyone, with no queue to manage.',
    screen: SCREENS.event,
  },
  {
    icon: BarChart3,
    tone: 'purple',
    title: 'Track your stats',
    text: 'Submit scores from the court. Wins, streaks and rankings update live in the app for every player in the league.',
    screen: SCREENS.ranking,
  },
]

export function HowItWorks() {
  return (
    <div className={cardClasses({ padding: 'md', className: 'sm:p-10' })}>
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          How a league night works
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          No fixtures, no admin. The app runs the night so you just play.
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 90}
            className="group flex flex-col items-center text-center"
          >
            {/* Top of the screen only, fading out, so three phones do not
                triple the section height. */}
            <div className="max-h-56 w-full max-w-[180px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
              <PhoneFrame
                src={step.screen.src}
                alt={step.screen.alt}
                size="sm"
                sizes="180px"
              />
            </div>
            <IconTile
              icon={step.icon}
              tone={step.tone}
              size="lg"
              className="relative -mt-8 ring-4 ring-white transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 dark:ring-slate-800"
            />
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
