'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }

function resolveSupabaseId(cartItemId: string): string {
  return cartItemId.endsWith('-black') ? cartItemId.slice(0, -6) : cartItemId
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch order — must belong to this user and still be Processing
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, items, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)   // RLS: user can only cancel their own orders
    .single()

  if (fetchError || !order) return { error: 'Order not found.' }
  if (order.status !== 'Processing') return { error: 'Only orders in Processing can be cancelled.' }

  const admin = createAdminClient()
  const items = order.items as CartItem[]

  // Restore stock for each item
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

  // Cancel the order
  const { error } = await admin
    .from('orders')
    .update({ status: 'Cancelled' })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/account/orders')
  revalidatePath('/account')
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}
