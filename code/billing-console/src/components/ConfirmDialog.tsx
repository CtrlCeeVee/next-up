import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  body: string
  confirmLabel: string
  danger?: boolean
  requireReason?: boolean
  reasonHint?: string
  busy?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  requireReason,
  reasonHint,
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('')
  const disabled = busy || (requireReason && !reason.trim())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-6 animate-slide-up">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{body}</p>

        {requireReason && (
          <div className="mb-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason"
              className="w-full px-3 py-2 text-sm rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {reasonHint && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{reasonHint}</p>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-semibold rounded-2xl text-white active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 ${
              danger
                ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
            }`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
