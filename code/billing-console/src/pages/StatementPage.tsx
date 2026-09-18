import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { currentMonth, dateOnly, formatDate, formatRand, groupAmount, monthRange } from '../lib/format'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { Client, Invoice, StatementRow } from '../types'

export function StatementPage() {
  const [clients, setClients] = useState<Client[] | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  const [from, setFrom] = useState(monthRange(currentMonth()).start)
  const [to, setTo] = useState(monthRange(currentMonth()).end)
  const [rows, setRows] = useState<StatementRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [writeOffRow, setWriteOffRow] = useState<StatementRow | null>(null)
  const [regenTarget, setRegenTarget] = useState<Invoice | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api
      .clients()
      .then((list) => {
        setClients(list)
        if (list.length > 0) setClientId(list[0].id)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const load = async (cid = clientId) => {
    if (!cid || !from || !to) return
    setLoading(true)
    setError(null)
    try {
      setRows(await api.statement(cid, from, to))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Load once the client list arrives.
  useEffect(() => {
    if (clientId) load(clientId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const submitWriteOff = async (reason: string) => {
    if (!writeOffRow || !clientId) return
    setBusy(true)
    setError(null)
    try {
      await api.createAdjustment({
        client_id: clientId,
        type: 'night_write_off',
        league_night_instance_id: writeOffRow.league_night_instance_id,
        effective_date: dateOnly(writeOffRow.line_date),
        reason,
      })
      const nightDate = dateOnly(writeOffRow.line_date)
      setWriteOffRow(null)
      await load()
      // If a draft covers this night, offer to regenerate it so the
      // write-off lands on the invoice.
      const invoices = await api.invoices()
      const draft = invoices.find(
        (inv) =>
          inv.client_id === clientId &&
          inv.status === 'draft' &&
          dateOnly(inv.period_start) <= nightDate &&
          nightDate <= dateOnly(inv.period_end)
      )
      if (draft) setRegenTarget(draft)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const regenerate = async () => {
    if (!regenTarget) return
    setBusy(true)
    try {
      await api.generateInvoice(
        regenTarget.client_id,
        dateOnly(regenTarget.period_start),
        dateOnly(regenTarget.period_end)
      )
      setRegenTarget(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const totalCents = (rows ?? []).reduce((sum, r) => sum + Math.round(parseFloat(r.amount) * 100), 0)

  const inputClass =
    'px-3 py-2 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Statement</h2>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-4 flex flex-wrap items-end gap-3">
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
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </div>
        <button
          onClick={() => load()}
          disabled={loading || !clientId}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Load
        </button>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
        {rows === null ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">
            Pick a client and range, then Load.
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">
            No billable nights in this range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="px-4 py-3">Night</th>
                  <th className="px-4 py-3 text-right">Players</th>
                  <th className="px-4 py-3 text-right">Admins</th>
                  <th className="px-4 py-3 text-right">Billable</th>
                  <th className="px-4 py-3 text-right">Gross</th>
                  <th className="px-4 py-3 text-right">Fee</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.league_night_instance_id}
                    className={`border-b border-slate-100 dark:border-slate-700/30 last:border-0 ${
                      row.is_written_off ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(row.line_date)}
                      {row.is_written_off && (
                        <span className="block text-xs italic">Written off: {row.writeoff_reason}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">{row.total_checkins}</td>
                    <td className="px-4 py-3 text-right">{row.admin_checkins}</td>
                    <td className="px-4 py-3 text-right">{row.billable_players}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">R {groupAmount(row.gross)}</td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">{formatRand(row.amount)}</td>
                    <td className="px-4 py-3 text-right">
                      {!row.is_written_off && (
                        <button
                          onClick={() => setWriteOffRow(row)}
                          className="px-3 py-1 text-xs font-medium rounded-2xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/50 dark:border-rose-500/20 active:scale-95 transition-all"
                        >
                          Write off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold text-slate-900 dark:text-white">
                  <td className="px-4 py-3" colSpan={5}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{formatRand((totalCents / 100).toFixed(2))}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {writeOffRow && (
        <ConfirmDialog
          title={`Write off ${formatDate(writeOffRow.line_date)}`}
          body={`The night keeps its numbers on the statement but is billed at R 0.00. Would-be fee: ${formatRand(writeOffRow.amount)}.`}
          confirmLabel="Write off night"
          danger
          requireReason
          reasonHint="Formal wording, no em-dashes; the reason appears verbatim on the client's invoice."
          busy={busy}
          onConfirm={submitWriteOff}
          onCancel={() => setWriteOffRow(null)}
        />
      )}

      {regenTarget && (
        <ConfirmDialog
          title={`Regenerate ${regenTarget.invoice_number}?`}
          body="A draft covers this night. Regenerate it now so the write-off appears on the invoice."
          confirmLabel="Regenerate draft"
          busy={busy}
          onConfirm={regenerate}
          onCancel={() => setRegenTarget(null)}
        />
      )}
    </div>
  )
}
