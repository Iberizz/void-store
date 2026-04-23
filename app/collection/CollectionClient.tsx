'use client'

import { useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

const FILTERS = ['All', 'Over-ear', 'In-ear', 'Studio'] as const
type Filter   = typeof FILTERS[number]

const PRODUCTS = [
  { id: 'void-pro',          name: 'VØID Pro',          price: '€890',   category: 'Over-ear', slug: 'void-pro',                imageSrc: '/images/void-pro-transparent.png' },
  { id: 'void-air',          name: 'VØID Air',          price: '€590',   category: 'In-ear',   slug: 'void-air',                imageSrc: '/images/void-air-transparent.png' },
  { id: 'void-studio',       name: 'VØID Studio',       price: '€1,290', category: 'Studio',   slug: 'void-studio',             imageSrc: '/images/void-studio-transparent.png'          },
  { id: 'void-pro-white',    name: 'VØID Pro White',    price: '€890',   category: 'Over-ear', slug: 'void-pro?color=white',    imageSrc: '/images/void-pro-white-transparent.png'       },
  { id: 'void-air-white',    name: 'VØID Air White',    price: '€590',   category: 'In-ear',   slug: 'void-air?color=white',    imageSrc: '/images/void-air-white-transparent.png'       },
  { id: 'void-studio-white', name: 'VØID Studio White', price: '€1,290', category: 'Studio',   slug: 'void-studio?color=white', imageSrc: '/images/void-studio-white-transparent.png'    },
]

export default function CollectionClient() {
  const [active, setActive] = useState<Filter>('All')

  const filtered = active === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === active)

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

      {/* ── Grid — 1 col mobile · 2 cols tablet · 3 cols desktop ── */}
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
