'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence }             from 'framer-motion'
import { X, Loader2, CheckCircle2, Building2 } from 'lucide-react'

interface Props {
  open:    boolean
  onClose: () => void
}

export function CorporateEnquiryModal({ open, onClose }: Props) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset on reopen
  useEffect(() => {
    if (open) { setSuccess(false); setError('') }
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd  = new FormData(e.currentTarget)
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:max-w-lg bg-[var(--color-lp-porcelain)] max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--color-lp-porcelain)] z-10 flex items-start justify-between px-6 py-5 border-b border-[var(--color-lp-border)]">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Building2 size={16} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
                  <h2 className="font-display text-[1.2rem] text-[var(--color-lp-ink)]">Corporate Enquiry</h2>
                </div>
                <p className="font-body text-[0.7rem] text-[var(--color-lp-muted)]">
                  Bulk orders · Corporate gifting · Custom branding
                </p>
              </div>
              <button onClick={onClose} className="text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors mt-0.5">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-14 flex flex-col items-center text-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle2 size={48} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
                </motion.div>
                <h3 className="font-display text-[1.4rem] text-[var(--color-lp-ink)]">Enquiry received!</h3>
                <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)] max-w-[28ch]">
                  Our team will get back to you within 24 hours.
                </p>
                <button onClick={onClose} className="btn-gold mt-2">Close</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Company Name" name="company" type="text"  placeholder="Acme Pvt. Ltd." required />
                  <Field label="Your Name"    name="name"    type="text"  placeholder="Rahul Sharma"   required />
                  <Field label="Email"        name="email"   type="email" placeholder="rahul@acme.com" required />
                  <Field label="Phone"        name="phone"   type="tel"   placeholder="+91 98765 43210" required />
                </div>

                <Field
                  label="Quantity / Requirement"
                  name="quantity"
                  type="text"
                  placeholder="e.g. 50 trolley bags for annual gifting"
                />

                <div>
                  <label className="block font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-1.5">
                    Message <span className="normal-case tracking-normal text-[var(--color-lp-faint)]">(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tell us about your requirements - colours, custom branding, delivery timeline, etc."
                    className="w-full px-4 py-3 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.88rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200 resize-none"
                  />
                </div>

                {error && (
                  <p className="font-body text-[0.78rem] text-[var(--color-lp-error)]">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold w-full justify-center disabled:opacity-60"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Send Enquiry'}
                </motion.button>

                <p className="font-body text-[0.65rem] text-[var(--color-lp-faint)] text-center">
                  Or email us directly at{' '}
                  <a href="mailto:support@louispolo.in" className="text-[var(--color-lp-gold)] hover:underline">
                    support@louispolo.in
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label, name, type, placeholder, required,
}: {
  label: string; name: string; type: string; placeholder: string; required?: boolean
}) {
  return (
    <div>
      <label className="block font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-1.5">
        {label}{required && <span className="text-[var(--color-lp-gold)] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.88rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
      />
    </div>
  )
}
