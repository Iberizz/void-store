'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ProductColor = {
  id:         string
  product_id: string
  name:       string
  slug:       string
  hex:        string
  image:      string
  created_at: string
}

export type ProductColorCreate = {
  product_id: string
  name:       string
  slug:       string
  hex:        string
  image:      string
}

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) throw new Error('Unauthorized')
}

export async function getProductColors(productId: string): Promise<ProductColor[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('product_colors')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function createProductColor(payload: ProductColorCreate) {
  try { await assertAdmin() } catch { return { error: 'Unauthorized' } }

  const admin = createAdminClient()
  const { error } = await admin.from('product_colors').insert({
    product_id: payload.product_id,
    name:       payload.name,
    slug:       payload.slug,
    hex:        payload.hex,
    image:      payload.image,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath(`/product/${payload.slug}`)
  return { success: true }
}

export async function deleteProductColor(id: string, productSlug: string) {
  try { await assertAdmin() } catch { return { error: 'Unauthorized' } }

  const admin = createAdminClient()
  const { error } = await admin.from('product_colors').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath(`/product/${productSlug}`)
  return { success: true }
}
