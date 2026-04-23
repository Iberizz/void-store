export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { PRODUCTS_DATA } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'
import ProductPageClient from './ProductPageClient'

interface Props {
  params:       Promise<{ slug: string }>
  searchParams: Promise<{ color?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product  = PRODUCTS_DATA[slug]
  if (!product) return {}
  return {
    title:       `${product.name} — VØID`,
    description: product.description,
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug }  = await params
  const { color } = await searchParams
  const product   = PRODUCTS_DATA[slug]

  if (!product) notFound()

  const initialColor = color === 'white' ? 'white' : 'black'

  // Fetch live stock for both color variants
  const supabase = await createClient()
  const { data: stockRows } = await supabase
    .from('products')
    .select('id, stock')
    .or(`id.eq.${slug},id.eq.${slug}-black,id.eq.${slug}-white`)

  const blackStock = stockRows?.find(r => r.id === slug || r.id === `${slug}-black`)?.stock ?? null
  const whiteStock = stockRows?.find(r => r.id === `${slug}-white`)?.stock ?? null

  return (
    <ProductPageClient
      product={product}
      initialColor={initialColor}
      stockByColor={{ black: blackStock, white: whiteStock }}
    />
  )
}
