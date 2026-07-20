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
import { FEATURED_PRODUCTS, getProductBySlug } from '@/config/products'
import { cardUrl, cld }              from '@/lib/cloudinary'
import type { Product }              from '@/types'

interface Props {
  role: string
}

interface TaskImage {
  key:  string
  name: string
  src:  string
  downloadHref: string
}

const CATALOG_TASK_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS.slice(0, 3),
  getProductBySlug('softsquare'),         // images[0] is the Rosegold colorway
  getProductBySlug('hexcore'),
  getProductBySlug('gemtote-duffle-bag'), // images[0] is the White colorway
].filter((p): p is Product => Boolean(p))

const TASK_IMAGES: TaskImage[] = [
  ...CATALOG_TASK_PRODUCTS.map((product) => ({
    key:  product.id,
    name: product.name,
    src:  cardUrl(product.images[0]),
    downloadHref: cld(product.images[0], 'f_auto,q_auto,w_1200,fl_attachment'),
  })),
  { key: 'navy-backpack',  name: 'Navy Backpack',  src: '/careers/navy-backpack.jpg',  downloadHref: '/careers/navy-backpack.jpg' },
  { key: 'olive-backpack', name: 'Olive Backpack', src: '/careers/olive-backpack.jpg', downloadHref: '/careers/olive-backpack.jpg' },
  { key: 'white-trolley',  name: 'White Trolley',  src: '/careers/white-trolley.jpg',  downloadHref: '/careers/white-trolley.jpg' },
]

const MAX_NOTES_WORDS = 100

export function CareerApplicationForm({ role }: Props) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState('')
  const [notes, setNotes]            = useState('')

  const notesWordCount = notes.trim() === '' ? 0 : notes.trim().split(/\s+/).length

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    const words = value.trim() === '' ? [] : value.trim().split(/\s+/)
    setNotes(words.length <= MAX_NOTES_WORDS ? value : words.slice(0, MAX_NOTES_WORDS).join(' '))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      role,
      name:         fd.get('name')         as string,
      email:        fd.get('email')        as string,
      portfolioUrl: fd.get('portfolioUrl') as string,
      resumeUrl:    fd.get('resumeUrl')    as string,
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
        <p className="font-display text-[1.3rem] text-lp-ink text-center mb-3">
          The Task
        </p>
        <ol className="space-y-2.5 mb-4">
          {[
            'Choose the product images from below and download them',
            'Generate hero, lifestyle or ad images of the products using any AI tool',
            'Share one link with all your results in the Task Submission Field',
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="font-display text-[0.9rem] text-lp-ink shrink-0 w-4">{i + 1}.</span>
              <span className="font-body text-[0.88rem] text-lp-ink leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-3 gap-3">
          {TASK_IMAGES.map((image) => (
            <a
              key={image.key}
              href={image.downloadHref}
              download
              className="group relative block aspect-3/4 bg-white rounded-md overflow-hidden border border-lp-border"
            >
              <Image
                src={image.src}
                alt={image.name}
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
          <Field label="Email" name="email" type="email" placeholder="Enter your email" required inputClass={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Portfolio Link"
            name="portfolioUrl"
            type="url"
            placeholder="Behance, Instagram, Drive"
            inputClass={inputClass}
            optional
          />
          <Field
            label="Resume Link"
            name="resumeUrl"
            type="url"
            placeholder="Drive, Dropbox, anywhere it's public"
            inputClass={inputClass}
            optional
          />
        </div>

        <Field
          label="Task Submission Link"
          name="taskUrl"
          type="url"
          placeholder="Folder or album link with all your images for the task above"
          required
          inputClass={inputClass}
          hint="Make sure the link is set to public."
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
            Additional Notes <span className="normal-case tracking-normal text-lp-muted font-normal">(optional)</span>
          </label>
          <textarea
            name="message"
            rows={3}
            value={notes}
            onChange={handleNotesChange}
            placeholder="A quick note on the work you'd bring, or a link to your best piece"
            className={`${inputClass} h-auto py-3 resize-none`}
          />
          <p className={`font-body text-[0.7rem] text-right mt-1 ${notesWordCount >= MAX_NOTES_WORDS ? 'text-lp-error font-medium' : 'text-lp-faint'}`}>
            {notesWordCount}/{MAX_NOTES_WORDS} words
          </p>
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
          {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Submit Application'}
        </motion.button>
      </form>
    </div>
  )
}

function Field({
  label, name, type, placeholder, required, optional, inputClass, hint,
}: {
  label: string; name: string; type: string; placeholder: string
  required?: boolean; optional?: boolean; inputClass: string; hint?: string
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
      {hint && (
        <p className="font-body text-[0.72rem] text-lp-muted mt-1">{hint}</p>
      )}
    </div>
  )
}
