'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

type CartItem = {
  id: string; name: string; price: number; quantity: number; image: string
  cancelled?: boolean; cancel_reason?: string
}

function resolveSupabaseId(cartItemId: string): string {
  return cartItemId.endsWith('-black') ? cartItemId.slice(0, -6) : cartItemId
}

function revalidateAll() {
  revalidatePath('/admin/orders')
  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/account/orders')
  revalidatePath('/account')
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

  revalidateAll()
  return { success: true }
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('orders').delete().eq('id', orderId)
  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}

// ── Admin: cancel a single item inside any order ──────────────────────────────
export async function adminCancelOrderItem(orderId: string, itemId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: order, error: fetchError } = await admin
    .from('orders')
    .select('id, status, items')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) return { error: 'Order not found.' }
  if (order.status !== 'Processing') return { error: 'Only Processing orders can be modified.' }

  const items  = order.items as CartItem[]
  const target = items.find(i => i.id === itemId)
  if (!target)          return { error: 'Item not found.' }
  if (target.cancelled) return { error: 'Item already cancelled.' }

  const updatedItems = items.map(i =>
    i.id === itemId ? { ...i, cancelled: true, cancel_reason: reason.trim() } : i
  )

  // Restore stock for this item
  const dbId = resolveSupabaseId(target.id)
  const { data: product } = await admin.from('products').select('stock').eq('id', dbId).single()
  if (product) {
    await admin.from('products').update({ stock: product.stock + target.quantity }).eq('id', dbId)
  }

  const allCancelled = updatedItems.every(i => i.cancelled)
  const newStatus    = allCancelled ? 'Cancelled' : order.status

  const { error } = await admin
    .from('orders')
    .update({ items: updatedItems, status: newStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidateAll()
  return { success: true, allCancelled, newStatus }
}
