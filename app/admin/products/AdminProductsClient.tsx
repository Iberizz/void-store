'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import ProductEditModal   from '@/components/admin/ProductEditModal'
import ProductCreateModal from '@/components/admin/ProductCreateModal'
import AdminSearchBar     from '@/components/admin/AdminSearchBar'
import { deleteProduct }  from '@/app/actions/products'

type Product = {
  id: string; name: string; price: number; category: string
  stock: number; description: string; image_vitrine: string
  image_black: string; image_white: string; slug: string
}

export default function AdminProductsClient({ products }: { products: Product[] }) {
  const [editing,     setEditing]     = useState<Product | null>(null)
  const [creating,    setCreating]    = useState(false)
  const [query,       setQuery]       = useState('')
  const [confirmDel,  setConfirmDel]  = useState<string | null>(null) // product id pending delete
  const [deleting,    setDeleting]    = useState(false)

  const filtered = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products

  const maxStock = Math.max(...products.map(p => p.stock), 1)

  async function handleDelete(id: string) {
    setDeleting(true)
    await deleteProduct(id)
    setConfirmDel(null)
    setDeleting(false)
  }

  return (
    <>
      <div>
        <div className="mb-10 pb-8 border-b border-void-border">
          <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Products.</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-sans text-void-muted text-xs mb-0.5">Catalog</p>
                <p className="font-display text-2xl text-void-green">{products.length} items</p>
              </div>
              <button
                onClick={() => setCreating(true)}
                aria-label="Add new product"
                className="flex items-center gap-2 px-4 py-2.5 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-200"
              >
                <Plus size={13} strokeWidth={2} />
                Add
              </button>
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
            const thumbnail  = product.image_black || product.image_vitrine
            const isPendingDelete = confirmDel === product.id

            return (
              <div key={product.id}
                className="bg-void-surface hover:bg-void-card transition-colors duration-150 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] gap-4 items-center px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-void-card border border-void-border shrink-0">
                    {thumbnail && (
                      <Image src={thumbnail} alt={product.name} fill className="object-contain" sizes="40px" />
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

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {isPendingDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting}
                        className="px-2 py-1 bg-red-500/20 text-red-400 font-sans text-[10px] tracking-[0.1em] uppercase hover:bg-red-500/30 transition-colors duration-150 disabled:opacity-40"
                      >
                        {deleting ? '…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDel(null)}
                        className="px-2 py-1 text-void-muted font-sans text-[10px] tracking-[0.1em] uppercase hover:text-void-white transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}
                        className="p-2 text-void-muted hover:text-void-green transition-colors duration-200">
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => setConfirmDel(product.id)} aria-label={`Delete ${product.name}`}
                        className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>
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

      <ProductEditModal   product={editing}  onClose={() => setEditing(null)} />
      <ProductCreateModal open={creating}    onClose={() => setCreating(false)} />
    </>
  )
}
