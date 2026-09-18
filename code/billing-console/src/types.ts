// Shapes returned by the billing-api edge function. Numeric columns arrive as
// strings (postgres.js) and date/timestamptz columns as ISO strings; use the
// helpers in lib/format.ts, never float arithmetic.

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void'

export interface Client {
  id: number
  code: string
  legal_name: string
  contact_name: string | null
  billing_email: string | null
  agreement_ref: string | null
  address: string | null
}

export interface Invoice {
  id: number
  client_id: number
  invoice_number: string
  period_start: string
  period_end: string
  status: InvoiceStatus
  total: string
  generated_at: string | null
  issued_at: string | null
  due_date: string | null
  paid_at: string | null
  notes: string | null
  client_code: string
  client_legal_name: string
}

export interface InvoiceLine {
  id: number
  invoice_id: number
  line_no: number
  league_night_instance_id: number | null
  line_date: string
  description: string
  total_checkins: number
  admin_checkins: number
  walkin_checkins: number
  billable_players: number
  per_player_fee: string
  service_fee_pct: string
  gross: string
  amount: string
  is_written_off: boolean
  writeoff_reason: string | null
}

export interface InvoiceDetailData {
  invoice: Invoice & {
    client_contact_name: string | null
    client_address: string | null
    client_agreement_ref: string | null
  }
  lines: InvoiceLine[]
  terms_effective_from: string | null
}

export interface StatementRow {
  league_night_instance_id: number
  line_date: string
  total_checkins: number
  admin_checkins: number
  walkin_checkins: number
  billable_players: number
  per_player_fee: string
  service_fee_pct: string
  gross: string
  amount: string
  is_written_off: boolean
  writeoff_reason: string | null
}

export type AdjustmentType = 'night_write_off' | 'credit' | 'debit'

export interface Adjustment {
  id: number
  client_id: number
  client_code: string
  league_night_instance_id: number | null
  type: AdjustmentType
  amount: string | null
  effective_date: string
  reason: string
  created_by: string | null
  created_at: string
}

export interface NewAdjustment {
  client_id: number
  type: AdjustmentType
  league_night_instance_id?: number
  amount?: number
  effective_date: string
  reason: string
}

export interface CronHealth {
  available: boolean
  runs: {
    jobname: string
    status: string
    return_message: string | null
    start_time: string
    end_time: string | null
  }[]
}
