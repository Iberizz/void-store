export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { PRODUCTS_DATA, type ProductData } from '@/lib/products'
import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProductPageClient     from './ProductPageClient'

interface Props {
  params:       Promise<{ slug: string }>
  searchParams: Promise<{ color?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const base     = PRODUCTS_DATA[slug]
  if (!base) return {}
  return { title: `${base.name} — VØID`, description: base.description }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug }  = await params
  const { color } = await searchParams
  const admin     = createAdminClient()
  const supabase  = await createClient()

  // ── Stock (anon client — source of truth for existence) ──
  const { data: stockRows } = await supabase
    .from('products')
    .select('id, stock')
    .or(`id.eq.${slug},id.eq.${slug}-black,id.eq.${slug}-white`)

  const blackStock  = stockRows?.find(r => r.id === slug || r.id === `${slug}-black`)?.stock ?? null
  const whiteExists = stockRows?.some(r => r.id === `${slug}-white`) ?? false
  const whiteStock  = whiteExists
    ? (stockRows?.find(r => r.id === `${slug}-white`)?.stock ?? null)
    : null

  // ── Product data ──
  let product: ProductData | null = PRODUCTS_DATA[slug] ?? null

  if (!product) {
    // Fetch black row + white row images from admin client
    const { data: rows } = await admin
      .from('products')
      .select('id, slug, name, price, category, description, image_black, image_white, image_vitrine')
      .in('id', [slug, `${slug}-white`])

    const blackRow = rows?.find(r => r.id === slug)
    const whiteRow = rows?.find(r => r.id === `${slug}-white`)

    if (!blackRow) notFound()

    // White image: try image_vitrine → image_black → image_white (depending on how it was inserted)
    const whiteImage = whiteRow
      ? ((whiteRow.image_vitrine as string) || (whiteRow.image_black as string) || (whiteRow.image_white as string) || '')
      : ''

    product = {
      id:          blackRow.id       as string,
      slug:        blackRow.slug     as string,
      name:        blackRow.name     as string,
      category:    blackRow.category as string,
      tagline:     `${(blackRow.name as string).toUpperCase()} — AW25`,
      price:       blackRow.price    as number,
      priceLabel:  `€${(blackRow.price as number).toLocaleString('fr-FR')}`,
      description: (blackRow.description as string) || '',
      specs:       [],
      // white array is populated if: stock query confirms it exists OR admin row found
      images: {
        black: [(blackRow.image_black as string) || ''],
        white: (whiteExists || whiteRow) && whiteImage ? [whiteImage] : [],
      },
      details: [],
    }
  }

  const initialColor = color === 'white' ? 'white' : 'black'

  return (
    <ProductPageClient
      product={product}
      initialColor={initialColor}
      stockByColor={{ black: blackStock, white: whiteStock }}
    />
  )
}
