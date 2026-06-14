// ─────────────────────────────────────────────────────────────────────────────
// store/cartStore.ts
// Zustand cart — persisted to localStorage. Cart survives page refresh.
// Components use useCart hook, not this store directly.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items:  CartItem[]
  isOpen: boolean
  addItem:    (item: CartItem) => void
  removeItem: (variantKey: string) => void
  updateQty:  (variantKey: string, qty: number) => void
  clearCart:  () => void
  openCart:   () => void
  closeCart:  () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find((i) => i.variantKey === newItem.variantKey)
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.variantKey === newItem.variantKey
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          }))
        } else {
          set((s) => ({ items: [...s.items, newItem] }))
        }
        set({ isOpen: true })
      },

      removeItem: (variantKey) =>
        set((s) => ({ items: s.items.filter((i) => i.variantKey !== variantKey) })),

      updateQty: (variantKey, qty) => {
        if (qty <= 0) { get().removeItem(variantKey); return }
        set((s) => ({
          items: s.items.map((i) =>
            i.variantKey === variantKey ? { ...i, quantity: qty } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name:        'lp-cart',
      partialize:  (s) => ({ items: s.items }),  // only persist items, not UI state
    }
  )
)
