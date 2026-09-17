import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { api } from '../lib/api'
import { formatDate, formatRand, currentMonth, monthRange } from '../lib/format'
import { StatusBadge } from '../components/StatusBadge'
import type { Client, Invoice } from '../types'

interface InvoicesPageProps {
  onOpenInvoice: (id: number) => void
}

export function InvoicesPage({ onOpenInvoice }: InvoicesPageProps) {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [showGenerate, setShowGenerate] = useState(false)

  const load = useCallback(() => {
    setError(null)
    api.invoices().then(setInvoices).catch((e: Error) => setError(e.message))
  }, [])

  useEffect(load, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Invoices</h2>
        <button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Generate invoice
        </button>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {notice && (
        <p className="text-sm px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20">
          {notice}
        </p>
      )}

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
        {invoices === null && !error ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : invoices && invoices.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onOpenInvoice(inv.id)}
                    className="cursor-pointer border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {inv.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{inv.client_code}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(inv.period_start)} to {formatDate(inv.period_end)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {formatRand(inv.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {inv.due_date ? formatDate(inv.due_date) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showGenerate && (
        <GenerateDialog
          onClose={() => setShowGenerate(false)}
          onDone={(message) => {
            setShowGenerate(false)
            setNotice(message)
            load()
          }}
        />
      )}
    </div>
  )
}

function GenerateDialog({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: (message: string | null) => void
}) {
  const [clients, setClients] = useState<Client[] | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  const [month, setMonth] = useState(currentMonth())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .clients()
      .then((rows) => {
        setClients(rows)
        if (rows.length > 0) setClientId(rows[0].id)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const generate = async () => {
    if (!clientId || !month) return
    setBusy(true)
    setError(null)
    try {
      const { start, end } = monthRange(month)
      const { invoice_id } = await api.generateInvoice(clientId, start, end)
      onDone(invoice_id === null ? 'No billable nights or adjustments in that period; no invoice was created.' : null)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-6 animate-slide-up">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Generate invoice</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Client</label>
            <select
              value={clientId ?? ''}
              onChange={(e) => setClientId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.legal_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Creates or refreshes the month's draft. Existing issued or paid invoices are never touched.
          </p>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 text-sm font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={generate}
              disabled={busy || !clientId || !month}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
