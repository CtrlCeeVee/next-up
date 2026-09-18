'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { sendGAEvent } from '@next/third-parties/google'
import { sendContactMessage, type ContactState } from '@/app/contact/actions'
import { TOPICS } from '@/lib/contact'
import { CONTACT_EMAIL } from '@/lib/site'
import { Button } from './ui/Button'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-[border-color,box-shadow] duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-gray-500'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Send className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{pending ? 'Sending' : 'Send message'}</span>
    </Button>
  )
}

const initialState: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, initialState)
  const trackedRef = useRef(false)

  useEffect(() => {
    if (state.status === 'sent' && !trackedRef.current) {
      trackedRef.current = true
      sendGAEvent('event', 'contact_form_submit', {})
    }
  }, [state.status])

  if (state.status === 'sent') {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl bg-green-50/70 p-8 text-center dark:bg-green-900/20"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" aria-hidden="true" />
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Message sent</p>
        <p className="text-gray-600 dark:text-gray-300">
          Thanks, we have your message and will reply to the address you gave us.
        </p>
      </div>
    )
  }

  const values = state.values

  return (
    <form action={formAction} className="relative space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={values?.name}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={values?.email}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className={labelClass}>
          What is this about?
        </label>
        <select
          id="contact-topic"
          name="topic"
          defaultValue={values?.topic ?? TOPICS[0]}
          className={inputClass}
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          defaultValue={values?.message}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Honeypot: off-screen, skipped by keyboard and screen readers, filled in by bots. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Or email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-green-600 underline-offset-2 hover:underline dark:text-green-400"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </form>
  )
}
