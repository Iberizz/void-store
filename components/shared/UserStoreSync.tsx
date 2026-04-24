'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore, useCartStore } from '@/lib/store'
import type { WishlistItem, CartItem } from '@/lib/store'

const cartKey = (uid: string) => `void-cart-${uid}`

export default function UserStoreSync() {
  useEffect(() => {
    const supabase = createClient()
    let uid: string | null = null
    let loadingFromSource = false
    let saveTimer: ReturnType<typeof setTimeout> | null = null

    function scheduleWishlistSave() {
      if (!uid) return
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(async () => {
        const items = useWishlistStore.getState().items
        await supabase.auth.updateUser({ data: { wishlist: items } })
      }, 600)
    }

    const unsubWl = useWishlistStore.subscribe(() => {
      if (!loadingFromSource) scheduleWishlistSave()
    })

    const unsubCart = useCartStore.subscribe((state) => {
      if (uid) localStorage.setItem(cartKey(uid), JSON.stringify(state.items))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUid = session?.user?.id ?? null

      if (newUid && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        uid = newUid
        loadingFromSource = true

        // Wishlist — source of truth: user_metadata (persists across devices/sessions)
        let wishlist: WishlistItem[] = []

        if (session?.user?.user_metadata?.wishlist) {
          wishlist = session.user.user_metadata.wishlist as WishlistItem[]
        }

        useWishlistStore.setState({ items: wishlist })

        // Cart — localStorage only (per-device, session data)
        try {
          const cart = localStorage.getItem(cartKey(uid))
          useCartStore.setState({ items: cart ? (JSON.parse(cart) as CartItem[]) : [] })
        } catch {
          useCartStore.setState({ items: [] })
        }

        loadingFromSource = false
      } else if (event === 'SIGNED_OUT' || !newUid) {
        if (saveTimer) clearTimeout(saveTimer)
        uid = null
        loadingFromSource = true
        useWishlistStore.setState({ items: [] })
        useCartStore.setState({ items: [] })
        loadingFromSource = false
      } else {
        // TOKEN_REFRESHED, USER_UPDATED — update uid only
        uid = newUid
      }
    })

    return () => {
      if (saveTimer) clearTimeout(saveTimer)
      unsubWl()
      unsubCart()
      subscription.unsubscribe()
    }
  }, [])

  return null
}
