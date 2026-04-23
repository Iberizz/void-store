'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { useCartStore } from '@/lib/store'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()
  const drawerRef  = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const subtotal     = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const freeShipping = subtotal >= 500
  const itemCount    = items.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    const drawer  = drawerRef.current
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!drawer || !overlay) return

    if (isOpen) {
      gsap.set(drawer, { display: 'flex' })
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(drawer,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'expo.out' }
      )
      gsap.from(Array.from(content?.children ?? []), {
        opacity: 0, y: 16, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.2,
      })
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' })
      gsap.to(drawer,  {
        x: '100%', duration: 0.45, ease: 'expo.in',
        onComplete: () => gsap.set(drawer, { display: 'none' }),
      })
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 z-[60]"
        style={{ opacity: 0, display: isOpen ? 'block' : 'none' }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[70] flex flex-col bg-[#080808] border-l border-[#1C1C1C]"
        style={{ width: 'min(440px, 100vw)', display: 'none', transform: 'translateX(100%)' }}
        aria-label="Panier VØID"
        role="dialog"
        aria-modal="true"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} strokeWidth={1.5} className="text-[#666666]" />
            <span className="font-sans font-light text-[#E8E8E8] uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
              Cart
            </span>
            {itemCount > 0 && (
              <span className="font-sans font-light text-[#4DFFB4]"
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                ({itemCount})
              </span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Fermer le panier" data-cursor="pointer"
            className="text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex flex-col flex-1 overflow-hidden">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              <div style={{ opacity: 0.15 }}>
                <ShoppingBag size={48} strokeWidth={1} className="text-[#E8E8E8]" />
              </div>
              <div className="text-center">
                <p className="font-display font-light text-[#E8E8E8] mb-2"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.03em' }}>
                  Your void is empty.
                </p>
                <p className="font-sans font-light text-[#444444]" style={{ fontSize: '13px' }}>
                  Nothing here yet.
                </p>
              </div>
              <Link href="/collection" onClick={closeCart} data-cursor="pointer"
                className="font-sans font-light text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300 uppercase px-8 py-3.5"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
                Explore collection
              </Link>
            </div>
          ) : (
            <>
              {/* Items list */}
              <ul className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6" role="list">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 pb-6 border-b border-[#1C1C1C] last:border-0">
                    {/* Image */}
                    <div className="relative shrink-0 bg-[#0F0F0F] border border-[#1C1C1C]"
                      style={{ width: '80px', height: '80px' }}>
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-sans font-light text-[#E8E8E8]" style={{ fontSize: '13px' }}>
                            {item.name}
                          </p>
                          <p className="font-sans font-light text-[#4DFFB4] mt-1"
                            style={{ fontSize: '13px', letterSpacing: '0.05em' }}>
                            €{item.price.toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <button onClick={() => removeItem(item.id)} aria-label={`Supprimer ${item.name}`}
                          data-cursor="pointer"
                          className="text-[#333333] hover:text-[#E8E8E8] transition-colors duration-200 mt-0.5">
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Qty */}
                      <div className="flex items-center border border-[#1C1C1C] w-fit">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuer" data-cursor="pointer"
                          className="px-2.5 py-1.5 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200">
                          <Minus size={12} />
                        </button>
                        <span className="font-sans font-light text-[#E8E8E8] px-3"
                          style={{ fontSize: '12px' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Augmenter" data-cursor="pointer"
                          className="px-2.5 py-1.5 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-[#1C1C1C] flex flex-col gap-4">
                {/* Shipping notice */}
                <div className="flex items-center justify-between">
                  <span className="font-sans font-light text-[#444444]" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                    {freeShipping ? '✓ Free shipping included' : `Add €${(500 - subtotal).toLocaleString('fr-FR')} for free shipping`}
                  </span>
                </div>

                {/* Progress bar */}
                {!freeShipping && (
                  <div className="w-full h-px bg-[#1C1C1C] overflow-hidden">
                    <div className="h-full bg-[#4DFFB4] transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between py-2">
                  <span className="font-sans font-light text-[#666666] uppercase"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}>Subtotal</span>
                  <span className="font-display font-light text-[#E8E8E8]"
                    style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                    €{subtotal.toLocaleString('fr-FR')}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-[#4DFFB4] hover:bg-[#E8E8E8] text-[#000000] font-sans font-medium uppercase transition-colors duration-300 py-4 text-center block"
                  style={{ fontSize: '11px', letterSpacing: '0.25em' }}
                  data-cursor="pointer"
                  aria-label="Passer la commande"
                >
                  Checkout — €{subtotal.toLocaleString('fr-FR')}
                </Link>

                <p className="font-sans font-light text-[#333333] text-center"
                  style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                  30-DAY RETURNS · 2-YEAR WARRANTY
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
