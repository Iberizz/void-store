'use client'

import { useState, useRef } from 'react'
import { Heart, Plus, Minus } from 'lucide-react'
import gsap from 'gsap'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { flyToCart } from '@/lib/flyToCart'
import type { ProductData } from '@/lib/products'

interface Props {
  product:       ProductData
  selectedColor: 'black' | 'white'
  onColorChange: (c: string) => void
  stock?:        number | null
}

export default function ProductInfo({ product, selectedColor, onColorChange, stock = null }: Props) {
  const [qty,           setQty]          = useState(1)
  const [openAccordion, setOpenAccordion] = useState(false)
  const [added,         setAdded]         = useState(false)
  const btnRef    = useRef<HTMLButtonElement>(null)
  const labelRef  = useRef<HTMLSpanElement>(null)
  const qtyRef    = useRef<HTMLSpanElement>(null)
  const addItem        = useCartStore((s) => s.addItem)
  const openCart       = useCartStore((s) => s.openCart)
  const addToWishlist  = useWishlistStore((s) => s.addItem)
  const removeWishlist = useWishlistStore((s) => s.removeItem)
  const isWished       = useWishlistStore((s) => s.hasItem(`${product.id}-${selectedColor}`))

  const hasWhite   = product.images.white.length > 0 && !!product.images.white[0]
  const outOfStock = stock !== null && stock <= 0
  const lowStock   = stock !== null && stock > 0 && stock <= 10
  const maxQty     = stock !== null && stock > 0 ? stock : 99

  const itemId         = `${product.id}-${selectedColor}`
  const inCart         = useCartStore((s) => s.items.find(i => i.id === itemId)?.quantity ?? 0)
  const cartFull       = inCart >= maxQty
  const canAdd         = !outOfStock && !cartFull

  const handleAddToCart = () => {
    if (!canAdd) return

    const cartImage = selectedColor === 'white' ? product.images.white[0] : product.images.black[0]
    const cartName  = selectedColor === 'white' ? `${product.name} White` : product.name
    const safeQty   = Math.min(qty, maxQty - inCart)

    addItem({
      id:       itemId,
      slug:     product.slug,
      name:     cartName,
      price:    product.price,
      quantity: safeQty,
      image:    cartImage,
      stock:    stock ?? undefined,
    })

    // Fly animation: product image → cart icon
    const mainImg = document.querySelector<HTMLElement>('[data-product-main-image]')
    if (mainImg) flyToCart(mainImg)

    // Button: compress → spring
    gsap.killTweensOf(btnRef.current)
    gsap.to(btnRef.current, { scaleX: 0.97, scaleY: 0.94, duration: 0.1, ease: 'power2.in',
      onComplete: () => gsap.to(btnRef.current, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    })

    // Label swap: "Add to cart" → "Added ✓" → back
    setAdded(true)
    gsap.fromTo(labelRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out' })
    setTimeout(() => {
      gsap.to(labelRef.current, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in',
        onComplete: () => { setAdded(false); gsap.set(labelRef.current, { y: 0, opacity: 1 }) }
      })
    }, 1400)

    setTimeout(() => openCart(), 600)
  }

  const handleQtyChange = (delta: number) => {
    const next = Math.min(Math.max(1, qty + delta), maxQty)
    if (next === qty) return
    setQty(next)
    gsap.killTweensOf(qtyRef.current)
    gsap.fromTo(qtyRef.current,
      { y: delta > 0 ? 8 : -8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.25, ease: 'expo.out' }
    )
  }

  return (
    <div className="flex flex-col h-full justify-center px-10 md:px-16 py-12 overflow-y-auto">

      {/* Tagline */}
      <p className="font-sans font-light text-[#4DFFB4] uppercase mb-3"
        style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
        {product.tagline}
      </p>

      {/* Title */}
      <h1 className="font-display font-light text-[#E8E8E8] leading-none mb-4"
        style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', letterSpacing: '-0.04em' }}>
        {product.name}
      </h1>

      {/* Price */}
      <p className="font-display font-light text-[#4DFFB4] mb-6"
        style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}>
        {product.priceLabel}
      </p>

      {/* Spec tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {product.specs.map((spec) => (
          <span key={spec}
            className="font-sans font-light text-[#666666] border border-[#1C1C1C] px-4 py-1.5"
            style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            {spec}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="font-sans font-light text-[#666666] leading-relaxed mb-8"
        style={{ fontSize: '14px', maxWidth: '420px' }}>
        {product.description}
      </p>

      {/* Color selector */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="font-sans font-light text-[#444444] uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          Color
        </span>
        {/* Black */}
        <button onClick={() => onColorChange('black')}
          aria-label="Black" data-cursor="pointer"
          title="Black"
          style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1A1A1A', border: `2px solid ${selectedColor === 'black' ? '#4DFFB4' : 'transparent'}`, transition: 'border-color 0.2s ease', cursor: 'pointer' }}
        />
        {/* White — only if a white variant exists */}
        {hasWhite && (
          <button onClick={() => onColorChange('white')}
            aria-label="White" data-cursor="pointer"
            title="White"
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E8E8E8', border: `2px solid ${selectedColor === 'white' ? '#4DFFB4' : 'transparent'}`, transition: 'border-color 0.2s ease', cursor: 'pointer' }}
          />
        )}
      </div>

      {/* Stock indicator */}
      {stock !== null && (
        <div className="mb-6">
          {outOfStock ? (
            <p className="font-sans text-[#FF6B6B] uppercase flex items-center gap-2"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
              Out of stock
            </p>
          ) : lowStock ? (
            <p className="font-sans text-[#F59E0B] uppercase flex items-center gap-2"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              Only {stock} left
            </p>
          ) : (
            <p className="font-sans text-[#4DFFB4] uppercase flex items-center gap-2"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4DFFB4]" />
              In stock
            </p>
          )}
        </div>
      )}

      {/* Qty + Add to cart */}
      <div className="flex items-stretch gap-3 mb-6">
        {/* Qty */}
        <div className="flex items-center border border-[#1C1C1C]" style={{ opacity: outOfStock ? 0.3 : 1 }}>
          <button onClick={() => handleQtyChange(-1)} aria-label="Diminuer" data-cursor="pointer"
            disabled={outOfStock}
            className="px-3 py-4 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200 disabled:pointer-events-none">
            <Minus size={14} />
          </button>
          <span ref={qtyRef} className="font-sans font-light text-[#E8E8E8] px-4 inline-block"
            style={{ fontSize: '14px', minWidth: '28px', textAlign: 'center' }}>
            {qty}
          </span>
          <button onClick={() => handleQtyChange(1)} aria-label="Augmenter" data-cursor="pointer"
            disabled={outOfStock || qty >= maxQty}
            className="px-3 py-4 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-30">
            <Plus size={14} />
          </button>
        </div>

        {/* Add to cart */}
        <button
          ref={btnRef}
          onClick={handleAddToCart}
          disabled={!canAdd}
          data-cursor="pointer"
          aria-label={outOfStock ? 'Out of stock' : cartFull ? 'Max stock in cart' : `Ajouter ${product.name} au panier`}
          className="flex-1 font-sans font-medium uppercase transition-colors duration-300 relative overflow-hidden disabled:cursor-not-allowed"
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            background: outOfStock || cartFull ? '#1C1C1C' : added ? '#E8E8E8' : '#4DFFB4',
            color: outOfStock || cartFull ? '#444444' : '#000000',
          }}
        >
          <span ref={labelRef} className="inline-block">
            {outOfStock ? 'Out of stock' : cartFull ? 'Max in cart' : added ? 'Added ✓' : 'Add to cart'}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            const itemId = `${product.id}-${selectedColor}`
            if (isWished) {
              removeWishlist(itemId)
            } else {
              addToWishlist({
                id:    itemId,
                slug:  product.slug,
                name:  selectedColor === 'white' ? `${product.name} White` : product.name,
                price: product.price,
                image: selectedColor === 'white' ? product.images.white[0] : product.images.black[0],
              })
            }
          }}
          aria-label={isWished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          data-cursor="pointer"
          className="border border-[#1C1C1C] px-4 hover:border-[#4DFFB4] transition-colors duration-200"
          style={{ color: isWished ? '#4DFFB4' : '#666666' }}>
          <Heart size={16} strokeWidth={1.5} fill={isWished ? '#4DFFB4' : 'none'} />
        </button>
      </div>

      {/* Trust */}
      <p className="font-sans font-light text-[#333333] mb-8" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
        FREE SHIPPING · 30-DAY RETURNS · 2-YEAR WARRANTY
      </p>

      {/* Accordion specs */}
      <div className="border-t border-[#1C1C1C]">
        <button onClick={() => setOpenAccordion(o => !o)} data-cursor="pointer"
          className="w-full flex items-center justify-between py-4 font-sans font-light text-[#E8E8E8] hover:text-[#4DFFB4] transition-colors duration-200"
          style={{ fontSize: '12px', letterSpacing: '0.15em' }}
          aria-expanded={openAccordion}>
          <span>SPECIFICATIONS</span>
          <span style={{ transform: openAccordion ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease', fontSize: '18px', lineHeight: 1 }}>+</span>
        </button>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: openAccordion ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div className="pb-6 flex flex-col gap-3">
              {product.details.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="font-sans font-light text-[#444444]" style={{ fontSize: '12px', letterSpacing: '0.1em', minWidth: '100px' }}>
                    {label}
                  </span>
                  <span className="font-sans font-light text-[#666666] text-right" style={{ fontSize: '12px' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
