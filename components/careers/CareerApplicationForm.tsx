'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/careers/CareerApplicationForm.tsx
// Inline application form for a single open role on the careers page.
// Includes a short task: generate an image from one of our product photos
// and submit the link, so we can see the applicant's actual output.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition }   from 'react'
import Image                         from 'next/image'
import { motion }                    from 'framer-motion'
import { Loader2, CheckCircle2, Download } from 'lucide-react'
import { FEATURED_PRODUCTS }         from '@/config/products'
import { cardUrl, cld }              from '@/lib/cloudinary'

interface Props {
  role: string
}

const TASK_PRODUCTS = FEATURED_PRODUCTS.slice(0, 3)

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
      taskUrl:      fd.get('taskUrl')      as string,
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
    'w-full h-11 px-4 bg-white border border-lp-border font-body text-[0.9rem] text-lp-ink placeholder:text-lp-faint focus:outline-none focus:border-lp-gold transition-colors duration-200 rounded-md'

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
    <div className="bg-lp-cream rounded-2xl p-6 md:p-8">

      {/* ── The Task ── */}
      <div className="mb-7 pb-7 border-b border-lp-border">
        <p className="font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium mb-2">
          The Task
        </p>
        <p className="font-body text-[0.88rem] text-lp-ink leading-relaxed mb-4">
          Pick one product photo below, generate a premium hero or lifestyle image from it
          using any AI tool, and share the link to your result in the form.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {TASK_PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={cld(product.images[0], 'f_auto,q_auto,w_1200,fl_attachment')}
              className="group relative block aspect-3/4 bg-white rounded-md overflow-hidden border border-lp-border"
            >
              <Image
                src={cardUrl(product.images[0])}
                alt={product.name}
                fill
                className="object-cover"
                sizes="120px"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-lp-ink/0 group-hover:bg-lp-ink/50 transition-colors duration-200">
                <Download size={18} strokeWidth={1.5} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </span>
            </a>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Task Submission Link"
          name="taskUrl"
          type="url"
          placeholder="Link to the image you generated for the task above"
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
          <label className="block font-body text-[0.72rem] tracking-widest uppercase text-lp-ink font-medium mb-1.5">
            Why this role <span className="normal-case tracking-normal text-lp-muted font-normal">(optional)</span>
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
    </div>
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
