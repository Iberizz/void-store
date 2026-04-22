import { notFound } from 'next/navigation'
import { PRODUCTS_DATA } from '@/lib/products'
import ProductPageClient from './ProductPageClient'

interface Props {
  params:      Promise<{ slug: string }>
  searchParams: Promise<{ color?: string }>
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS_DATA).map((slug) => ({ slug }))
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

  return <ProductPageClient product={product} initialColor={initialColor} />
}
