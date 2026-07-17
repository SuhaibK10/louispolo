'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/careers/CareerApplicationForm.tsx
// Inline application form for a single open role on the careers page.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react'
import { motion }                  from 'framer-motion'
import { Loader2, CheckCircle2 }   from 'lucide-react'

interface Props {
  role: string
}

export function CareerApplicationForm({ role }: Props) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      role,
      name:         fd.get('name')         as string,
      email:        fd.get('email')        as string,
      portfolioUrl: fd.get('portfolioUrl') as string,
      tools:        fd.get('tools')        as string,
      message:      fd.get('message')      as string,
    }

    setError('')
    startTransition(async () => {
      const res = await fetch('/api/career-application', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    })
  }

  const inputClass =
    'w-full h-11 px-4 bg-lp-cream border border-lp-border font-body text-[0.88rem] text-lp-ink placeholder:text-lp-faint focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200 rounded-md'

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-lp-cream rounded-2xl p-8 flex flex-col items-center text-center gap-3"
      >
        <CheckCircle2 size={40} strokeWidth={1.5} className="text-lp-gold" />
        <p className="font-display text-[1.2rem] text-lp-ink">Application received</p>
        <p className="font-body text-[0.85rem] text-lp-muted max-w-[36ch]">
          Thank you for applying. We review every application and will reach out if it's a fit.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-lp-cream rounded-2xl p-6 md:p-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name" name="name" type="text" placeholder="Your name" required inputClass={inputClass} />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" required inputClass={inputClass} />
      </div>

      <Field
        label="Portfolio / Work Link"
        name="portfolioUrl"
        type="url"
        placeholder="Behance, Instagram, Drive, anywhere your work lives"
        required
        inputClass={inputClass}
      />

      <Field
        label="Tools you're comfortable with"
        name="tools"
        type="text"
        placeholder="e.g. Midjourney, Nano Banana Pro, Photoshop"
        inputClass={inputClass}
        optional
      />

      <div>
        <label className="block font-body text-[0.65rem] tracking-widest uppercase text-lp-muted mb-1.5">
          Why this role <span className="normal-case tracking-normal text-lp-faint">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="A quick note on the work you'd bring, or a link to your best piece"
          className={`${inputClass} h-auto py-3 resize-none`}
        />
      </div>

      {error && (
        <p className="font-body text-[0.78rem] text-lp-error">{error}</p>
      )}

      <motion.button
        type="submit"
        disabled={isPending}
        whileTap={{ scale: 0.98 }}
        className="btn-gold w-full justify-center disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Submit Application'}
      </motion.button>
    </form>
  )
}

function Field({
  label, name, type, placeholder, required, optional, inputClass,
}: {
  label: string; name: string; type: string; placeholder: string
  required?: boolean; optional?: boolean; inputClass: string
}) {
  return (
    <div>
      <label className="block font-body text-[0.65rem] tracking-widest uppercase text-lp-muted mb-1.5">
        {label}
        {required && <span className="text-lp-gold ml-0.5">*</span>}
        {optional && <span className="normal-case tracking-normal text-lp-faint"> (optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  )
}
