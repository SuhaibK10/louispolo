// ─────────────────────────────────────────────────────────────────────────────
// lib/compare.ts
// Normalizes heterogeneous product data (specs, variants, features) into
// aligned rows for the Apple-style compare page. Products without a value
// for a row show an em dash, so any two products can be compared.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from '@/types'

export interface TextValue {
  kind: 'text'
  lines: string[]   // rendered one per line; ['—'] when unknown
}

// Colours are rendered by the client as interactive swatches straight from
// product.variants, so compare rows only ever carry text values.
export type CompareValue = TextValue

export interface CompareRow {
  key: string
  label: string
  extract: (p: Product) => CompareValue
}

const DASH: TextValue = { kind: 'text', lines: ['—'] }

function text(...lines: Array<string | undefined | null>): TextValue {
  const clean = lines.filter((l): l is string => !!l && l.trim().length > 0)
  return clean.length ? { kind: 'text', lines: clean } : DASH
}

function spec(p: Product, pattern: RegExp): string | undefined {
  return p.specs?.find(({ label }) => pattern.test(label))?.value
}

function minPrice(p: Product): number {
  return Math.min(...p.variants.flatMap(v => v.sizes.map(s => s.price)))
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    key: 'sizes',
    label: 'Sizes',
    extract: (p) => {
      const sizes = [...new Set(p.variants.flatMap(v => v.sizes.map(s => s.size)))]
      return text(sizes.join(' · '))
    },
  },
  {
    key: 'shell',
    label: 'Shell',
    extract: (p) => text(spec(p, /shell|build/i)),
  },
  {
    key: 'dims',
    label: 'Dimensions & weight',
    extract: (p) => {
      const rows = p.specs?.filter(({ label }) =>
        /cabin|medium|large|size|dimensions|body/i.test(label)
      )
      if (!rows?.length) return DASH
      return text(...rows.map(r => `${r.label}: ${r.value}`))
    },
  },
  {
    key: 'lock',
    label: 'Lock',
    extract: (p) => {
      const s = spec(p, /lock/i)
      if (s) return text(s)
      const f = p.features.find(({ label }) => /lock/i.test(label))
      return f ? text(f.label) : DASH
    },
  },
  {
    key: 'wheels',
    label: 'Wheels',
    extract: (p) => {
      const s = spec(p, /wheels/i)
      if (s) return text(s)
      const f = p.features.find(({ label }) => /wheel|spinner/i.test(label))
      return f ? text(f.label) : DASH
    },
  },
  {
    key: 'access',
    label: 'Access & extras',
    extract: (p) => {
      const s = spec(p, /access|interior|attachment|carry|laptop|fits/i)
      if (s) return text(s)
      const f = p.features.find(({ label }) =>
        /front|3-in-1|laptop|sleeve|compartment|strap/i.test(label)
      )
      return f ? text(f.label) : DASH
    },
  },
  {
    key: 'warranty',
    label: 'Warranty',
    extract: (p) => {
      const m = p.warranty?.match(/(\d+)-year/i)
      return m ? text(`${m[1]} ${m[1] === '1' ? 'year' : 'years'}`) : DASH
    },
  },
]

export { minPrice }
