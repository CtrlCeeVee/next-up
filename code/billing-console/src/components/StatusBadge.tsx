const STYLES: Record<string, string> = {
  draft: 'bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300',
  issued: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  void: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
        STYLES[status] ?? STYLES.draft
      }`}
    >
      {status}
    </span>
  )
}
