import { supabase, supabaseUrl } from './supabase'
import type {
  Adjustment,
  Client,
  CronHealth,
  Invoice,
  InvoiceDetailData,
  NewAdjustment,
  StatementRow,
} from '../types'

const API_BASE = `${supabaseUrl}/functions/v1/billing-api`

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const session = data.session
  if (!session) throw new ApiError('Not signed in', 401)

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  let body: { success?: boolean; data?: T; error?: string } | null = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  if (!res.ok || !body?.success) {
    throw new ApiError(body?.error ?? `Request failed (${res.status})`, res.status)
  }
  return body.data as T
}

export const api = {
  clients: () => apiFetch<Client[]>('/clients'),

  invoices: () => apiFetch<Invoice[]>('/invoices'),
  invoice: (id: number) => apiFetch<InvoiceDetailData>(`/invoices/${id}`),
  generateInvoice: (clientId: number, periodStart: string, periodEnd: string) =>
    apiFetch<{ invoice_id: number | null }>('/invoices/generate', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, period_start: periodStart, period_end: periodEnd }),
    }),
  issueInvoice: (id: number) =>
    apiFetch<{ invoice_id: number }>(`/invoices/${id}/issue`, { method: 'POST', body: '{}' }),
  markPaid: (id: number) =>
    apiFetch<{ invoice_id: number }>(`/invoices/${id}/mark-paid`, { method: 'POST', body: '{}' }),
  voidInvoice: (id: number, reason: string) =>
    apiFetch<{ invoice_id: number }>(`/invoices/${id}/void`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  deleteDraft: (id: number) =>
    apiFetch<{ deleted: number }>(`/invoices/${id}`, { method: 'DELETE' }),

  statement: (clientId: number, from: string, to: string) =>
    apiFetch<StatementRow[]>(`/statement?client_id=${clientId}&from=${from}&to=${to}`),

  adjustments: (clientId?: number) =>
    apiFetch<Adjustment[]>(`/adjustments${clientId ? `?client_id=${clientId}` : ''}`),
  createAdjustment: (adjustment: NewAdjustment) =>
    apiFetch<Adjustment>('/adjustments', { method: 'POST', body: JSON.stringify(adjustment) }),

  cronHealth: () => apiFetch<CronHealth>('/cron-health'),
}
