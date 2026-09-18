import type { ReactNode } from 'react'
import { FileText, BarChart3, SlidersHorizontal, Activity, LogOut } from 'lucide-react'

export type Tab = 'invoices' | 'statement' | 'adjustments' | 'system'

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'statement', label: 'Statement', icon: BarChart3 },
  { id: 'adjustments', label: 'Adjustments', icon: SlidersHorizontal },
  { id: 'system', label: 'System', icon: Activity },
]

interface ShellProps {
  tab: Tab
  onTabChange: (tab: Tab) => void
  userEmail: string
  onSignOut: () => void
  children: ReactNode
}

export function Shell({ tab, onTabChange, userEmail, onSignOut, children }: ShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-32 right-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              NextUp Billing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
          </div>
          <button
            onClick={onSignOut}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 text-sm rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <nav className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl whitespace-nowrap active:scale-95 transition-all ${
                tab === id
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  )
}
