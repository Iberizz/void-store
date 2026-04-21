'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProduct() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image   = imageRef.current
    const overlay = overlayRef.current
    if (!section || !image || !overlay) return

    const ctx = gsap.context(() => {
      /* Mount — image scale in */
      gsap.fromTo(
        image,
        { scale: 1.1 },
        { scale: 1.05, duration: 1.8, ease: 'power3.out' }
      )

      /* ScrollTrigger — parallax subtil sur l'image */
      gsap.to(image, {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      /* Overlay — stagger révèle les enfants */
      gsap.from(Array.from(overlay.children), {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#000000]"
    >
      {/* Image — fill + object-contain, casque centré */}
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/images/headphone-hero.png"
          alt="VØID 001 — Wireless headphones premium"
          fill
          className="object-contain"
          style={{ transform: 'scale(1.1)' }}
        />
      </div>

      {/* Gradient overlay — transparent → noir sur 60% bas */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '60%',
          background: 'linear-gradient(to bottom, transparent, #000000)',
        }}
        aria-hidden="true"
      />

      {/* Overlay texte */}
      <div
        ref={overlayRef}
        className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 flex flex-col gap-6"
      >
        {/* Eyebrow */}
        <span className="font-sans font-light text-xs tracking-[0.2em] text-[#666666] uppercase">
          VØID — 001
        </span>

        {/* Titre */}
        <h2
          className="font-display text-5xl md:text-7xl lg:text-8xl text-[#E8E8E8] max-w-3xl leading-none"
          style={{ letterSpacing: '-0.03em' }}
        >
          Not headphones.<br />A decision.
        </h2>

        {/* Row bas */}
        <div className="flex justify-between items-end pt-4">
          {/* Gauche — prix + specs */}
          <div className="flex flex-col gap-2">
            <p className="font-display text-4xl text-[#E8E8E8]">€ 349</p>
            <p className="font-sans font-light text-xs tracking-widest text-[#666666] uppercase">
              40h
              <span className="mx-2" style={{ color: '#4DFFB4' }} aria-hidden="true">·</span>
              ANC
              <span className="mx-2" style={{ color: '#4DFFB4' }} aria-hidden="true">·</span>
              Beryllium
            </p>
          </div>

          {/* Droite — CTAs */}
          <div className="flex items-center">
            <button
              className="font-sans font-normal text-sm text-[#E8E8E8] border border-[#E8E8E8] px-8 py-4 transition-colors duration-300 hover:bg-[#E8E8E8] hover:text-[#000000]"
              data-cursor="pointer"
              aria-label="Ajouter VØID 001 au panier"
            >
              Add to cart
            </button>
            <Link
              href="/product/void-001"
              className="font-sans font-light text-sm text-[#666666] hover:text-[#E8E8E8] transition-colors duration-300 ml-6"
              data-cursor="pointer"
              aria-label="Voir les détails du produit VØID 001"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
