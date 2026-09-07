import type { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  badge: string
  title: React.ReactNode
  children?: React.ReactNode
  tone?: 'green' | 'blue'
}

export function PageIntro({ icon: Icon, badge, title, children, tone = 'green' }: Props) {
  const badgeTone =
    tone === 'blue'
      ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300'

  return (
    <div className="mb-12 text-center">
      <p
        className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm ${badgeTone}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span>{badge}</span>
      </p>
      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
        {title}
      </h1>
      {children}
    </div>
  )
}
