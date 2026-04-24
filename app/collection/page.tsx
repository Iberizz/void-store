export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import CollectionHero   from '@/components/collection/CollectionHero'
import CollectionClient from './CollectionClient'

export const metadata: Metadata = {
  title: 'Collection — VØID',
  description: 'Découvrez la collection AW25 VØID. Casques audio premium Over-ear, In-ear et Studio.',
}

// The 6 base products have hand-picked transparent images — keep them as-is
const TRANSPARENT_OVERRIDE: Record<string, string> = {
  'void-pro':          '/images/void-pro-transparent.png',
  'void-air':          '/images/void-air-transparent.png',
  'void-studio':       '/images/void-studio-transparent.png',
  'void-pro-white':    '/images/void-pro-white-transparent.png',
  'void-air-white':    '/images/void-air-white-transparent.png',
  'void-studio-white': '/images/void-studio-white-transparent.png',
}

export type CollectionItem = {
  id:       string
  name:     string
  price:    string
  category: string
  slug:     string
  imageSrc: string
}

export default async function CollectionPage() {
  const admin = createAdminClient()

  const { data: products } = await admin
    .from('products')
    .select('id, slug, name, price, category, image_vitrine, image_black')
    .order('price', { ascending: false })

  const items: CollectionItem[] = (products ?? []).map(p => {
    const id       = p.id as string
    const baseSlug = p.slug as string
    const isWhite  = id.endsWith('-white')
    const vitrine  = (p.image_vitrine as string | null) || (p.image_black as string)

    return {
      id,
      name:     p.name as string,
      price:    `€${(p.price as number).toLocaleString('fr-FR')}`,
      category: p.category as string,
      slug:     isWhite ? `${baseSlug}?color=white` : baseSlug,
      imageSrc: TRANSPARENT_OVERRIDE[id] ?? vitrine,
    }
  })

  return (
    <main className="relative z-10 bg-[#000000]">
      <CollectionHero count={items.length} />
      <CollectionClient products={items} />
    </main>
  )
}
