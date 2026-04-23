'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo    from '@/components/product/ProductInfo'
import type { ProductData } from '@/lib/products'

interface Props {
  product:      ProductData
  initialColor: 'black' | 'white'
  stockByColor: { black: number | null; white: number | null }
}

export default function ProductPageClient({ product, initialColor, stockByColor }: Props) {
  const [color, setColor] = useState<'black' | 'white'>(initialColor)

  const stock = color === 'black' ? stockByColor.black : stockByColor.white

  const currentImages = color === 'black' ? product.images.black : product.images.white

  return (
    <main className="relative z-10 bg-[#000000] min-h-screen flex flex-col" aria-label={`Page produit ${product.name}`}>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 px-8 md:px-16 py-5 border-b border-[#1C1C1C]"
        aria-label="Fil d'ariane" style={{ paddingTop: '96px' }}>
        <Link href="/collection"
          className="font-sans font-light text-[#444444] hover:text-[#E8E8E8] transition-colors duration-200 uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
          Collection
        </Link>
        <span className="text-[#1C1C1C]" aria-hidden="true">/</span>
        <span className="font-sans font-light text-[#4DFFB4] uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
          {product.name}
        </span>
      </nav>

      {/* 50 / 50 grid */}
      <div className="flex flex-col md:grid flex-1" style={{ gridTemplateColumns: '1fr 1fr', minHeight: '85vh' }}>

        {/* Left — Gallery */}
        <div className="relative border-r border-[#1C1C1C]" style={{ minHeight: '60vh' }}>
          <ProductGallery
            images={currentImages}
            name={product.name}
            category={product.category}
          />
        </div>

        {/* Right — Info */}
        <div className="border-t md:border-t-0 border-[#1C1C1C]">
          <ProductInfo
            product={product}
            selectedColor={color}
            onColorChange={(c) => setColor(c as 'black' | 'white')}
            stock={stock}
          />
        </div>
      </div>

    </main>
  )
}
