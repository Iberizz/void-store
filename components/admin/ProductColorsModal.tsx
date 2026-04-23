'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { X, Plus, Trash2 } from 'lucide-react'
import {
  getProductColors,
  createProductColor,
  deleteProductColor,
  type ProductColor,
} from '@/app/actions/colors'

type Product = {
  id:          string
  slug:        string
  name:        string
  image_black: string
  image_white: string
}

type Props = {
  product: Product | null
  onClose: () => void
}

const inputClass = "w-full bg-transparent border-0 border-b border-void-border text-void-white font-sans text-sm pb-2 outline-none focus:border-void-green transition-colors duration-300"
const labelClass = "block font-sans text-xs text-void-muted tracking-[0.15em] uppercase mb-2"

const EMPTY_FORM = { name: '', slug: '', hex: '#1a1a1a', image: '' }

export default function ProductColorsModal({ product, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  const [colors,     setColors]     = useState<ProductColor[]>([])
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [error,      setError]      = useState<string | null>(null)
  const [isPending,  startTransition] = useTransition()

  // Load colors when product changes
  useEffect(() => {
    if (!product) return
    setColors([])
    setForm(EMPTY_FORM)
    setError(null)
    getProductColors(product.id).then(setColors)

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(panelRef.current,   { x: '100%' }, { x: '0%', duration: 0.5, ease: 'expo.out' })
  }, [product])

  function handleClose() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
    gsap.to(panelRef.current,   { x: '100%', duration: 0.4, ease: 'expo.in', onComplete: onClose })
  }

  function handleNameChange(name: string) {
    setForm(f => ({
      ...f,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
  }

  function handleAdd() {
    if (!product) return
    if (!form.name.trim() || !form.image.trim()) {
      setError('Name and image path are required.')
      return
    }
    setError(null)

    startTransition(async () => {
      const result = await createProductColor({
        product_id: product.id,
        name:       form.name,
        slug:       form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        hex:        form.hex,
        image:      form.image,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        setForm(EMPTY_FORM)
        const updated = await getProductColors(product.id)
        setColors(updated)
      }
    })
  }

  function handleDelete(color: ProductColor) {
    if (!product) return
    startTransition(async () => {
      const result = await deleteProductColor(color.id, product.slug)
      if (result?.error) {
        setError(result.error)
      } else {
        setColors(prev => prev.filter(c => c.id !== color.id))
      }
    })
  }

  if (!product) return null

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
        aria-label={`Colors — ${product.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-void-border">
          <div>
            <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase">Color variants</p>
            <p className="font-display text-void-white text-lg tracking-tight mt-0.5">{product.name}</p>
          </div>
          <button onClick={handleClose} aria-label="Close" className="text-void-muted hover:text-void-white transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

          {/* ── Existing colors ── */}
          <div>
            <p className={labelClass}>Current variants</p>
            <div className="space-y-2">

              {/* Black — always present */}
              <div className="flex items-center gap-3 px-4 py-3 bg-void-card border border-void-border">
                <div className="w-6 h-6 rounded-full border border-void-border shrink-0" style={{ background: '#0F0F0F' }} />
                <div className="relative w-10 h-10 shrink-0">
                  {product.image_black && (
                    <Image src={product.image_black} alt="Black" fill className="object-contain" sizes="40px" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-sans text-void-white text-xs">Black</p>
                  <p className="font-sans text-void-muted text-xs truncate">{product.image_black || '—'}</p>
                </div>
                <span className="font-sans text-void-muted text-xs tracking-widest uppercase">Default</span>
              </div>

              {/* White — always present */}
              <div className="flex items-center gap-3 px-4 py-3 bg-void-card border border-void-border">
                <div className="w-6 h-6 rounded-full border border-void-border shrink-0" style={{ background: '#E8E8E8' }} />
                <div className="relative w-10 h-10 shrink-0">
                  {product.image_white && (
                    <Image src={product.image_white} alt="White" fill className="object-contain" sizes="40px" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-sans text-void-white text-xs">White</p>
                  <p className="font-sans text-void-muted text-xs truncate">{product.image_white || '—'}</p>
                </div>
                <span className="font-sans text-void-muted text-xs tracking-widest uppercase">Default</span>
              </div>

              {/* Additional colors */}
              {colors.map(color => (
                <div key={color.id} className="flex items-center gap-3 px-4 py-3 bg-void-card border border-void-border">
                  <div className="w-6 h-6 rounded-full border border-void-border shrink-0" style={{ background: color.hex }} />
                  <div className="relative w-10 h-10 shrink-0">
                    {color.image && (
                      <Image src={color.image} alt={color.name} fill className="object-contain" sizes="40px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-void-white text-xs">{color.name}</p>
                    <p className="font-sans text-void-muted text-xs truncate">{color.image}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(color)}
                    disabled={isPending}
                    aria-label={`Delete ${color.name}`}
                    className="text-void-muted hover:text-red-400 transition-colors duration-200 disabled:opacity-30"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              ))}

              {colors.length === 0 && (
                <p className="font-sans text-void-muted text-xs py-2 text-center">No additional colors yet.</p>
              )}
            </div>
          </div>

          {/* ── Add new color ── */}
          <div className="border-t border-void-border pt-6 space-y-5">
            <p className={labelClass}>Add a color</p>

            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={form.name}
                placeholder="Midnight Blue"
                onChange={e => handleNameChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  className={inputClass}
                  value={form.slug}
                  placeholder="midnight-blue"
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Hex color</label>
                <div className="flex items-center gap-3 border-b border-void-border pb-2">
                  <input
                    type="color"
                    value={form.hex}
                    onChange={e => setForm(f => ({ ...f, hex: e.target.value }))}
                    className="w-7 h-7 rounded-full border-0 bg-transparent cursor-pointer"
                    style={{ padding: 0 }}
                    aria-label="Pick color"
                  />
                  <input
                    type="text"
                    value={form.hex}
                    maxLength={7}
                    onChange={e => {
                      const v = e.target.value
                      setForm(f => ({ ...f, hex: v }))
                    }}
                    onBlur={e => {
                      const v = e.target.value
                      if (/^#[0-9a-fA-F]{6}$/.test(v)) return
                      setForm(f => ({ ...f, hex: '#000000' }))
                    }}
                    className="bg-transparent border-0 outline-none font-sans text-void-white text-sm font-light w-24"
                    aria-label="Hex value"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Image path</label>
              <input
                className={inputClass}
                value={form.image}
                placeholder="/images/void-pro-midnight.png"
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              />
              {form.image && (
                <div className="mt-3 relative w-16 h-16 bg-void-card border border-void-border">
                  <Image src={form.image} alt="preview" fill className="object-contain p-1" sizes="64px" />
                </div>
              )}
            </div>

            {error && <p className="font-sans text-sm text-red-400">{error}</p>}

            <button
              onClick={handleAdd}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 bg-void-green text-void-base font-sans text-xs tracking-[0.15em] uppercase hover:bg-void-white transition-colors duration-200 disabled:opacity-40"
            >
              <Plus size={12} strokeWidth={2} />
              {isPending ? 'Adding…' : 'Add color'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-void-border">
          <button
            onClick={handleClose}
            className="w-full py-3 border border-void-border text-void-muted font-sans text-xs tracking-[0.15em] uppercase hover:text-void-white hover:border-void-white transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
