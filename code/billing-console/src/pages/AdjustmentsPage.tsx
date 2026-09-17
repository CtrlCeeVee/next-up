import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { formatDate, formatRand } from '../lib/format'
import type { Adjustment, Client } from '../types'

const TYPE_LABELS: Record<string, string> = {
  night_write_off: 'Write-off',
  credit: 'Credit',
  debit: 'Debit',
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[] | null>(null)
  const [clients, setClients] = useState<Client[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [clientId, setClientId] = useState<number | null>(null)
  const [type, setType] = useState<'credit' | 'debit'>('debit')
  const [amount, setAmount] = useState('')
  const [effectiveDate, setEffectiveDate] = useState(today())
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    api.adjustments().then(setAdjustments).catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    load()
    api
      .clients()
      .then((list) => {
        setClients(list)
        if (list.length > 0) setClientId(list[0].id)
      })
      .catch((e: Error) => setError(e.message))
  }, [load])

  const create = async () => {
    if (!clientId || !amount || !effectiveDate || !reason.trim()) return
    setBusy(true)
    setError(null)
    try {
      await api.createAdjustment({
        client_id: clientId,
        type,
        amount: Number(amount),
        effective_date: effectiveDate,
        reason: reason.trim(),
      })
      setAmount('')
      setReason('')
      load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'px-3 py-2 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Adjustments</h2>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-4 space-y-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Once-off charge or credit</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Client</label>
            <select value={clientId ?? ''} onChange={(e) => setClientId(Number(e.target.value))} className={inputClass}>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.legal_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'credit' | 'debit')} className={inputClass}>
              <option value="debit">Debit (charge the client)</option>
              <option value="credit">Credit (reduce the invoice)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Amount (R)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500.00"
              className={`${inputClass} w-32`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Effective date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Once-off activation and onboarding fee for the NextUp platform"
            className={`${inputClass} w-full`}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Formal wording, no em-dashes; this text appears verbatim as the invoice line. It bills on the invoice
            whose period contains the effective date.
          </p>
        </div>
        <button
          onClick={create}
          disabled={busy || !clientId || !amount || !reason.trim()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Add adjustment
        </button>
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
        {adjustments === null ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : adjustments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">No adjustments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">By</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 text-slate-700 dark:text-slate-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(a.effective_date)}</td>
                    <td className="px-4 py-3">{a.client_code}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {TYPE_LABELS[a.type]}
                      {a.league_night_instance_id !== null && (
                        <span className="text-xs text-slate-400 dark:text-slate-500"> (night {a.league_night_instance_id})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{a.amount ? formatRand(a.amount) : ''}</td>
                    <td className="px-4 py-3">{a.reason}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{a.created_by ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
