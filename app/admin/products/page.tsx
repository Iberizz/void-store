import { createClient } from '@/lib/supabase/server'
import AdminProductsClient from './AdminProductsClient'

export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Products — VØID Admin' }

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, slug, name, price, stock, category, description, image_vitrine, image_black, image_white, specs, details')
    .order('price', { ascending: false })

  return (
    <AdminProductsClient products={products ?? []} />
  )
}
