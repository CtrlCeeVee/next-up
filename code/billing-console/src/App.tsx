import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { Shell } from './components/Shell'
import type { Tab } from './components/Shell'
import { LoginPage } from './pages/LoginPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { InvoiceDetail } from './pages/InvoiceDetail'
import { StatementPage } from './pages/StatementPage'
import { AdjustmentsPage } from './pages/AdjustmentsPage'
import { SystemPage } from './pages/SystemPage'

export default function App() {
  const { session, user, loading, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('invoices')
  const [invoiceId, setInvoiceId] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!session) return <LoginPage />

  return (
    <Shell
      tab={tab}
      onTabChange={(next) => {
        setTab(next)
        setInvoiceId(null)
      }}
      userEmail={user?.email ?? ''}
      onSignOut={signOut}
    >
      {tab === 'invoices' &&
        (invoiceId !== null ? (
          <InvoiceDetail id={invoiceId} onBack={() => setInvoiceId(null)} />
        ) : (
          <InvoicesPage onOpenInvoice={setInvoiceId} />
        ))}
      {tab === 'statement' && <StatementPage />}
      {tab === 'adjustments' && <AdjustmentsPage />}
      {tab === 'system' && <SystemPage />}
    </Shell>
  )
}
