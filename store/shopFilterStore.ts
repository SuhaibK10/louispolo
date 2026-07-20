// ─────────────────────────────────────────────────────────────────────────────
// store/shopFilterStore.ts
// UI-only, not persisted. Lets the Navbar (a different component tree than
// ProductGrid) open the same filter drawer, and know whether the in-page
// Filters button has scrolled out of view — so it can show its own docked
// icon only once the original button isn't visible anymore.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'

interface ShopFilterState {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  // True while the in-page "Filters" button is on screen. The Navbar's
  // docked filter icon only shows once this goes false.
  inPageButtonVisible: boolean
  setInPageButtonVisible: (visible: boolean) => void
}

export const useShopFilterStore = create<ShopFilterState>()((set) => ({
  drawerOpen: false,
  setDrawerOpen: (open) => set({ drawerOpen: open }),

  inPageButtonVisible: true,
  setInPageButtonVisible: (visible) => set({ inPageButtonVisible: visible }),
}))
