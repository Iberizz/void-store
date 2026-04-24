'use client'

import { useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import type { CollectionItem } from './page'

const FILTERS = ['All', 'Over-ear', 'In-ear', 'Studio'] as const
type Filter = typeof FILTERS[number]

export default function CollectionClient({ products }: { products: CollectionItem[] }) {
  const [active, setActive] = useState<Filter>('All')

  const filtered = active === 'All'
    ? products
    : products.filter(p => p.category === active)

  return (
    <>
      {/* ── Filter bar — sticky ── */}
      <div className="sticky top-0 z-40 flex items-center gap-4 md:gap-8 px-4 md:px-16 py-4 bg-[#080808] border-b border-[#1C1C1C]">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className="font-sans font-light uppercase transition-colors duration-200"
            style={{ fontSize: '11px', letterSpacing: '0.15em', color: active === f ? '#4DFFB4' : '#666666' }}
            data-cursor="pointer"
            aria-pressed={active === f}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="px-2 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 my-2">
          {filtered.map((product, idx) => {
            const { id, ...cardProps } = product
            return (
              <div key={id} className="relative overflow-hidden h-[55vh] sm:h-[50vh] lg:h-[60vh]">
                <ProductCard
                  {...cardProps}
                  size="large"
                  delay={idx * 0.1}
                  tilt={false}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
