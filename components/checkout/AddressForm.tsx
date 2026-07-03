'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/checkout/AddressForm.tsx
// India-specific shipping address form. Pincode lookup uses India Post's
// public API to auto-fill city/state — reduces typos and speeds up the
// most tedious part of any address form.
//
// India Post's API returns multiple "PostOffice" entries per pincode (a
// pincode can cover several post offices/localities). We take the first
// result's District as city and State as state — good enough for shipping
// purposes; the user can still edit either field manually if it's wrong.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence }      from 'framer-motion'
import { Loader2, CheckCircle2, MapPin } from 'lucide-react'

export interface ShippingAddress {
  fullName:     string
  phone:        string
  addressLine1: string
  addressLine2: string
  city:         string
  state:        string
  pincode:      string
}

interface Props {
  value:    ShippingAddress
  onChange: (address: ShippingAddress) => void
  onValidChange: (isValid: boolean) => void
}

// India Post API response shape — only the fields we actually use.
interface PostOfficeResult {
  Status: string
  PostOffice: { District: string; State: string }[] | null
}

const REQUIRED_FIELDS: (keyof ShippingAddress)[] = [
  'fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode',
]

function isComplete(address: ShippingAddress): boolean {
  return REQUIRED_FIELDS.every(field => address[field].trim().length > 0)
    && /^\d{6}$/.test(address.pincode)
    && /^\d{10}$/.test(address.phone.replace(/\D/g, ''))
}

export function AddressForm({ value, onChange, onValidChange }: Props) {
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'loading' | 'found' | 'not-found' | 'error'>('idle')
  // Tracks whether city/state were auto-filled so we can let the user
  // override them without the lookup silently re-clobbering their edit.
  const [autoFilled, setAutoFilled] = useState(false)
  const lookupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function update(field: keyof ShippingAddress, val: string) {
    const next = { ...value, [field]: val }
    onChange(next)
  }

  // ── Pincode lookup, debounced ──────────────────────────────────────────
  // Fires 500ms after the user stops typing a 6-digit pincode. Debounced
  // rather than firing on every keystroke — India Post's API is free but
  // not guaranteed fast, and hammering it on every digit typed is wasteful
  // and can make the UI feel laggy if a request resolves out of order.
  useEffect(() => {
    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)

    if (!/^\d{6}$/.test(value.pincode)) {
      setPincodeStatus('idle')
      return
    }

    lookupTimeoutRef.current = setTimeout(async () => {
      setPincodeStatus('loading')
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value.pincode}`)
        const data: PostOfficeResult[] = await res.json()

        const result = data[0]
        if (result?.Status === 'Success' && result.PostOffice?.length) {
          const { District, State } = result.PostOffice[0]
          onChange({ ...value, city: District, state: State })
          setAutoFilled(true)
          setPincodeStatus('found')
        } else {
          setPincodeStatus('not-found')
        }
      } catch {
        // India Post's API has no uptime guarantee — fail gracefully into
        // manual entry rather than blocking the form on a third-party outage.
        setPincodeStatus('error')
      }
    }, 500)

    return () => {
      if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.pincode])

  useEffect(() => {
    onValidChange(isComplete(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            value={value.fullName}
            onChange={e => update('fullName', e.target.value)}
            className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
          />
        </div>
        <div>
          <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 block">
            Phone Number
          </label>
          <input
            type="tel"
            value={value.phone}
            onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile number"
            className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 block">
          Address Line 1
        </label>
        <input
          type="text"
          value={value.addressLine1}
          onChange={e => update('addressLine1', e.target.value)}
          placeholder="House/Flat no., Building, Street"
          className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
        />
      </div>

      <div>
        <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 block">
          Address Line 2 <span className="text-[var(--color-lp-faint)] normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={value.addressLine2}
          onChange={e => update('addressLine2', e.target.value)}
          placeholder="Landmark, Area"
          className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
        />
      </div>

      {/* ── Pincode, with live lookup status ──────────────────────────── */}
      <div>
        <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 block">
          Pincode
        </label>
        <div className="relative">
          <input
            type="text"
            value={value.pincode}
            onChange={e => {
              update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
              setAutoFilled(false)
            }}
            placeholder="6-digit pincode"
            className="w-full h-12 px-4 pr-10 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {pincodeStatus === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={16} className="animate-spin text-[var(--color-lp-muted)]" />
                </motion.div>
              )}
              {pincodeStatus === 'found' && (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 size={16} className="text-[var(--color-lp-success)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {pincodeStatus === 'not-found' && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="font-body text-[0.75rem] text-[var(--color-lp-error)] mt-1.5"
            >
              Pincode not recognized. Please fill city and state manually.
            </motion.p>
          )}
          {pincodeStatus === 'error' && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="font-body text-[0.75rem] text-[var(--color-lp-muted)] mt-1.5"
            >
              Couldn't look up pincode. Please fill city and state manually.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 flex items-center gap-1.5">
            City
            {autoFilled && value.city && (
              <MapPin size={11} className="text-[var(--color-lp-gold)]" />
            )}
          </label>
          <input
            type="text"
            value={value.city}
            onChange={e => { update('city', e.target.value); setAutoFilled(false) }}
            className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
          />
        </div>
        <div>
          <label className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-2 flex items-center gap-1.5">
            State
            {autoFilled && value.state && (
              <MapPin size={11} className="text-[var(--color-lp-gold)]" />
            )}
          </label>
          <input
            type="text"
            value={value.state}
            onChange={e => { update('state', e.target.value); setAutoFilled(false) }}
            className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  )
}

export const EMPTY_ADDRESS: ShippingAddress = {
  fullName:     '',
  phone:        '',
  addressLine1: '',
  addressLine2: '',
  city:         '',
  state:        '',
  pincode:      '',
}
