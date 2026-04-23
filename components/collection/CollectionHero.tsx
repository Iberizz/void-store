'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export default function CollectionHero() {
  const watermarkRef = useRef<HTMLHeadingElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)
  const specsRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wm    = watermarkRef.current
    const img   = imgRef.current
    const specs = specsRef.current
    if (!wm || !img || !specs) return

    const ctx = gsap.context(() => {
      const split = new SplitText(wm, { type: 'chars' })
      gsap.from(split.chars, { y: -60, opacity: 0, stagger: 0.04, duration: 1, ease: 'expo.out' })
      gsap.from(img, { scale: 0.85, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 })
      gsap.from(Array.from(specs.children), { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.6 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-[#1C1C1C]" style={{ height: '100vh', background: '#000' }}>

      {/* ── Watermark "AW25" ── */}
      <h2
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{ fontSize: 'clamp(20vw, 26vw, 32vw)', fontWeight: 300, letterSpacing: '-0.05em', color: '#E8E8E8', opacity: 0.04, zIndex: 1 }}
        aria-hidden="true"
      >
        AW25
      </h2>

      {/* ── Casque centré ── */}
      <div ref={imgRef} className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(520px, 92vw, 940px)', height: 'clamp(520px, 92vw, 940px)', zIndex: 2 }}>
        <Image src="/images/void-pro-transparent.png" alt="VØID Pro" fill style={{ objectFit: 'contain' }} priority />
      </div>

      {/* ── Specs flottantes — desktop : gauche/droite · mobile : bas ── */}

      {/* Desktop uniquement */}
      <div ref={specsRef} className="hidden sm:block" style={{ zIndex: 4 }}>
        <div className="absolute" style={{ left: 48, top: '50%', transform: 'translateY(-50%)' }}>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Audio technology</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1 mb-4" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>Beryllium</p>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Noise control</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>ANC −42dB</p>
        </div>
        <div className="absolute text-right" style={{ right: 48, top: '50%', transform: 'translateY(-50%)' }}>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Battery life</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1 mb-4" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>48 hours</p>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Drivers</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>40mm Dual</p>
        </div>
      </div>

      {/* Mobile uniquement — 4 specs en grille 2×2 en bas */}
      <div className="sm:hidden absolute bottom-8 left-0 right-0 grid grid-cols-2 px-8 gap-y-4" style={{ zIndex: 4 }}>
        <div>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Audio technology</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>Beryllium</p>
        </div>
        <div className="text-right">
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Battery life</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>48 hours</p>
        </div>
        <div>
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Noise control</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>ANC −42dB</p>
        </div>
        <div className="text-right">
          <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Drivers</p>
          <p className="font-sans font-light uppercase text-[#4DFFB4] mt-1" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>40mm Dual</p>
        </div>
      </div>

      {/* ── Title block — top left ── */}
      <div className="absolute" style={{ top: 32, left: 32, zIndex: 4 }}>
        <p className="font-sans font-light uppercase text-[#4DFFB4]" style={{ fontSize: '9px', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>AW25</p>
        <h1 className="font-display font-light text-[#E8E8E8]" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.03em' }}>The Collection</h1>
      </div>

      {/* ── Count — top right ── */}
      <div className="absolute text-right" style={{ top: 32, right: 32, zIndex: 4 }}>
        <p className="font-sans font-light uppercase text-[#666666]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>6 instruments</p>
        <p className="font-sans font-light uppercase text-[#666666] mt-1" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>Engineered for silence</p>
      </div>

    </section>
  )
}
