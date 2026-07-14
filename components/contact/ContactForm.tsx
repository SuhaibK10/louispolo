'use client'

import { useState, useTransition } from 'react'
import { sendContactEnquiry }      from '@/app/(store)/contact/actions'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await sendContactEnquiry(formData)
      if (result.ok) {
        setStatus('success')
        ;(e.target as HTMLFormElement).reset()
      } else {
        setErrorMsg(result.error)
        setStatus('error')
      }
    })
  }

  const inputClass =
    'w-full px-4 py-3 bg-white border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200 rounded-md'

  return (
    <div className="bg-[var(--color-lp-cream)] rounded-2xl p-6 md:p-8">
      {status === 'success' ? (
        <div className="text-center py-8">
          <p className="font-display text-[1.2rem] text-[var(--color-lp-ink)] mb-2">Message sent</p>
          <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">
            We'll get back to you within 2 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-[0.8rem] text-[var(--color-lp-ink)] mb-1.5">
              Your First Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your first name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-body text-[0.8rem] text-[var(--color-lp-ink)] mb-1.5">
              Your Email Address<span className="text-[var(--color-lp-gold)]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-body text-[0.8rem] text-[var(--color-lp-ink)] mb-1.5">
              Your Message<span className="text-[var(--color-lp-gold)]">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Type your message here"
              className={`${inputClass} resize-none`}
            />
          </div>

          {status === 'error' && (
            <p className="font-body text-[0.8rem] text-[var(--color-lp-error)]">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-3 bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] font-body text-[0.85rem] tracking-[0.08em] uppercase rounded-full hover:opacity-80 transition-opacity duration-200 disabled:opacity-50"
          >
            {isPending ? 'Sending…' : 'Send Your Inquiry'}
          </button>
        </form>
      )}
    </div>
  )
}
