'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/corporate/CorporateEnquiryForm.tsx
// Embedded (not modal) enquiry form for the Corporate Gifting page. Posts to
// the same /api/corporate-enquiry route the old CorporateEnquiryModal used.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react'
import { motion }                  from 'framer-motion'
import { Loader2, CheckCircle2 }   from 'lucide-react'

export function CorporateEnquiryForm() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      company:  fd.get('company')  as string,
      name:     fd.get('name')     as string,
      email:    fd.get('email')    as string,
      phone:    fd.get('phone')    as string,
      quantity: fd.get('quantity') as string,
      message:  fd.get('message')  as string,
    }

    setError('')
    startTransition(async () => {
      const res = await fetch('/api/corporate-enquiry', {
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
    'w-full h-11 px-4 bg-white border border-lp-border font-body text-[0.9rem] text-lp-ink placeholder:text-lp-faint focus:outline-none focus:border-lp-gold transition-colors duration-200 rounded-md'

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-lp-cream rounded-2xl p-8 flex flex-col items-center text-center gap-3"
      >
        <CheckCircle2 size={40} strokeWidth={1.5} className="text-lp-gold" />
        <p className="font-display text-[1.2rem] text-lp-ink">Enquiry received</p>
        <p className="font-body text-[0.85rem] text-lp-muted max-w-[36ch]">
          Our team will get back to you within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-lp-cream rounded-2xl p-6 md:p-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company Name" name="company" type="text" placeholder="Acme Pvt. Ltd." required inputClass={inputClass} />
        <Field label="Your Name" name="name" type="text" placeholder="Rahul Sharma" required inputClass={inputClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email" name="email" type="email" placeholder="rahul@acme.com" required inputClass={inputClass} />
        <Field label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" required inputClass={inputClass} />
      </div>

      <Field
        label="Quantity / Requirement"
        name="quantity"
        type="text"
        placeholder="e.g. 50 trolley bags for annual gifting"
        inputClass={inputClass}
        optional
      />

      <div>
        <label className="block font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium mb-1.5">
          Message <span className="normal-case tracking-normal text-lp-muted font-normal">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your requirements: colours, custom branding, delivery timeline, and so on"
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
        className="btn-primary w-full justify-center rounded-md disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Send Enquiry'}
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
      <label className="block font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium mb-1.5">
        {label}
        {required && <span className="text-lp-gold ml-0.5">*</span>}
        {optional && <span className="normal-case tracking-normal text-lp-muted font-normal"> (optional)</span>}
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
