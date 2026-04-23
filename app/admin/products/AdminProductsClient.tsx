'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import ProductEditModal from '@/components/admin/ProductEditModal'
import AdminSearchBar   from '@/components/admin/AdminSearchBar'

type Product = {
  id: string; name: string; price: number; category: string
  stock: number; description: string; image_black: string; image_white: string
}

export default function AdminProductsClient({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [query,   setQuery]   = useState('')

  const filtered     = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products

  const maxStock = Math.max(...products.map(p => p.stock), 1)

  return (
    <>
      <div>
        <div className="mb-10 pb-8 border-b border-void-border">
          <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Products.</h1>
            <div className="text-right">
              <p className="font-sans text-void-muted text-xs mb-0.5">Catalog</p>
              <p className="font-display text-2xl text-void-green">{products.length} items</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <AdminSearchBar value={query} onChange={setQuery} placeholder="Search by name or category…" />
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] gap-4 px-4 mb-2">
          {['Product', 'Price', 'Stock', 'Category', 'Inventory', ''].map(h => (
            <p key={h} className="font-sans text-void-muted text-xs tracking-[0.12em] uppercase">{h}</p>
          ))}
        </div>

        <div className="space-y-px">
          {filtered.length === 0 ? (
            <p className="font-sans text-void-muted text-xs py-8 text-center">No products match "{query}"</p>
          ) : filtered.map(product => {
            const stockPct   = (product.stock / maxStock) * 100
            const stockAlert = product.stock < 15
            return (
              <div key={product.id}
                className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] gap-4 items-center px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-void-card border border-void-border shrink-0">
                    {product.image_black && (
                      <Image src={product.image_black} alt={product.name} fill className="object-contain" sizes="40px" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-void-white text-sm">{product.name}</p>
                    <p className="font-sans text-void-muted text-xs">{product.category}</p>
                  </div>
                </div>

                <p className="font-sans text-void-white text-sm">€{product.price}</p>

                <p className="font-sans text-sm" style={{ color: stockAlert ? '#F59E0B' : '#E8E8E8' }}>
                  {product.stock}
                  {stockAlert && <span className="text-xs text-[#F59E0B] ml-1">Low</span>}
                </p>

                <p className="font-sans text-void-muted text-xs">{product.category}</p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-void-border overflow-hidden">
                    <div className="h-full bg-void-green" style={{ width: `${stockPct}%` }} />
                  </div>
                  <span className="font-sans text-void-muted text-xs w-8 text-right">{stockPct.toFixed(0)}%</span>
                </div>

                <button onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}
                  className="p-2 text-void-muted hover:text-void-green transition-colors duration-200">
                  <Pencil size={14} strokeWidth={1.5} />
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-void-border flex justify-between">
          <p className="font-sans text-void-muted text-xs">
            {filtered.length}{query ? ` of ${products.length}` : ''} products · AW25
          </p>
          <p className="font-sans text-void-muted text-xs">
            Total sales · <span className="text-void-white">{products.reduce((s, p) => s + Math.max(0, 100 - p.stock), 0)}</span>
          </p>
        </div>
      </div>

      <ProductEditModal product={editing} onClose={() => setEditing(null)} />
    </>
  )
}
