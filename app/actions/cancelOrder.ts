'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  cancelled?: boolean
  cancel_reason?: string
}

function resolveSupabaseId(cartItemId: string): string {
  return cartItemId.endsWith('-black') ? cartItemId.slice(0, -6) : cartItemId
}

function revalidateAll() {
  revalidatePath('/account/orders')
  revalidatePath('/account')
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
}

// ── Cancel entire order ───────────────────────────────────────────────────────
export async function cancelOrder(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, items, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !order) return { error: 'Order not found.' }
  if (order.status !== 'Processing') return { error: 'Only orders in Processing can be cancelled.' }

  const admin = createAdminClient()
  const items = order.items as CartItem[]

  for (const item of items) {
    if (item.cancelled) continue
    const dbId = resolveSupabaseId(item.id)
    const { data: product } = await admin.from('products').select('stock').eq('id', dbId).single()
    if (product) {
      await admin.from('products').update({ stock: product.stock + item.quantity }).eq('id', dbId)
    }
  }

  const { error } = await admin
    .from('orders')
    .update({ status: 'Cancelled' })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidateAll()
  return { success: true }
}

// ── Cancel a single item inside an order ──────────────────────────────────────
export async function cancelOrderItem(orderId: string, itemId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, items, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !order) return { error: 'Order not found.' }
  if (order.status !== 'Processing') return { error: 'Only Processing orders can be modified.' }

  const items = order.items as CartItem[]
  const target = items.find(i => i.id === itemId)

  if (!target)          return { error: 'Item not found in this order.' }
  if (target.cancelled) return { error: 'Item is already cancelled.' }

  const updatedItems = items.map(i =>
    i.id === itemId ? { ...i, cancelled: true, cancel_reason: reason.trim() } : i
  )

  const admin = createAdminClient()

  // Restore stock for this item only
  const dbId = resolveSupabaseId(target.id)
  const { data: product } = await admin.from('products').select('stock').eq('id', dbId).single()
  if (product) {
    await admin.from('products').update({ stock: product.stock + target.quantity }).eq('id', dbId)
  }

  // If every item is now cancelled → close the order
  const allCancelled = updatedItems.every(i => i.cancelled)
  const newStatus    = allCancelled ? 'Cancelled' : order.status

  const { error } = await admin
    .from('orders')
    .update({ items: updatedItems, status: newStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidateAll()
  return { success: true, allCancelled }
}
