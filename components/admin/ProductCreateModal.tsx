'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { X } from 'lucide-react'
import { createProduct, type ProductCreate } from '@/app/actions/products'

const CATEGORIES = ['Over-ear', 'In-ear', 'Studio']

const inputClass  = "w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"
const labelClass  = "block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-1.5"
const selectClass = "w-full bg-void-card border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"

const EMPTY: ProductCreate = {
  slug:                '',
  name:                '',
  price:               0,
  stock:               0,
  category:            'Over-ear',
  description:         '',
  image_black:         '',
  image_vitrine_black: '',
  image_white:         '',
  image_vitrine_white: '',
}

type Props = { open: boolean; onClose: () => void }

function VariantBlock({
  color,
  label,
  required,
  productImage,
  vitrineImage,
  onProductImage,
  onVitrineImage,
  productPlaceholder,
  vitrinePlaceholder,
}: {
  color:              string
  label:              string
  required:           boolean
  productImage:       string
  vitrineImage:       string
  onProductImage:     (v: string) => void
  onVitrineImage:     (v: string) => void
  productPlaceholder: string
  vitrinePlaceholder: string
}) {
  const vitrinePreview = vitrineImage || productImage

  return (
    <div className="border border-void-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full shrink-0 border border-void-border" style={{ background: color }} />
        <p className="font-sans text-void-white text-xs tracking-[0.15em] uppercase flex-1">
          {label}
          {required
            ? <span className="text-void-green ml-1">*</span>
            : <span className="text-void-muted ml-1">(optional)</span>}
        </p>
      </div>

      {/* Product image */}
      <div>
        <p className={labelClass}>Image produit</p>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-void-card border border-void-border shrink-0 flex items-center justify-center">
            {productImage
              ? <Image src={productImage} alt="product" fill className="object-contain p-1" sizes="48px" />
              : <span className="font-sans text-void-border" style={{ fontSize: '8px' }}>None</span>}
          </div>
          <input className={`${inputClass} flex-1`} value={productImage}
            onChange={e => onProductImage(e.target.value)}
            placeholder={productPlaceholder} />
        </div>
      </div>

      {/* Vitrine image */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase">Image vitrine</p>
          <span className="font-sans text-void-muted text-[10px]">Affiché dans /collection</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-void-card border border-void-border shrink-0 flex items-center justify-center">
            {vitrinePreview
              ? <Image src={vitrinePreview} alt="vitrine" fill className="object-contain p-1" sizes="48px" />
              : <span className="font-sans text-void-border" style={{ fontSize: '8px' }}>None</span>}
          </div>
          <input className={`${inputClass} flex-1`} value={vitrineImage}
            onChange={e => onVitrineImage(e.target.value)}
            placeholder={vitrinePlaceholder} />
        </div>
        {!vitrineImage && (
          <p className="font-sans text-void-border text-[10px] mt-1.5">Vide → utilise image produit</p>
        )}
      </div>
    </div>
  )
}

export default function ProductCreateModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form,    setForm]    = useState<ProductCreate>(EMPTY)

  useEffect(() => {
    if (!open) return
    setForm(EMPTY); setError(null); setSuccess(false)

    const overlay     = overlayRef.current
    const blockWheel  = (e: WheelEvent) => e.preventDefault()
    overlay?.addEventListener('wheel', blockWheel, { passive: false })

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(panelRef.current,   { x: '100%' }, { x: '0%', duration: 0.5, ease: 'expo.out' })

    return () => overlay?.removeEventListener('wheel', blockWheel)
  }, [open])

  function handleClose() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
    gsap.to(panelRef.current,   { x: '100%', duration: 0.4, ease: 'expo.in', onComplete: onClose })
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.slug.trim()) { setError('Name and slug are required.'); return }
    if (!form.image_black.trim())               { setError('Black product image is required.'); return }
    setSaving(true); setError(null)

    const result = await createProduct(form)
    if (result?.error) { setError(result.error) }
    else { setSuccess(true); setTimeout(() => { setSuccess(false); handleClose() }, 1000) }
    setSaving(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div ref={overlayRef} onClick={handleClose} className="absolute inset-0 bg-black/70" aria-hidden="true" />

      <div ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-void-surface border-l border-void-border flex flex-col"
        role="dialog" aria-modal="true" aria-label="Add new product">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-void-border shrink-0">
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase">New Product</p>
            <p className="font-display text-void-white text-lg tracking-tight mt-0.5">Add to catalog</p>
          </div>
          <button onClick={handleClose} aria-label="Close" className="text-void-muted hover:text-void-white transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" data-lenis-prevent>

          <div className="border border-void-border px-4 py-3 bg-void-card">
            <p className="font-sans text-void-muted text-[10px] tracking-[0.15em] uppercase">
              Black → 1 item &nbsp;·&nbsp; Black + White → 2 items in catalog
            </p>
          </div>

          <div>
            <label className={labelClass}>Product Name *</label>
            <input className={inputClass} value={form.name} placeholder="VØID Pro Max"
              onChange={e => {
                const name = e.target.value
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                setForm(f => ({ ...f, name, slug }))
              }} />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} value={form.slug} placeholder="void-pro-max"
              onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price (€)</label>
              <input className={inputClass} type="number" min={0} value={form.price}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input className={inputClass} type="number" min={0} value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select className={selectClass} value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} resize-none`} rows={3} value={form.description}
              placeholder="Short product description…"
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Black variant */}
          <VariantBlock
            color="#1A1A1A" label="Black variant" required
            productImage={form.image_black}         onProductImage={v => setForm(f => ({ ...f, image_black: v }))}
            vitrineImage={form.image_vitrine_black}  onVitrineImage={v => setForm(f => ({ ...f, image_vitrine_black: v }))}
            productPlaceholder="/images/void-pro-max-black.png"
            vitrinePlaceholder="/images/void-pro-max-transparent.png"
          />

          {/* White variant */}
          <VariantBlock
            color="#E8E8E8" label="White variant" required={false}
            productImage={form.image_white}         onProductImage={v => setForm(f => ({ ...f, image_white: v }))}
            vitrineImage={form.image_vitrine_white}  onVitrineImage={v => setForm(f => ({ ...f, image_vitrine_white: v }))}
            productPlaceholder="/images/void-pro-max-white.png"
            vitrinePlaceholder="/images/void-pro-max-white-transparent.png"
          />

          {error   && <p className="font-sans text-sm text-red-400">{error}</p>}
          {success && <p className="font-sans text-sm text-void-green">
            {form.image_white.trim() ? '2 products created ✓' : 'Product created ✓'}
          </p>}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-void-border flex gap-3 shrink-0">
          <button onClick={handleClose}
            className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving}
            className="flex-1 py-3 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-200 disabled:opacity-40">
            {saving ? 'Creating…' : success ? 'Created ✓' : form.image_white.trim() ? 'Create 2 products' : 'Create product'}
          </button>
        </div>
      </div>
    </div>
  )
}
