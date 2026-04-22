'use client'

import { useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

const FILTERS = ['All', 'Over-ear', 'In-ear', 'Studio'] as const
type Filter   = typeof FILTERS[number]

const PRODUCTS = [
  { id: 'void-pro',         name: 'VØID Pro',         price: '€890',   category: 'Over-ear', slug: 'void-pro',    imageSrc: '/images/void-pro-transparent.png' },
  { id: 'void-air',         name: 'VØID Air',         price: '€590',   category: 'In-ear',   slug: 'void-air',    imageSrc: '/images/void-air-transparent.png' },
  { id: 'void-studio',      name: 'VØID Studio',      price: '€1,290', category: 'Studio',   slug: 'void-studio', imageSrc: '/images/void-studio-transparent.png'},
  { id: 'void-pro-white',   name: 'VØID Pro White',   price: '€890',   category: 'Over-ear', slug: 'void-pro',    imageSrc: '/images/void-pro-white.png'   },
  { id: 'void-air-white',   name: 'VØID Air White',   price: '€590',   category: 'In-ear',   slug: 'void-air',    imageSrc: '/images/void-air-white-transparent.png'   },
  { id: 'void-studio-white',name: 'VØID Studio White',price: '€1,290', category: 'Studio',   slug: 'void-studio', imageSrc: '/images/void-studio-white.png'},
]

export default function CollectionClient() {
  const [active, setActive] = useState<Filter>('All')

  const filtered = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === active)

  // Group in rows of 3 — last row may have fewer items
  const rows: Array<typeof filtered> = []
  for (let i = 0; i < filtered.length; i += 3) rows.push(filtered.slice(i, i + 3))

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

      {/* ── Grid — 3 colonnes fixes, chaque card = 1/3 ── */}
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-px bg-[#000000]"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', height: '60vh' }}
        >
          {row.map((product, colIdx) => {
            const { id, ...cardProps } = product
            return (
              <div key={id} className="relative overflow-hidden">
                <ProductCard
                  {...cardProps}
                  size="large"
                  delay={(rowIdx * 3 + colIdx) * 0.1}
                  tilt={false}
                />
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}
