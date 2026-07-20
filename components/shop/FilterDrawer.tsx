'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/FilterDrawer.tsx
// Full-screen filter panel (puma.in-style): collapsible sections, checkboxes,
// sticky "Show N Products" footer. Filters apply live as you check them —
// the footer button just confirms the count and closes the drawer.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }         from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Check } from 'lucide-react'
import { cn }                from '@/lib/utils'

export interface PriceRange {
  label: string
  min: number
  max: number | null
}

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  resultCount: number

  categories: { label: string; value: string; count: number }[]
  selectedCategories: string[]
  onToggleCategory: (value: string) => void

  priceRanges: PriceRange[]
  selectedPriceRange: string | null
  onSelectPriceRange: (label: string | null) => void

  sizes: string[]
  selectedSizes: string[]
  onToggleSize: (size: string) => void

  colors: { name: string; hex: string }[]
  selectedColors: string[]
  onToggleColor: (name: string) => void

  onClearAll: () => void
}

function Section({
  title, defaultOpen, children,
}: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="border-b border-lp-border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4"
        aria-expanded={open}
      >
        <span className="font-body text-[0.85rem] text-lp-ink font-medium">{title}</span>
        <ChevronDown size={16} strokeWidth={1.5} className={cn('text-lp-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Checkbox({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className="w-full flex items-center gap-3 py-2 text-left"
    >
      <span
        className={cn(
          'w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-150',
          checked ? 'bg-lp-ink border-lp-ink' : 'border-lp-border'
        )}
      >
        {checked && <Check size={11} strokeWidth={2.5} className="text-lp-porcelain" />}
      </span>
      <span className="font-body text-[0.8rem] text-lp-ink">{label}</span>
    </button>
  )
}

export function FilterDrawer({
  open, onClose, resultCount,
  categories, selectedCategories, onToggleCategory,
  priceRanges, selectedPriceRange, onSelectPriceRange,
  sizes, selectedSizes, onToggleSize,
  colors, selectedColors, onToggleColor,
  onClearAll,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 h-full w-full sm:max-w-sm bg-lp-porcelain flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-lp-border shrink-0">
              <h2 className="font-display text-[1.2rem] text-lp-ink">Product Filters</h2>
              <button onClick={onClose} aria-label="Close filters" className="text-lp-muted hover:text-lp-ink transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto px-5">
              <Section title="Product Type">
                <div className="space-y-0.5">
                  {categories.map(({ label, value, count }) => (
                    <Checkbox
                      key={value}
                      checked={selectedCategories.includes(value)}
                      label={`${label} (${count})`}
                      onClick={() => onToggleCategory(value)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Price">
                <div className="space-y-0.5">
                  {priceRanges.map((r) => (
                    <Checkbox
                      key={r.label}
                      checked={selectedPriceRange === r.label}
                      label={r.label}
                      onClick={() => onSelectPriceRange(selectedPriceRange === r.label ? null : r.label)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Size">
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isSelected = selectedSizes.includes(size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => onToggleSize(size)}
                        aria-pressed={isSelected}
                        className={cn(
                          'font-body text-[0.72rem] px-3 py-1.5 border transition-colors duration-150',
                          isSelected
                            ? 'bg-lp-ink text-lp-porcelain border-lp-ink'
                            : 'border-lp-border text-lp-ink hover:border-lp-ink'
                        )}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </Section>

              <Section title="Colour">
                <div className="space-y-0.5">
                  {colors.map(({ name, hex }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onToggleColor(name)}
                      aria-pressed={selectedColors.includes(name)}
                      className="w-full flex items-center gap-3 py-2 text-left"
                    >
                      <span
                        className={cn(
                          'w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-150',
                          selectedColors.includes(name) ? 'bg-lp-ink border-lp-ink' : 'border-lp-border'
                        )}
                      >
                        {selectedColors.includes(name) && <Check size={11} strokeWidth={2.5} className="text-lp-porcelain" />}
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-lp-border" style={{ background: hex }} />
                      <span className="font-body text-[0.8rem] text-lp-ink">{name}</span>
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-lp-border p-5 space-y-3">
              <button
                onClick={onClearAll}
                className="w-full text-center font-body text-[0.72rem] tracking-widest uppercase text-lp-muted hover:text-lp-ink transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="btn-primary w-full justify-center rounded-md"
              >
                Show {resultCount} {resultCount === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
