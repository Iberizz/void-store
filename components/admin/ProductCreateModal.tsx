'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { X } from 'lucide-react'
import { createProduct, type ProductCreate } from '@/app/actions/products'

const CATEGORIES = ['Over-ear', 'In-ear', 'Studio']

const inputClass  = "w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"
const labelClass  = "block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-2"
const selectClass = "w-full bg-void-card border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"

const EMPTY: ProductCreate = {
  slug:        '',
  name:        '',
  price:       0,
  stock:       0,
  category:    'Over-ear',
  description: '',
  image_black: '',
  image_white: '',
}

type Props = {
  open:    boolean
  onClose: () => void
}

export default function ProductCreateModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form,    setForm]    = useState<ProductCreate>(EMPTY)

  // Open / close animation
  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setError(null)
      setSuccess(false)
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(panelRef.current,   { x: '100%' }, { x: '0%', duration: 0.5, ease: 'expo.out' })
    }
  }, [open])

  function handleClose() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
    gsap.to(panelRef.current,   { x: '100%', duration: 0.4, ease: 'expo.in', onComplete: onClose })
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }
    setSaving(true)
    setError(null)

    const result = await createProduct(form)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); handleClose() }, 1000)
    }
    setSaving(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/70"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-void-surface border-l border-void-border flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Add new product"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-void-border">
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase">New Product</p>
            <p className="font-display text-void-white text-lg tracking-tight mt-0.5">Add to catalog</p>
          </div>
          <button onClick={handleClose} aria-label="Close" className="text-void-muted hover:text-void-white transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Image preview */}
          <div className="flex gap-4">
            {[form.image_black, form.image_white].map((src, i) => (
              <div key={i} className="relative w-20 h-20 bg-void-card border border-void-border shrink-0 flex items-center justify-center">
                {src
                  ? <Image src={src} alt={`variant ${i}`} fill className="object-contain p-1" sizes="80px" />
                  : <span className="font-sans text-void-border text-xs">{i === 0 ? 'Black' : 'White'}</span>
                }
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass}>Product Name *</label>
            <input className={inputClass} value={form.name} placeholder="VØID Pro Max"
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
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
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.description}
              placeholder="Short product description…"
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Image Black (path)</label>
            <input className={inputClass} value={form.image_black}
              onChange={e => setForm(f => ({ ...f, image_black: e.target.value }))}
              placeholder="/images/void-pro-max-transparent.png" />
          </div>

          <div>
            <label className={labelClass}>Image White (path)</label>
            <input className={inputClass} value={form.image_white}
              onChange={e => setForm(f => ({ ...f, image_white: e.target.value }))}
              placeholder="/images/void-pro-max-white.png" />
          </div>

          {error   && <p className="font-sans text-sm text-red-400">{error}</p>}
          {success && <p className="font-sans text-sm text-void-green">Product created.</p>}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-void-border flex gap-3">
          <button onClick={handleClose}
            className="flex-1 py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving}
            aria-label="Create product"
            className="flex-1 py-3 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-200 disabled:opacity-40">
            {saving ? 'Creating…' : success ? 'Created ✓' : 'Create product'}
          </button>
        </div>
      </div>
    </div>
  )
}
