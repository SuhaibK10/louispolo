// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx'
import { twMerge }               from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Format price in Indian Rupees: 8500 → '₹8,500'
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Capitalise first letter of each word
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

// Convert category slug to display label
export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    trolley:     'Trolley Bags',
    set:         'Sets',
    backpack:    'Backpacks',
    'office-bag':'Office Bags',
    vanity:      'Vanity Cases',
    kids:        'Kids',
    duffle:      'Duffle Bags',
    all:         'All Products',
  }
  return map[cat] ?? titleCase(cat)
}
