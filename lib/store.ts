import { create } from 'zustand'

// ── Wishlist ──────────────────────────────────────────────────────────────────
// NOTE: no auto-persist — UserStoreSync manages per-user localStorage keys

export interface WishlistItem {
  id:    string
  slug:  string
  name:  string
  price: number
  image: string
}

interface WishlistStore {
  items:      WishlistItem[]
  addItem:    (item: WishlistItem) => void
  removeItem: (id: string) => void
  hasItem:    (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],
  addItem:    (item) => set((s) => ({ items: [...s.items.filter(i => i.id !== item.id), item] })),
  removeItem: (id)   => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
  hasItem:    (id)   => get().items.some(i => i.id === id),
}))

export interface CartItem {
  id: string
  slug: string
  name: string
  price: number
  quantity: number
  image: string
  stock?: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        const max     = item.stock ?? existing.stock ?? Infinity
        const newQty  = Math.min(existing.quantity + item.quantity, max)
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQty, stock: item.stock ?? i.stock } : i
          ),
        }
      }
      const max = item.stock ?? Infinity
      return { items: [...state.items, { ...item, quantity: Math.min(item.quantity, max) }] }
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => {
              if (i.id !== id) return i
              const max = i.stock ?? Infinity
              return { ...i, quantity: Math.min(quantity, max) }
            }),
    })),

  clearCart: () => set({ items: [] }),
  openCart:  () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))
