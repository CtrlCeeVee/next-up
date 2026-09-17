// Formatting helpers. Money values are numeric STRINGS from the API; keep them
// as strings (grouping only) so no float arithmetic ever touches an amount.
// Date columns arrive as ISO strings; slice(0, 10) is timezone-proof for plain
// dates (never new Date('YYYY-MM-DD'), which shifts across UTC midnight).

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const dateOnly = (s: string): string => s.slice(0, 10)

function parts(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = dateOnly(s).split('-').map(Number)
  return { y, m, d }
}

/** "8 Jun 2026" — compact, for console tables */
export function formatDate(s: string | null | undefined): string {
  if (!s) return ''
  const { y, m, d } = parts(s)
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

/** "Mon 8 June 2026" — invoice document line format */
export function formatLineDate(s: string): string {
  const { y, m, d } = parts(s)
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()]
  return `${weekday} ${d} ${MONTHS[m - 1]} ${y}`
}

/** "10 July 2026" — invoice document header format */
export function formatLongDate(s: string): string {
  const { y, m, d } = parts(s)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/** "1 – 30 June 2026" (same month) or "28 June – 27 July 2026" */
export function formatPeriod(start: string, end: string): string {
  const a = parts(start)
  const b = parts(end)
  if (a.y === b.y && a.m === b.m) return `${a.d} – ${b.d} ${MONTHS[a.m - 1]} ${a.y}`
  return `${formatLongDate(start)} – ${formatLongDate(end)}`
}

/** Group a numeric string: "1170.00" -> "1,170.00" (always two decimals) */
export function groupAmount(value: string | number | null | undefined): string {
  if (value == null || value === '') return '0.00'
  const s = typeof value === 'number' ? value.toFixed(2) : String(value)
  const neg = s.startsWith('-')
  const [int, dec = ''] = (neg ? s.slice(1) : s).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${neg ? '-' : ''}${grouped}.${dec.padEnd(2, '0').slice(0, 2)}`
}

/** "R 1,170.00" / "-R 500.00" — matches the issued invoice documents */
export function formatRand(value: string | number | null | undefined): string {
  const g = groupAmount(value)
  return g.startsWith('-') ? `-R ${g.slice(1)}` : `R ${g}`
}

/** "10.00" -> "10" for the service fee column header */
export function trimPct(value: string): string {
  return value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

/** "2026-07" for <input type="month"> defaults */
export function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** "2026-07" -> { start: "2026-07-01", end: "2026-07-31" } */
export function monthRange(yyyyMm: string): { start: string; end: string } {
  const [y, m] = yyyyMm.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  return { start: `${yyyyMm}-01`, end: `${yyyyMm}-${String(last).padStart(2, '0')}` }
}

/**
 * Client-facing documents are formal and must never contain em-dashes;
 * interpolated values (reasons, names) pass through here before rendering.
 */
export function sanitizeFormal(text: string): string {
  return text.replace(/\s*—\s*/g, '; ').replace(/–/g, '-')
}
