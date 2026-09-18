// Renders the formal invoice document from the canonical template in
// Docs/Billing/invoice-template.html (imported ?raw; single source of truth).
// Formal-document rules: interpolated values pass through sanitizeFormal()
// so no em-dash can ever reach a client-facing document.

import template from '../../../../Docs/Billing/invoice-template.html?raw'
import type { InvoiceDetailData, InvoiceLine } from '../types'
import {
  dateOnly,
  formatLineDate,
  formatLongDate,
  formatPeriod,
  formatRand,
  groupAmount,
  sanitizeFormal,
  trimPct,
} from './format'

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const clean = (text: string | null | undefined): string => esc(sanitizeFormal(text ?? ''))

function renderLine(line: InvoiceLine): string {
  // Credit/debit adjustment lines carry no night reference.
  if (line.league_night_instance_id === null && !line.is_written_off) {
    return `    <tr>
      <td colspan="6">${clean(line.description)}</td>
      <td class="num">${formatRand(line.amount)}</td>
    </tr>`
  }
  if (line.is_written_off) {
    return `    <tr class="written-off">
      <td>${formatLineDate(line.line_date)}<br><span class="reason">Written off: ${clean(line.writeoff_reason)}. Not billed.</span></td>
      <td class="num">${line.total_checkins}</td>
      <td class="num">${line.admin_checkins}</td>
      <td class="num">${line.billable_players}</td>
      <td class="num">R ${groupAmount(line.per_player_fee)}</td>
      <td class="num">R ${groupAmount(line.gross)}</td>
      <td class="num">R 0.00</td>
    </tr>`
  }
  return `    <tr>
      <td>${formatLineDate(line.line_date)}</td>
      <td class="num">${line.total_checkins}</td>
      <td class="num">${line.admin_checkins}</td>
      <td class="num">${line.billable_players}</td>
      <td class="num">R ${groupAmount(line.per_player_fee)}</td>
      <td class="num">R ${groupAmount(line.gross)}</td>
      <td class="num">R ${groupAmount(line.amount)}</td>
    </tr>`
}

export function buildInvoiceHtml(data: InvoiceDetailData): string {
  const { invoice, lines, terms_effective_from } = data
  // Strip the template's instructional HTML comments; they are internal notes
  // and must not ship in a client-facing document.
  let html = template.replace(/<!--[\s\S]*?-->/g, '')

  // Rows: replace the template's example tbody wholesale.
  const rows = lines.map(renderLine).join('\n')
  html = html.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>\n${rows}\n  </tbody>`)

  // Service fee column header: percentage from the first night line.
  const nightLine = lines.find((l) => l.league_night_instance_id !== null)
  html = nightLine
    ? html.replaceAll('{{SERVICE_FEE_PCT}}', trimPct(nightLine.service_fee_pct))
    : html.replace(' ({{SERVICE_FEE_PCT}}%)', '')

  // Partial-period terms sentence (contract started mid-period) must be
  // inserted before the global client-name replacement.
  if (
    terms_effective_from &&
    dateOnly(terms_effective_from) > dateOnly(invoice.period_start)
  ) {
    html = html.replace(
      '{{CLIENT_LEGAL_NAME}}. Payment',
      `{{CLIENT_LEGAL_NAME}}, under which billing is effective from ${formatLongDate(terms_effective_from)}. Payment`
    )
  }

  const isDraft = invoice.status === 'draft'
  const number = isDraft ? `${invoice.invoice_number} (DRAFT)` : invoice.invoice_number

  html = html
    .replaceAll('{{INVOICE_NUMBER}}', clean(number))
    .replaceAll('{{CLIENT_LEGAL_NAME}}', clean(invoice.client_legal_name))
    .replaceAll('{{CLIENT_CONTACT_NAME}}', clean(invoice.client_contact_name))
    .replaceAll('{{CLIENT_ADDRESS}}', clean(invoice.client_address))
    .replaceAll('{{PERIOD_START}} – {{PERIOD_END}}', formatPeriod(invoice.period_start, invoice.period_end))
    .replaceAll('{{ISSUE_DATE}}', invoice.issued_at ? formatLongDate(invoice.issued_at) : 'Not yet issued')
    .replaceAll('{{DUE_DATE}}', invoice.due_date ? formatLongDate(invoice.due_date) : 'Not yet issued')
    .replaceAll('{{TOTAL}}', groupAmount(invoice.total))

  return html
}

export function openDocumentWindow(html: string, autoPrint: boolean): void {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
  if (autoPrint) {
    // Give the embedded logo a beat to render before the print dialog.
    setTimeout(() => {
      win.focus()
      win.print()
    }, 400)
  }
}
