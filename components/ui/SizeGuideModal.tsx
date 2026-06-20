'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  open:    boolean
  onClose: () => void
}

const SIZES = [
  {
    name:     'Cabin',
    inches:   '20"',
    dims:     '55 × 35 × 20 cm',
    weight:   '2.4 kg',
    capacity: '38 L',
    best:     'Weekend trips, hand baggage',
  },
  {
    name:     'Medium',
    inches:   '24"',
    dims:     '66 × 46 × 26 cm',
    weight:   '3.2 kg',
    capacity: '68 L',
    best:     '5–7 day trips, checked baggage',
  },
  {
    name:     'Large',
    inches:   '28"',
    dims:     '75 × 50 × 30 cm',
    weight:   '4.1 kg',
    capacity: '100 L',
    best:     '10+ days, family travel',
  },
]

const AIRLINES = [
  { name: 'IndiGo',    cabin: true,  limit: '7 kg'  },
  { name: 'Air India', cabin: true,  limit: '8 kg'  },
  { name: 'Vistara',   cabin: true,  limit: '7 kg'  },
  { name: 'SpiceJet',  cabin: true,  limit: '7 kg'  },
  { name: 'Emirates',  cabin: true,  limit: '7 kg'  },
  { name: 'IndiGo',    cabin: false, limit: '—'      },
]

export function SizeGuideModal({ open, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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
            className="relative w-full md:max-w-2xl bg-[var(--color-lp-porcelain)] max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--color-lp-porcelain)] z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--color-lp-border)]">
              <div>
                <h2 className="font-display text-[1.25rem] text-[var(--color-lp-ink)]">Size Guide</h2>
                <p className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)]">
                  All measurements include wheels & handles
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* Size cards */}
              <div className="grid grid-cols-3 gap-3">
                {SIZES.map((s) => (
                  <div
                    key={s.name}
                    className="border border-[var(--color-lp-border)] p-4 flex flex-col gap-2"
                  >
                    {/* Visual luggage silhouette */}
                    <div
                      className="mx-auto bg-[var(--color-lp-cream)] flex items-end justify-center"
                      style={{
                        width:  s.name === 'Cabin' ? 44 : s.name === 'Medium' ? 54 : 64,
                        height: s.name === 'Cabin' ? 56 : s.name === 'Medium' ? 70 : 84,
                      }}
                    >
                      <div className="w-full h-full relative flex items-center justify-center">
                        <svg
                          viewBox="0 0 40 52"
                          fill="none"
                          className="w-full h-full"
                          aria-hidden="true"
                        >
                          <rect x="4" y="8" width="32" height="40" rx="3" stroke="var(--color-lp-ink)" strokeWidth="1.5" fill="none"/>
                          <rect x="14" y="2" width="12" height="7" rx="1.5" stroke="var(--color-lp-ink)" strokeWidth="1.5" fill="none"/>
                          <line x1="20" y1="8" x2="20" y2="48" stroke="var(--color-lp-border)" strokeWidth="1"/>
                          <circle cx="10" cy="47" r="2.5" fill="var(--color-lp-muted)"/>
                          <circle cx="30" cy="47" r="2.5" fill="var(--color-lp-muted)"/>
                          <line x1="12" y1="28" x2="28" y2="28" stroke="var(--color-lp-gold)" strokeWidth="1.5"/>
                        </svg>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="font-display text-[1rem] text-[var(--color-lp-ink)]">{s.name}</p>
                      <p className="font-body text-[0.65rem] text-[var(--color-lp-faint)]">{s.inches}</p>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-[var(--color-lp-border)]">
                      <Row label="Size"     value={s.dims}     />
                      <Row label="Weight"   value={s.weight}   />
                      <Row label="Capacity" value={s.capacity} />
                    </div>

                    <p className="font-body text-[0.6rem] text-[var(--color-lp-muted)] leading-snug pt-1">
                      {s.best}
                    </p>
                  </div>
                ))}
              </div>

              {/* Airline carry-on table */}
              <div>
                <p className="font-body text-[0.65rem] tracking-[0.14em] uppercase text-[var(--color-lp-muted)] mb-3">
                  Cabin bag allowed? (Cabin 20")
                </p>
                <div className="border border-[var(--color-lp-border)] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--color-lp-cream)]">
                        <th className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] text-left px-4 py-2.5">Airline</th>
                        <th className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] text-center px-4 py-2.5">Cabin 20"</th>
                        <th className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] text-center px-4 py-2.5">Weight limit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-lp-border)]">
                      {[
                        { name: 'IndiGo',    ok: true,  limit: '7 kg' },
                        { name: 'Air India', ok: true,  limit: '8 kg' },
                        { name: 'SpiceJet',  ok: true,  limit: '7 kg' },
                        { name: 'Emirates',  ok: true,  limit: '7 kg' },
                        { name: 'Air Arabia',ok: false, limit: '—'    },
                      ].map((a) => (
                        <tr key={a.name} className="hover:bg-[var(--color-lp-cream)]/50 transition-colors">
                          <td className="font-body text-[0.8rem] text-[var(--color-lp-ink)] px-4 py-2.5">{a.name}</td>
                          <td className="text-center px-4 py-2.5">
                            {a.ok
                              ? <CheckCircle2 size={15} strokeWidth={1.5} className="text-emerald-600 mx-auto" />
                              : <XCircle      size={15} strokeWidth={1.5} className="text-red-400 mx-auto" />
                            }
                          </td>
                          <td className="font-body text-[0.8rem] text-[var(--color-lp-muted)] text-center px-4 py-2.5">{a.limit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-[0.6rem] text-[var(--color-lp-faint)] mt-2">
                  * Always check your airline's latest policy before travel. Rules can change.
                </p>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)]">{label}</span>
      <span className="font-body text-[0.65rem] text-[var(--color-lp-ink)] font-medium">{value}</span>
    </div>
  )
}
