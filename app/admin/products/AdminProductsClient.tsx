'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import gsap from 'gsap'
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
  const [editing,    setEditing]    = useState<Product | null>(null)
  const [creating,   setCreating]   = useState(false)
  const [query,      setQuery]      = useState('')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [deleting,   setDeleting]   = useState(false)
  const overlayRef                  = useRef<HTMLDivElement>(null)
  const cardRef                     = useRef<HTMLDivElement>(null)

  const pendingProduct = products.find(p => p.id === confirmDel) ?? null

  useEffect(() => {
    if (!confirmDel) return
    const overlay = overlayRef.current
    const blockWheel = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })
    gsap.fromTo(overlay,       { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [confirmDel])

  function handleCloseModal() {
    gsap.to(cardRef.current,    { opacity: 0, y: 8,  duration: 0.2, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => setConfirmDel(null) })
  }

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
    setDeleting(false)
    handleCloseModal()
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
                  <button onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}
                    className="p-2 text-void-muted hover:text-void-green transition-colors duration-200">
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setConfirmDel(product.id)} aria-label={`Delete ${product.name}`}
                    className="p-2 text-void-muted hover:text-red-400 transition-colors duration-200">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
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

      <ProductEditModal   product={editing} onClose={() => setEditing(null)} />
      <ProductCreateModal open={creating}   onClose={() => setCreating(false)} />

      {/* Delete confirmation modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            ref={overlayRef}
            onClick={handleCloseModal}
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
          />
          <div
            ref={cardRef}
            className="relative z-10 w-full max-w-sm bg-void-surface border border-void-border px-8 py-8"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm product deletion"
          >
            <button
              onClick={handleCloseModal}
              aria-label="Close"
              className="absolute top-4 right-4 text-void-muted hover:text-void-white transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <p className="font-sans text-void-muted text-[10px] tracking-[0.2em] uppercase mb-3">
              {pendingProduct?.category ?? 'Product'}
            </p>
            <h2 className="font-display text-void-white text-2xl tracking-tight mb-2">
              Delete this product?
            </h2>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-1">
              <span className="text-void-white">{pendingProduct?.name}</span>
            </p>
            <p className="font-sans text-void-muted text-sm leading-relaxed mb-8">
              This action cannot be undone. The product will be permanently removed from the catalog.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
              >
                Keep it
              </button>
              <button
                onClick={() => handleDelete(confirmDel)}
                disabled={deleting}
                className="flex-1 py-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/40 text-[#FF6B6B] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#FF6B6B]/20 transition-colors duration-200 disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
