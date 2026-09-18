'use server'

import { Resend } from 'resend'
import { CONTACT_EMAIL, CONTACT_FROM } from '@/lib/site'
import { TOPICS, type Topic } from '@/lib/contact'

export type ContactValues = { name: string; email: string; topic: string; message: string }

export type ContactState = {
  status: 'idle' | 'sent' | 'error'
  message?: string
  /** Echoed back on error so the form keeps what the visitor typed. */
  values?: ContactValues
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { name: 100, email: 254, message: 4000 } as const

function field(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values: ContactValues = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    topic: field(formData, 'topic'),
    message: field(formData, 'message'),
  }

  // Honeypot: real visitors never see this field. Bots that fill it get a
  // success response and nothing is sent.
  if (field(formData, 'company')) {
    return { status: 'sent' }
  }

  const invalid = (message: string): ContactState => ({ status: 'error', message, values })

  if (!values.name || !values.email || !values.message) {
    return invalid('Please fill in your name, email and message.')
  }
  if (!EMAIL_RE.test(values.email)) {
    return invalid('That email address does not look right.')
  }
  if (
    values.name.length > LIMITS.name ||
    values.email.length > LIMITS.email ||
    values.message.length > LIMITS.message
  ) {
    return invalid('Your message is too long. Please keep it under 4000 characters.')
  }
  const topic: Topic = (TOPICS as readonly string[]).includes(values.topic)
    ? (values.topic as Topic)
    : 'Something else'

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set')
    return invalid(`We could not send your message. Please email ${CONTACT_EMAIL} instead.`)
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_EMAIL,
    replyTo: `${values.name.replace(/[<>"]/g, '')} <${values.email}>`,
    subject: `[Website] ${topic}: ${values.name}`,
    text: [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Topic: ${topic}`,
      '',
      values.message,
    ].join('\n'),
  })

  if (error) {
    console.error('Contact form: Resend error:', error)
    return invalid(`We could not send your message. Please email ${CONTACT_EMAIL} instead.`)
  }

  return { status: 'sent' }
}
