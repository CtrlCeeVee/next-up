// billing-api: the only gateway between the billing console SPA and the
// `billing` schema (which is not exposed through PostgREST). Holds no business
// logic: every write delegates to the billing.* DB functions or a plain INSERT
// into billing.adjustments; the schema's guard triggers and CHECK constraints
// are the validation layer, and their messages are surfaced as 400s.
//
// Auth: platform verify_jwt is defense in depth only (the bare anon key passes
// it). The real gate is below: the bearer token must resolve to a Supabase
// user whose id is in BILLING_ADMIN_USER_IDS.

import postgres from 'https://deno.land/x/postgresjs@v3.4.5/mod.js'
import { createClient } from 'jsr:@supabase/supabase-js@2'

// SUPABASE_DB_URL goes through the pooler in transaction mode; prepared
// statements break there, hence prepare: false.
const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, {
  prepare: false,
  max: 2,
  idle_timeout: 30,
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
)

// User ids are identifiers, not secrets; the baked default fails closed to the
// owner if the env var is unset.
const ADMIN_IDS = (
  Deno.env.get('BILLING_ADMIN_USER_IDS') ??
  'c2168748-fe74-4207-ab7f-c691fd0ba837'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}
const ok = (data: unknown) => json(200, { success: true, data })
const fail = (status: number, error: string) => json(status, { success: false, error })

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const isDate = (s: unknown): s is string => typeof s === 'string' && DATE_RE.test(s)
const toId = (s: unknown): number | null => {
  const n = Number(s)
  return Number.isInteger(n) && n > 0 ? n : null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return fail(401, 'Missing bearer token')

  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (authError || !user) return fail(401, 'Invalid or expired session')
  if (!ADMIN_IDS.includes(user.id)) return fail(403, 'This account is not authorized for billing')

  const url = new URL(req.url)
  const seg = url.pathname.replace(/^\/billing-api\/?/, '').split('/').filter(Boolean)
  const route = `${req.method} /${seg.join('/')}`

  try {
    // ---- clients -----------------------------------------------------------
    if (req.method === 'GET' && seg[0] === 'clients' && seg.length === 1) {
      const rows = await sql`
        SELECT id, code, legal_name, contact_name, billing_email, agreement_ref, address
        FROM billing.clients ORDER BY id`
      return ok(rows)
    }

    // ---- statement ---------------------------------------------------------
    if (req.method === 'GET' && seg[0] === 'statement' && seg.length === 1) {
      const clientId = toId(url.searchParams.get('client_id'))
      const from = url.searchParams.get('from')
      const to = url.searchParams.get('to')
      if (!clientId || !isDate(from) || !isDate(to)) {
        return fail(400, 'Required: client_id, from (YYYY-MM-DD), to (YYYY-MM-DD)')
      }
      const rows = await sql`SELECT * FROM billing.statement(${clientId}, ${from}, ${to})`
      return ok(rows)
    }

    // ---- invoices ----------------------------------------------------------
    if (req.method === 'GET' && seg[0] === 'invoices' && seg.length === 1) {
      const rows = await sql`
        SELECT i.*, c.code AS client_code, c.legal_name AS client_legal_name
        FROM billing.invoices i
        JOIN billing.clients c ON c.id = i.client_id
        ORDER BY i.period_start DESC, i.invoice_number DESC`
      return ok(rows)
    }

    if (req.method === 'GET' && seg[0] === 'invoices' && seg.length === 2) {
      const id = toId(seg[1])
      if (!id) return fail(400, 'Invalid invoice id')
      const [invoice] = await sql`
        SELECT i.*, c.code AS client_code, c.legal_name AS client_legal_name,
               c.contact_name AS client_contact_name, c.address AS client_address,
               c.agreement_ref AS client_agreement_ref
        FROM billing.invoices i
        JOIN billing.clients c ON c.id = i.client_id
        WHERE i.id = ${id}`
      if (!invoice) return fail(404, 'Invoice not found')
      const lines = await sql`
        SELECT * FROM billing.invoice_lines WHERE invoice_id = ${id} ORDER BY line_no`
      const [terms] = await sql`
        SELECT min(effective_from) AS terms_effective_from
        FROM billing.terms
        WHERE client_id = ${invoice.client_id}
          AND effective_from <= ${invoice.period_end}
          AND (effective_to IS NULL OR effective_to >= ${invoice.period_start})`
      return ok({ invoice, lines, terms_effective_from: terms?.terms_effective_from ?? null })
    }

    if (req.method === 'POST' && seg[0] === 'invoices' && seg[1] === 'generate' && seg.length === 2) {
      const body = await req.json()
      const clientId = toId(body.client_id)
      if (!clientId || !isDate(body.period_start) || !isDate(body.period_end)) {
        return fail(400, 'Required: client_id, period_start, period_end (YYYY-MM-DD)')
      }
      const [row] = await sql`
        SELECT billing.generate_invoice(${clientId}, ${body.period_start}, ${body.period_end}) AS invoice_id`
      // NULL means no billable nights or adjustments in the period: informational, not an error.
      return ok({ invoice_id: row.invoice_id })
    }

    if (req.method === 'POST' && seg[0] === 'invoices' && seg.length === 3) {
      const id = toId(seg[1])
      if (!id) return fail(400, 'Invalid invoice id')
      if (seg[2] === 'issue') {
        await sql`SELECT billing.issue_invoice(${id})`
        return ok({ invoice_id: id })
      }
      if (seg[2] === 'mark-paid') {
        await sql`SELECT billing.mark_invoice_paid(${id})`
        return ok({ invoice_id: id })
      }
      if (seg[2] === 'void') {
        const body = await req.json()
        const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
        if (!reason) return fail(400, 'A reason is required to void an invoice')
        await sql`SELECT billing.void_invoice(${id}, ${reason})`
        return ok({ invoice_id: id })
      }
    }

    if (req.method === 'DELETE' && seg[0] === 'invoices' && seg.length === 2) {
      const id = toId(seg[1])
      if (!id) return fail(400, 'Invalid invoice id')
      // The delete guard trigger rejects anything that is not a draft.
      const rows = await sql`DELETE FROM billing.invoices WHERE id = ${id} RETURNING id`
      if (rows.length === 0) return fail(404, 'Invoice not found')
      return ok({ deleted: id })
    }

    // ---- adjustments -------------------------------------------------------
    if (req.method === 'GET' && seg[0] === 'adjustments' && seg.length === 1) {
      const clientId = toId(url.searchParams.get('client_id'))
      const rows = clientId
        ? await sql`
            SELECT a.*, c.code AS client_code FROM billing.adjustments a
            JOIN billing.clients c ON c.id = a.client_id
            WHERE a.client_id = ${clientId}
            ORDER BY a.effective_date DESC, a.id DESC`
        : await sql`
            SELECT a.*, c.code AS client_code FROM billing.adjustments a
            JOIN billing.clients c ON c.id = a.client_id
            ORDER BY a.effective_date DESC, a.id DESC`
      return ok(rows)
    }

    if (req.method === 'POST' && seg[0] === 'adjustments' && seg.length === 1) {
      const body = await req.json()
      const clientId = toId(body.client_id)
      const type = body.type
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!clientId || !['night_write_off', 'credit', 'debit'].includes(type)) {
        return fail(400, 'Required: client_id and type (night_write_off, credit or debit)')
      }
      if (!isDate(body.effective_date)) return fail(400, 'Required: effective_date (YYYY-MM-DD)')
      if (!reason) return fail(400, 'A reason is required (it appears verbatim on the invoice)')
      const nightId = body.league_night_instance_id == null ? null : toId(body.league_night_instance_id)
      const amount = body.amount == null ? null : Number(body.amount)
      // Shape rules (write-off needs a night, credit/debit need an amount) are
      // enforced by the table's CHECK constraints; let their messages surface.
      const [row] = await sql`
        INSERT INTO billing.adjustments
          (client_id, league_night_instance_id, type, amount, effective_date, reason, created_by)
        VALUES (${clientId}, ${nightId}, ${type}, ${amount}, ${body.effective_date}, ${reason}, ${user.email ?? user.id})
        RETURNING *`
      return ok(row)
    }

    // ---- cron health -------------------------------------------------------
    if (req.method === 'GET' && seg[0] === 'cron-health' && seg.length === 1) {
      try {
        const rows = await sql`
          SELECT j.jobname, d.status, d.return_message, d.start_time, d.end_time
          FROM cron.job_run_details d
          JOIN cron.job j USING (jobid)
          WHERE j.jobname = 'billing-generate-monthly-drafts'
          ORDER BY d.start_time DESC
          LIMIT 5`
        return ok({ available: true, runs: rows })
      } catch (_err) {
        return ok({ available: false, runs: [] })
      }
    }

    return fail(404, `No route: ${route}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`billing-api ${route}:`, message)
    return fail(400, message)
  }
})
