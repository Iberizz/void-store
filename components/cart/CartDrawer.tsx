'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { useCartStore } from '@/lib/store'
import { PRODUCTS_DATA } from '@/lib/products'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, addItem } = useCartStore()
  const drawerRef      = useRef<HTMLDivElement>(null)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const contentRef     = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const subtotal     = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const freeShipping = subtotal >= 500
  const itemCount    = items.reduce((sum, i) => sum + i.quantity, 0)

  // Track every slug seen while the drawer is open — prevents removed items
  // from immediately bouncing back into suggestions
  const [seenSlugs, setSeenSlugs] = useState<Set<string>>(new Set())
  // Shuffled order, re-randomized each time the drawer opens
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) { setSeenSlugs(new Set()); return }
    // Shuffle product keys on open
    const keys = Object.keys(PRODUCTS_DATA).sort(() => Math.random() - 0.5)
    setShuffledKeys(keys)
    setSeenSlugs(prev => {
      const next = new Set(prev)
      items.forEach(i => next.add(i.slug))
      return next
    })
  }, [isOpen]) // intentionally omit `items` — shuffle only on open, not on every cart change

  const cartSlugs   = new Set(items.map(i => i.slug))
  const suggestions = shuffledKeys
    .map(k => PRODUCTS_DATA[k])
    .filter(p => p && !cartSlugs.has(p.slug) && !seenSlugs.has(p.slug))
    .slice(0, 3)

  useEffect(() => {
    const drawer  = drawerRef.current
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!drawer || !overlay) return

    if (isOpen) {
      const contentChildren    = Array.from(content?.children ?? [])
      const suggestionChildren = Array.from(suggestionsRef.current?.children ?? [])

      // Kill any running tweens to prevent stacked/ghost animations
      gsap.killTweensOf([drawer, overlay, ...contentChildren, ...suggestionChildren])

      // Reset children to clean state before animating in
      gsap.set(contentChildren,    { opacity: 1, y: 0, clearProps: 'all' })
      gsap.set(suggestionChildren, { opacity: 1, x: 0, clearProps: 'all' })

      gsap.set(drawer, { display: 'flex' })
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(drawer,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'expo.out' }
      )
      gsap.from(contentChildren, {
        opacity: 0, y: 16, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.2,
      })
      if (suggestionChildren.length > 0) {
        gsap.from(suggestionChildren, {
          opacity: 0, x: -12, stagger: 0.07, duration: 0.45, ease: 'power2.out', delay: 0.35,
        })
      }
    } else {
      gsap.killTweensOf([drawer, overlay])
      gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' })
      gsap.to(drawer, {
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

      {/* Drawer — wider to accommodate suggestions panel */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[70] flex flex-row bg-[#080808] border-l border-[#1C1C1C] overscroll-contain"
        style={{
          width: items.length > 0 ? 'min(720px, 100vw)' : 'min(440px, 100vw)',
          display: 'none',
          transform: 'translateX(100%)',
        }}
        aria-label="Panier VØID"
        role="dialog"
        aria-modal="true"
      >

        {/* ── Suggestions sidebar — desktop only, visible when cart has items ── */}
        {items.length > 0 && suggestions.length > 0 && (
          <aside
            className="hidden md:flex flex-col border-r border-[#1C1C1C] shrink-0"
            style={{ width: '260px' }}
            aria-label="Suggestions"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-[#1C1C1C]">
              <p className="font-sans text-[#4DFFB4] uppercase"
                style={{ fontSize: '9px', letterSpacing: '0.3em' }}>
                Complete your setup
              </p>
            </div>

            {/* Suggestion cards */}
            <div ref={suggestionsRef} className="flex flex-col divide-y divide-[#1C1C1C] overflow-y-auto flex-1">
              {suggestions.map((product) => (
                <div key={product.id} className="group flex flex-col px-5 py-5 gap-3 hover:bg-[#0A0A0A] transition-colors duration-300">
                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeCart}
                    data-cursor="pointer"
                    className="relative w-full aspect-square bg-[#0F0F0F] border border-[#1C1C1C] group-hover:border-[#2A2A2A] transition-colors duration-300 overflow-hidden"
                    aria-label={`Voir ${product.name}`}
                  >
                    <Image
                      src={product.images.black[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="220px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans font-light text-[#E8E8E8]" style={{ fontSize: '12px' }}>
                        {product.name}
                      </span>
                      <span className="font-sans font-light text-[#4DFFB4]" style={{ fontSize: '12px' }}>
                        {product.priceLabel}
                      </span>
                    </div>
                    <button
                      onClick={() => addItem({
                        id:       `${product.id}-black`,
                        slug:     product.slug,
                        name:     product.name,
                        price:    product.price,
                        quantity: 1,
                        image:    product.images.black[0],
                      })}
                      aria-label={`Ajouter ${product.name} au panier`}
                      data-cursor="pointer"
                      className="shrink-0 w-7 h-7 flex items-center justify-center border border-[#2A2A2A] text-[#666666] hover:border-[#4DFFB4] hover:text-[#4DFFB4] transition-colors duration-200"
                    >
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Specs */}
                  <p className="font-sans text-[#2A2A2A] truncate" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                    {product.specs.join(' · ')}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer label */}
            <div className="px-6 py-4 border-t border-[#1C1C1C]">
              <p className="font-sans text-[#1E1E1E]" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                AW25 — VØID COLLECTION
              </p>
            </div>
          </aside>
        )}

        {/* ── Main cart panel ── */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#080808]">

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
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        data-cursor="pointer"
                        className="relative shrink-0 bg-[#0F0F0F] border border-[#1C1C1C] hover:border-[#4DFFB4] transition-colors duration-200"
                        style={{ width: '80px', height: '80px' }}
                        aria-label={`Voir ${item.name}`}
                      >
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeCart}
                              data-cursor="pointer"
                              className="font-sans font-light text-[#E8E8E8] hover:text-[#4DFFB4] transition-colors duration-200"
                              style={{ fontSize: '13px' }}
                            >
                              {item.name}
                            </Link>
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
                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                            className="px-2.5 py-1.5 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200 disabled:opacity-20 disabled:pointer-events-none">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Mobile suggestions strip */}
                {suggestions.length > 0 && (
                  <div className="md:hidden px-8 pb-4 border-t border-[#1C1C1C] pt-4">
                    <p className="font-sans text-[#4DFFB4] uppercase mb-3"
                      style={{ fontSize: '9px', letterSpacing: '0.3em' }}>
                      Complete your setup
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                      {suggestions.map((product) => (
                        <div key={product.id} className="flex flex-col gap-2 shrink-0" style={{ width: '100px' }}>
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={closeCart}
                            data-cursor="pointer"
                            className="relative w-full aspect-square bg-[#0F0F0F] border border-[#1C1C1C] overflow-hidden"
                            aria-label={product.name}
                          >
                            <Image
                              src={product.images.black[0]}
                              alt={product.name}
                              fill
                              className="object-contain p-3"
                              sizes="100px"
                            />
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[#E8E8E8] truncate" style={{ fontSize: '10px' }}>
                              {product.name}
                            </span>
                            <button
                              onClick={() => addItem({
                                id:       `${product.id}-black`,
                                slug:     product.slug,
                                name:     product.name,
                                price:    product.price,
                                quantity: 1,
                                image:    product.images.black[0],
                              })}
                              aria-label={`Ajouter ${product.name}`}
                              data-cursor="pointer"
                              className="shrink-0 w-5 h-5 flex items-center justify-center border border-[#2A2A2A] text-[#666666] hover:border-[#4DFFB4] hover:text-[#4DFFB4] transition-colors duration-200"
                            >
                              <Plus size={10} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-8 py-6 border-t border-[#1C1C1C] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-light text-[#444444]" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                      {freeShipping ? '✓ Free shipping included' : `Add €${(500 - subtotal).toLocaleString('fr-FR')} for free shipping`}
                    </span>
                  </div>

                  {!freeShipping && (
                    <div className="w-full h-px bg-[#1C1C1C] overflow-hidden">
                      <div className="h-full bg-[#4DFFB4] transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2">
                    <span className="font-sans font-light text-[#666666] uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.2em' }}>Subtotal</span>
                    <span className="font-display font-light text-[#E8E8E8]"
                      style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                      €{subtotal.toLocaleString('fr-FR')}
                    </span>
                  </div>

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
      </div>
    </>
  )
}
