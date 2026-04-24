'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ProductUpdate = {
  id:             string
  name:           string
  price:          number
  stock:          number
  description:    string
  image_vitrine:  string
  image_black:    string
  image_white:    string
}

export type ProductCreate = {
  slug:                 string
  name:                 string
  price:                number
  stock:                number
  category:             string
  description:          string
  // Each variant has its own product image + vitrine (collection) image
  // Scalable: add image_xxx / image_vitrine_xxx for each new color
  image_black:          string   // product image — required
  image_vitrine_black:  string   // collection image for black (fallback: image_black)
  image_white:          string   // product image white — optional
  image_vitrine_white:  string   // collection image for white (fallback: image_white)
}

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) throw new Error('Unauthorized')
}

export async function updateProduct(payload: ProductUpdate) {
  try { await assertAdmin() } catch { return { error: 'Unauthorized' } }

  const admin = createAdminClient()
  const { error } = await admin
    .from('products')
    .update({
      name:          payload.name,
      price:         payload.price,
      stock:         payload.stock,
      description:   payload.description,
      image_vitrine: payload.image_vitrine,
      image_black:   payload.image_black,
      image_white:   payload.image_white,
    })
    .eq('id', payload.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/collection')
  return { success: true }
}

export async function createProduct(payload: ProductCreate) {
  try { await assertAdmin() } catch { return { error: 'Unauthorized' } }
  if (!payload.image_black.trim()) return { error: 'Black image path is required.' }

  const admin = createAdminClient()
  const base = {
    slug:        payload.slug,
    price:       payload.price,
    stock:       payload.stock,
    category:    payload.category,
    description: payload.description,
  }

  // ── Black variant (always) ──
  const { error: errBlack } = await admin.from('products').insert({
    ...base,
    id:            payload.slug,
    name:          payload.name,
    image_vitrine: payload.image_vitrine_black || payload.image_black,
    image_black:   payload.image_black,
    image_white:   '',
  })
  if (errBlack) return { error: errBlack.message }

  // ── White variant (only if image provided) ──
  if (payload.image_white.trim()) {
    const { error: errWhite } = await admin.from('products').insert({
      ...base,
      id:            `${payload.slug}-white`,
      name:          `${payload.name} White`,
      image_vitrine: payload.image_vitrine_white || payload.image_white,
      image_black:   payload.image_white,
      image_white:   '',
    })
    if (errWhite) return { error: errWhite.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/collection')
  return { success: true }
}

export async function deleteProduct(id: string) {
  try { await assertAdmin() } catch { return { error: 'Unauthorized' } }

  const admin = createAdminClient()
  const { error } = await admin.from('products').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/collection')
  return { success: true }
}
