import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'

export default function NotFound() {
  return (
    <Section size="lg" width="wide" containerClassName="flex justify-center">
      <Card padding="lg" className="w-full max-w-lg text-center">
        <p className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">404</p>
        <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Page not found
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          That page does not exist or has moved. League check-in, matches and
          leaderboards now live in the Next-Up app.
        </p>
        <Button href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Next-Up
        </Button>
      </Card>
    </Section>
  )
}
