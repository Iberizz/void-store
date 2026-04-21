'use client'

import { useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

const FILTERS = ['All', 'Over-ear', 'In-ear', 'Studio'] as const
type Filter   = typeof FILTERS[number]

const PRODUCTS = [
  { id: 'void-pro',    name: 'VØID Pro',    price: '€890',   category: 'Over-ear', slug: 'void-pro',    imageSrc: '/images/void-pro-916.png'    },
  { id: 'void-air',    name: 'VØID Air',    price: '€590',   category: 'In-ear',   slug: 'void-air',    imageSrc: '/images/void-air-916.png'    },
  { id: 'void-studio', name: 'VØID Studio', price: '€1,290', category: 'Studio',   slug: 'void-studio', imageSrc: '/images/void-studio-916.png' },
]

export default function CollectionClient() {
  const [active, setActive] = useState<Filter>('All')

  const filtered          = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === active)
  const [hero, ...rest]   = filtered

  // Group remaining products in pairs for asymmetric rows
  const rows: typeof rest[] = []
  for (let i = 0; i < rest.length; i += 2) rows.push(rest.slice(i, i + 2))

  return (
    <>
      {/* ── Filter bar — sticky ── */}
      <div className="sticky top-0 z-40 flex items-center gap-8 px-8 md:px-16 py-4 bg-[#080808] border-b border-[#1C1C1C]">
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

      {/* ── Section 1 — Hero card full-width ── */}
      {hero && (
        <div className="w-full" style={{ height: '70vh' }}>
          <ProductCard {...hero} size="large" delay={0} />
        </div>
      )}

      {/* ── Section 2 — Asymmetric grid ── */}
      {rows.map((pair, rowIdx) => {
        const isEvenRow = rowIdx % 2 === 0
        const cols      = isEvenRow ? '60fr 40fr' : '40fr 60fr'
        return (
          <div
            key={rowIdx}
            className="grid gap-px bg-[#000000]"
            style={{ gridTemplateColumns: cols, height: '70vh' }}
          >
            {pair.map((product, colIdx) => {
              const isLarge = (isEvenRow && colIdx === 0) || (!isEvenRow && colIdx === 1)
              return (
                <div key={product.id} className="relative overflow-hidden">
                  <ProductCard
                    {...product}
                    size={isLarge ? 'large' : 'small'}
                    delay={(rowIdx * 2 + colIdx + 1) * 0.15}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
