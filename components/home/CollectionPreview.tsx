'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useCartStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ─── Data ───────────────────────────────────────────────── */

interface Product {
  id: string
  ref: string
  name: string
  price: number
  priceLabel: string
  tag: string
  slug: string
}

const PRODUCTS: Product[] = [
  { id: 'void-pro',    ref: '001', name: 'VØID Pro',    price: 890,  priceLabel: '€890',   tag: 'Best Seller', slug: 'void-pro'    },
  { id: 'void-air',    ref: '002', name: 'VØID Air',    price: 590,  priceLabel: '€590',   tag: 'New',         slug: 'void-air'    },
  { id: 'void-studio', ref: '003', name: 'VØID Studio', price: 1290, priceLabel: '€1,290', tag: 'Limited',     slug: 'void-studio' },
]

/* ─── ProductCard ─────────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const cardRef      = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const addItem      = useCartStore((s) => s.addItem)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card      = cardRef.current
    const highlight = highlightRef.current
    if (!card || !highlight) return

    const rect = card.getBoundingClientRect()
    const x    = (e.clientX - rect.left)  / rect.width  - 0.5
    const y    = (e.clientY - rect.top)   / rect.height - 0.5

    gsap.to(card, {
      rotateY: x * 20,
      rotateX: -y * 12,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
      transformOrigin: 'center center',
    })

    gsap.set(highlight, {
      background: `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.06), transparent 60%)`,
    })
  }

  const onMouseEnter = () => {
    gsap.to(ctaRef.current, { y: '0%', duration: 0.35, ease: 'expo.out' })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
    gsap.to(ctaRef.current,  { y: '100%', duration: 0.3, ease: 'power2.in' })
    gsap.set(highlightRef.current, { background: 'transparent' })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block"
      data-cursor="pointer"
      aria-label={`${product.name} — ${product.priceLabel}`}
    >
      <div
        ref={cardRef}
        className="relative border border-[#1C1C1C] bg-[#0F0F0F] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Specular highlight */}
        <div
          ref={highlightRef}
          className="absolute inset-0 z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Image zone */}
        <div className="relative aspect-[3/4] bg-[#080808] overflow-hidden">
          {/* Tag */}
          <span className="absolute top-4 left-4 z-10 font-sans font-light text-[9px] tracking-[0.2em] text-[#4DFFB4] uppercase">
            {product.tag}
          </span>

          {/* Ref */}
          <span className="absolute top-4 right-4 z-10 font-mono text-[9px] text-[#333333]">
            {product.ref}
          </span>

          {/* Placeholder — replace with next/image when assets are ready */}
          <div className="absolute inset-0 flex items-center justify-center select-none" aria-hidden="true">
            <span
              className="font-display font-medium text-[#1C1C1C]"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.04em' }}
            >
              VØID
            </span>
          </div>

          {/* Add to cart — slide up on hover */}
          <div
            ref={ctaRef}
            className="absolute bottom-0 left-0 right-0 z-20 translate-y-full"
            aria-hidden="true"
          >
            <button
              className="w-full bg-[#E8E8E8] text-[#000000] font-sans font-normal text-sm tracking-wide px-6 py-4 text-left"
              onClick={handleAddToCart}
              tabIndex={-1}
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* Card footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#1C1C1C]">
          <span className="font-sans font-light text-sm text-[#E8E8E8]">
            {product.name}
          </span>
          <span
            className="font-display font-medium text-sm text-[#E8E8E8]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {product.priceLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Section ─────────────────────────────────────────────── */

export default function CollectionPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const cards = cardsRef.current
    if (!title || !cards) return

    const split = new SplitText(title, {
      type: 'chars',
      charsClass: 'inline-block overflow-hidden',
    })

    const ctx = gsap.context(() => {
      gsap.from(split.chars, {
        yPercent: 110,
        stagger: 0.04,
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          once: true,
        },
      })

      gsap.from(Array.from(cards.children), {
        opacity: 0,
        y: 48,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards,
          start: 'top 80%',
          once: true,
        },
      })
    }, sectionRef)

    return () => { split.revert(); ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-transparent py-24 md:py-32 px-8 md:px-16"
      aria-label="Collection VØID"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div className="flex flex-col gap-3">
          <span className="font-sans font-light text-[10px] tracking-[0.3em] text-[#4DFFB4] uppercase">
            AW25
          </span>
          <h2
            ref={titleRef}
            className="font-display font-medium text-[#E8E8E8] leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}
          >
            The Collection
          </h2>
        </div>

        <Link
          href="/collection"
          className="hidden md:block font-sans font-light text-sm text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200"
          data-cursor="pointer"
          aria-label="Voir toute la collection VØID"
        >
          View all →
        </Link>
      </div>

      {/* Grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile — View all */}
      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/collection"
          className="font-sans font-light text-sm text-[#666666] border border-[#333333] px-8 py-3 hover:text-[#E8E8E8] hover:border-[#666666] transition-colors duration-200"
          data-cursor="pointer"
        >
          View all
        </Link>
      </div>
    </section>
  )
}
