'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/SortDropdown.tsx
// Button + popover sort menu (puma.in-style "RECOMMENDED ⌄" pattern),
// replacing the old inline native <select>.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check }          from 'lucide-react'
import { cn }                          from '@/lib/utils'

export interface SortOption<T extends string> {
  label: string
  value: T
}

interface SortDropdownProps<T extends string> {
  options:  SortOption<T>[]
  value:    T
  onChange: (value: T) => void
}

export function SortDropdown<T extends string>({ options, value, onChange }: SortDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const active = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-center gap-2 font-body text-[0.7rem] tracking-widest uppercase text-lp-ink border border-lp-muted rounded-md px-4 py-3 hover:border-lp-ink transition-colors duration-200"
      >
        {active?.label ?? 'Sort'}
        <ChevronDown size={14} strokeWidth={1.5} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-lp-border shadow-lg z-30">
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 font-body text-[0.75rem] text-lp-ink hover:bg-lp-cream transition-colors duration-200 text-left"
            >
              {o.label}
              {o.value === value && <Check size={14} strokeWidth={1.5} className="text-lp-gold shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
