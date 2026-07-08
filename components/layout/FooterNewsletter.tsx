'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/FooterNewsletter.tsx
// Newsletter signup — client island inside the (server) Footer.
// Minimal underline input, gold focus, inline success/error states.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react'
import { ArrowRight, Check }       from 'lucide-react'
import { subscribeNewsletter }     from './actions'

export function FooterNewsletter() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [error,  setError]  = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value || pending) return
    startTransition(async () => {
      const res = await subscribeNewsletter(value)
      if (res.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setError(res.error)
      }
    })
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 font-body text-[0.85rem] text-white/70 md:justify-self-end">
        <Check size={15} strokeWidth={2} className="text-[var(--color-lp-gold)]" />
        You&apos;re in. Watch your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full md:max-w-sm md:justify-self-end" noValidate>
      <div className="flex items-center gap-3 border-b border-[#C9A96E]/30 focus-within:border-[var(--color-lp-gold)] transition-colors duration-300 pb-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="Email address"
          autoComplete="email"
          aria-label="Email address"
          className="flex-1 min-w-0 bg-transparent font-body text-[0.85rem] text-white placeholder:text-white/35 outline-none py-1.5"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe to the newsletter"
          className="text-white/55 hover:text-[var(--color-lp-gold)] transition-colors duration-200 disabled:opacity-40"
        >
          <ArrowRight size={18} strokeWidth={1.5} />
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 font-body text-[0.72rem] text-[var(--color-lp-error)]">{error}</p>
      )}
    </form>
  )
}
