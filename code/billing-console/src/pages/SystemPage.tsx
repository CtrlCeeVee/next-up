import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import type { CronHealth } from '../types'

export function SystemPage() {
  const [health, setHealth] = useState<CronHealth | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.cronHealth().then(setHealth).catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System</h2>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Monthly draft job</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          billing-generate-monthly-drafts runs at 06:00 SAST on the 1st and drafts the previous month for every
          client with covering terms. Last 5 runs:
        </p>

        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

        {!health && !error ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : health && !health.available ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Cron history is unavailable.</p>
        ) : health && health.runs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No runs recorded yet; the first run happens on the 1st of next month.
          </p>
        ) : (
          <div className="space-y-2">
            {health?.runs.map((run, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/50"
              >
                {run.status === 'succeeded' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {new Date(run.start_time).toLocaleString('en-ZA')} &middot; {run.status}
                  </p>
                  {run.return_message && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{run.return_message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
