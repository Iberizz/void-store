'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }

function resolveSupabaseId(cartItemId: string): string {
  return cartItemId.endsWith('-black') ? cartItemId.slice(0, -6) : cartItemId
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  // Fetch current order to know previous status + items
  const { data: order, error: fetchError } = await admin
    .from('orders')
    .select('status, items')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) return { error: 'Order not found.' }

  const prevStatus = order.status as OrderStatus
  const items      = order.items as CartItem[]

  // ── Stock adjustments ────────────────────────────────────────────────────
  // Cancel → restore stock
  if (newStatus === 'Cancelled' && prevStatus !== 'Cancelled') {
    for (const item of items) {
      const dbId = resolveSupabaseId(item.id)
      const { data: product } = await admin
        .from('products')
        .select('stock')
        .eq('id', dbId)
        .single()

      if (product) {
        await admin
          .from('products')
          .update({ stock: product.stock + item.quantity })
          .eq('id', dbId)
      }
    }
  }

  // Un-cancel → re-decrement stock
  if (prevStatus === 'Cancelled' && newStatus !== 'Cancelled') {
    for (const item of items) {
      const dbId = resolveSupabaseId(item.id)
      const { data: product } = await admin
        .from('products')
        .select('stock')
        .eq('id', dbId)
        .single()

      if (product) {
        await admin
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', dbId)
      }
    }
  }

  // ── Update order status ──────────────────────────────────────────────────
  const { error } = await admin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/account/orders')
  return { success: true }
}
