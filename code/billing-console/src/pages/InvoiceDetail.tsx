import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, FileText, Printer } from 'lucide-react'
import { api } from '../lib/api'
import { dateOnly, formatDate, formatRand, groupAmount } from '../lib/format'
import { StatusBadge } from '../components/StatusBadge'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { buildInvoiceHtml, openDocumentWindow } from '../lib/invoiceDoc'
import type { InvoiceDetailData } from '../types'

type Action = 'regenerate' | 'issue' | 'delete' | 'mark-paid' | 'void'

interface InvoiceDetailProps {
  id: number
  onBack: () => void
}

export function InvoiceDetail({ id, onBack }: InvoiceDetailProps) {
  const [data, setData] = useState<InvoiceDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState<Action | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    setError(null)
    api.invoice(id).then(setData).catch((e: Error) => setError(e.message))
  }, [id])

  useEffect(load, [load])

  const runAction = async (reason: string) => {
    if (!data || !action) return
    setBusy(true)
    setError(null)
    try {
      const inv = data.invoice
      if (action === 'regenerate') {
        await api.generateInvoice(inv.client_id, dateOnly(inv.period_start), dateOnly(inv.period_end))
      } else if (action === 'issue') {
        await api.issueInvoice(id)
      } else if (action === 'mark-paid') {
        await api.markPaid(id)
      } else if (action === 'void') {
        await api.voidInvoice(id, reason)
      } else if (action === 'delete') {
        await api.deleteDraft(id)
        onBack()
        return
      }
      setAction(null)
      load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        ) : (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        )}
      </div>
    )
  }

  const inv = data.invoice
  const dialogs: Record<Action, { title: string; body: string; confirmLabel: string; danger?: boolean; requireReason?: boolean }> = {
    regenerate: {
      title: `Regenerate ${inv.invoice_number}`,
      body: 'Rebuilds this draft from current check-in data and adjustments. The invoice number stays the same.',
      confirmLabel: 'Regenerate draft',
    },
    issue: {
      title: `Issue ${inv.invoice_number}`,
      body: 'Issuing freezes the invoice and stamps the issue and due dates. Corrections after issuing require a void and reissue.',
      confirmLabel: 'Issue invoice',
    },
    delete: {
      title: `Delete draft ${inv.invoice_number}`,
      body: 'Deletes this draft and its lines. You can regenerate it at any time.',
      confirmLabel: 'Delete draft',
      danger: true,
    },
    'mark-paid': {
      title: `Mark ${inv.invoice_number} as paid`,
      body: 'Confirms the EFT has been received. A paid invoice is permanently frozen.',
      confirmLabel: 'Mark paid',
    },
    void: {
      title: `Void ${inv.invoice_number}`,
      body: 'Voiding is permanent. A corrected reissue for the same period will be numbered with an -R suffix.',
      confirmLabel: 'Void invoice',
      danger: true,
      requireReason: true,
    },
  }

  return (
    <div className="space-y-4">
      <BackButton onBack={onBack} />

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{inv.invoice_number}</h2>
              <StatusBadge status={inv.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {inv.client_legal_name} &middot; {formatDate(inv.period_start)} to {formatDate(inv.period_end)}
            </p>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {formatRand(inv.total)}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
          <Meta label="Generated" value={inv.generated_at ? formatDate(inv.generated_at) : ''} />
          <Meta label="Issued" value={inv.issued_at ? formatDate(inv.issued_at) : ''} />
          <Meta label="Due" value={inv.due_date ? formatDate(inv.due_date) : ''} />
          <Meta label="Paid" value={inv.paid_at ? formatDate(inv.paid_at) : ''} />
        </div>

        {inv.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 whitespace-pre-wrap">{inv.notes}</p>
        )}

        {error && <p className="text-sm text-rose-600 dark:text-rose-400 mb-4">{error}</p>}

        <div className="flex flex-wrap gap-2">
          {inv.status === 'draft' && (
            <>
              <ActionButton onClick={() => setAction('issue')} primary label="Issue" />
              <ActionButton onClick={() => setAction('regenerate')} label="Regenerate" />
              <ActionButton onClick={() => setAction('delete')} label="Delete draft" danger />
            </>
          )}
          {inv.status === 'issued' && (
            <>
              <ActionButton onClick={() => setAction('mark-paid')} primary label="Mark paid" />
              <ActionButton onClick={() => setAction('void')} label="Void" danger />
            </>
          )}
          {inv.status !== 'void' && (
            <>
              <button
                onClick={() => openDocumentWindow(buildInvoiceHtml(data), false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
              >
                <FileText className="h-4 w-4" />
                View document
              </button>
              <button
                onClick={() => openDocumentWindow(buildInvoiceHtml(data), true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="px-4 py-3">Line</th>
                <th className="px-4 py-3 text-right">Players</th>
                <th className="px-4 py-3 text-right">Admins</th>
                <th className="px-4 py-3 text-right">Billable</th>
                <th className="px-4 py-3 text-right">Fee</th>
                <th className="px-4 py-3 text-right">Gross</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((line) => {
                const isAdjustment = line.league_night_instance_id === null && !line.is_written_off
                return (
                  <tr
                    key={line.id}
                    className={`border-b border-slate-100 dark:border-slate-700/30 last:border-0 ${
                      line.is_written_off ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isAdjustment ? (
                      <td className="px-4 py-3" colSpan={6}>
                        {line.description}
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDate(line.line_date)}
                          {line.is_written_off && (
                            <span className="block text-xs italic">
                              Written off: {line.writeoff_reason}. Not billed.
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">{line.total_checkins}</td>
                        <td className="px-4 py-3 text-right">{line.admin_checkins}</td>
                        <td className="px-4 py-3 text-right">{line.billable_players}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">R {groupAmount(line.per_player_fee)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">R {groupAmount(line.gross)}</td>
                      </>
                    )}
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">{formatRand(line.amount)}</td>
                  </tr>
                )
              })}
              <tr className="font-bold text-slate-900 dark:text-white">
                <td className="px-4 py-3" colSpan={6}>
                  Total
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{formatRand(inv.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {action && (
        <ConfirmDialog
          title={dialogs[action].title}
          body={dialogs[action].body}
          confirmLabel={dialogs[action].confirmLabel}
          danger={dialogs[action].danger}
          requireReason={dialogs[action].requireReason}
          reasonHint="Formal wording, no em-dashes; the reason is recorded on the invoice."
          busy={busy}
          onConfirm={runAction}
          onCancel={() => setAction(null)}
        />
      )}
    </div>
  )
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all"
    >
      <ArrowLeft className="h-4 w-4" />
      Invoices
    </button>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-slate-700 dark:text-slate-200">{value || '–'}</p>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  primary,
  danger,
}: {
  label: string
  onClick: () => void
  primary?: boolean
  danger?: boolean
}) {
  const style = primary
    ? 'text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
    : danger
      ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/50 dark:border-rose-500/20'
      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-2xl active:scale-95 transition-all ${style}`}
    >
      {label}
    </button>
  )
}
