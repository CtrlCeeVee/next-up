import { useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-8 animate-slide-up">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
            NextUp Billing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Owner console</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
