'use client'

import { useState, useRef } from 'react'
import { Heart, Plus, Minus } from 'lucide-react'
import gsap from 'gsap'
import { useCartStore } from '@/lib/store'
import type { ProductData } from '@/lib/products'

interface Props {
  product:         ProductData
  selectedColor:   'black' | 'white'
  onColorChange:   (c: 'black' | 'white') => void
}

export default function ProductInfo({ product, selectedColor, onColorChange }: Props) {
  const [qty,          setQty]          = useState(1)
  const [openAccordion, setOpenAccordion] = useState(false)
  const [wished,       setWished]       = useState(false)
  const btnRef   = useRef<HTMLButtonElement>(null)
  const addItem  = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAddToCart = () => {
    addItem({
      id:       `${product.id}-${selectedColor}`,
      slug:     product.slug,
      name:     `${product.name}${selectedColor === 'white' ? ' White' : ''}`,
      price:    product.price,
      quantity: qty,
      image:    product.images[selectedColor][0],
    })
    // Button flash
    gsap.to(btnRef.current, { scale: 0.96, duration: 0.1, ease: 'power2.in',
      onComplete: () => gsap.to(btnRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
    })
    openCart()
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
      <div className="flex items-center gap-4 mb-8">
        <span className="font-sans font-light text-[#444444] uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          Color
        </span>
        {(['black', 'white'] as const).map((c) => (
          <button key={c} onClick={() => onColorChange(c)}
            aria-label={`Couleur ${c}`} data-cursor="pointer"
            style={{
              width:  '20px', height: '20px',
              borderRadius: '50%',
              background:   c === 'black' ? '#1A1A1A' : '#E8E8E8',
              border:       `2px solid ${selectedColor === c ? '#4DFFB4' : 'transparent'}`,
              transition:   'border-color 0.2s ease',
              cursor:       'pointer',
            }}
          />
        ))}
      </div>

      {/* Qty + Add to cart */}
      <div className="flex items-stretch gap-3 mb-6">
        {/* Qty */}
        <div className="flex items-center border border-[#1C1C1C]">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuer" data-cursor="pointer"
            className="px-3 py-4 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200">
            <Minus size={14} />
          </button>
          <span className="font-sans font-light text-[#E8E8E8] px-4" style={{ fontSize: '14px' }}>
            {qty}
          </span>
          <button onClick={() => setQty(q => q + 1)} aria-label="Augmenter" data-cursor="pointer"
            className="px-3 py-4 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200">
            <Plus size={14} />
          </button>
        </div>

        {/* Add to cart */}
        <button ref={btnRef} onClick={handleAddToCart} data-cursor="pointer"
          aria-label={`Ajouter ${product.name} au panier`}
          className="flex-1 bg-[#4DFFB4] hover:bg-[#E8E8E8] text-[#000000] font-sans font-medium uppercase transition-colors duration-300"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
          Add to cart
        </button>

        {/* Wishlist */}
        <button onClick={() => setWished(w => !w)} aria-label="Ajouter aux favoris" data-cursor="pointer"
          className="border border-[#1C1C1C] px-4 hover:border-[#4DFFB4] transition-colors duration-200"
          style={{ color: wished ? '#4DFFB4' : '#666666' }}>
          <Heart size={16} strokeWidth={1.5} fill={wished ? '#4DFFB4' : 'none'} />
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
        {openAccordion && (
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
        )}
      </div>

    </div>
  )
}
