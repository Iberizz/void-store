'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ProductUpdate = {
  id: string
  name: string
  price: number
  stock: number
  description: string
  image_black: string
  image_white: string
}

export type ProductCreate = {
  slug: string
  name: string
  price: number
  stock: number
  category: string
  description: string
  image_black: string
  image_white: string
}

export async function updateProduct(payload: ProductUpdate) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  // Use service role to bypass RLS — admin-only action already verified above
  const admin = createAdminClient()
  const { error } = await admin
    .from('products')
    .update({
      name:        payload.name,
      price:       payload.price,
      stock:       payload.stock,
      description: payload.description,
      image_black: payload.image_black,
      image_white: payload.image_white,
    })
    .eq('id', payload.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/collection')
  revalidatePath(`/collection/${payload.id}`)
  return { success: true }
}

export async function createProduct(payload: ProductCreate) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('products').insert({
    slug:        payload.slug,
    name:        payload.name,
    price:       payload.price,
    stock:       payload.stock,
    category:    payload.category,
    description: payload.description,
    image_black: payload.image_black,
    image_white: payload.image_white,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/collection')
  return { success: true }
}
