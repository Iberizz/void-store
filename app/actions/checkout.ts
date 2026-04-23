'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type ShippingInfo = {
  firstName: string
  lastName: string
  address: string
  city: string
  country: string
  postal: string
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  slug: string
}

type CheckoutPayload = {
  shipping: ShippingInfo
  cardLast4: string
  cardBrand: string
  items: CartItem[]
  total: number
}

/**
 * Cart item IDs are `${productId}-${color}` e.g. "void-studio-black" or "void-studio-white".
 * Supabase black products have IDs without the "-black" suffix (e.g. "void-studio").
 * White products keep the suffix (e.g. "void-studio-white").
 * This helper resolves the canonical Supabase ID.
 */
function resolveSupabaseId(cartItemId: string): string {
  return cartItemId.endsWith('-black')
    ? cartItemId.slice(0, -6) // strip "-black"
    : cartItemId
}

export async function createOrder(payload: CheckoutPayload) {
  const supabase      = await createClient()
  const adminSupabase = createAdminClient()

  // ── Auth check ─────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to place an order.' }

  // ── Stock validation ───────────────────────────────────────────────────────
  // Build list of canonical Supabase product IDs (may differ from cart item IDs)
  const supabaseIds = [...new Set(payload.items.map(i => resolveSupabaseId(i.id)))]

  const { data: products, error: stockError } = await adminSupabase
    .from('products')
    .select('id, name, stock')
    .in('id', supabaseIds)

  if (stockError) return { error: 'Could not verify stock availability.' }

  for (const item of payload.items) {
    const dbId   = resolveSupabaseId(item.id)
    const product = products?.find(p => p.id === dbId)
    if (!product) return { error: `Product not found: ${item.name}` }
    if (product.stock < item.quantity) {
      return {
        error: `Only ${product.stock} unit${product.stock === 1 ? '' : 's'} of "${product.name}" left in stock.`,
      }
    }
  }

  // ── Create order ───────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id:    user.id,
      items:      payload.items,
      total:      payload.total,
      shipping:   payload.shipping,
      card_last4: payload.cardLast4,
      card_brand: payload.cardBrand,
      status:     'Processing',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // ── Decrement stock (admin client, bypasses RLS) ───────────────────────────
  for (const item of payload.items) {
    const dbId   = resolveSupabaseId(item.id)
    const product = products!.find(p => p.id === dbId)!
    await adminSupabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', dbId)
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/collection')

  return { orderId: data.id }
}
