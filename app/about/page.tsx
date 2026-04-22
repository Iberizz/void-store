'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const VALUES = [
  {
    number: '01',
    title:  'Silence',
    body:   'We don\'t mask noise. We eliminate it. Every material, every joint, every driver placement is chosen with one question: does this make it quieter?',
  },
  {
    number: '02',
    title:  'Craft',
    body:   'We prototype in-house. We reject 90% of components before they reach production. The remaining 10% are the ones you hear.',
  },
  {
    number: '03',
    title:  'Zero compromise',
    body:   'We make three products. Not thirty. Depth over breadth — always. If we can\'t make it the best, we don\'t make it at all.',
  },
]

const TIMELINE = [
  { year: '2021', label: 'Founded', desc: 'Two acoustic engineers, one obsession.' },
  { year: '2022', label: 'First prototype', desc: 'Eighteen months of listening. One headphone.' },
  { year: '2023', label: 'VØID Pro launched', desc: '€890. Sold out in 72 hours.' },
  { year: '2025', label: 'AW25 Collection', desc: 'Three instruments. Perfected.' },
]

export default function AboutPage() {
  const heroRef    = useRef<HTMLHeadingElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title
      const split = new SplitText(heroRef.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
      gsap.from(split.chars, { y: 100, opacity: 0, stagger: 0.025, duration: 1.1, ease: 'expo.out', delay: 0.2 })

      // Sections stagger
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })

      return () => split.revert()
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="relative z-10 bg-[#000000]" aria-label="À propos de VØID">

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col justify-end px-8 md:px-16 pb-16 pt-32 border-b border-[#1C1C1C]">
        <p className="font-sans font-light text-[#4DFFB4] uppercase mb-6" data-reveal
          style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
          About VØID
        </p>
        <h1 ref={heroRef} className="font-display font-light text-[#E8E8E8] leading-none mb-10"
          style={{ fontSize: 'clamp(4rem, 10vw, 11rem)', letterSpacing: '-0.04em' }}>
          We build<br />instruments.
        </h1>
        <p className="font-sans font-light text-[#666666] leading-relaxed max-w-lg"
          style={{ fontSize: '16px' }} data-reveal>
          VØID was born from a simple conviction: premium audio shouldn't require compromise.
          We make fewer products, better. Three instruments. Perfected.
        </p>
      </section>

      {/* ── Manifesto strip ── */}
      <section className="px-8 md:px-16 py-20 border-b border-[#1C1C1C]" data-reveal>
        <p className="font-display font-light text-[#E8E8E8] leading-tight max-w-4xl"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.03em' }}>
          "Sound has a shape. Our job is to remove everything that distorts it."
        </p>
        <p className="font-sans font-light text-[#444444] mt-6" style={{ fontSize: '12px', letterSpacing: '0.15em' }}>
          — VØID Founding Manifesto, 2021
        </p>
      </section>

      {/* ── Values ── */}
      <section className="px-8 md:px-16 py-24 border-b border-[#1C1C1C]">
        <p className="font-sans font-light text-[#4DFFB4] uppercase mb-16" data-reveal
          style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
          Our values
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1C1C]">
          {VALUES.map(({ number, title, body }) => (
            <div key={number} className="bg-[#000000] p-10 flex flex-col gap-6" data-reveal>
              <span className="font-mono text-[#333333]" style={{ fontSize: '11px' }}>{number}</span>
              <h2 className="font-display font-light text-[#E8E8E8]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}>
                {title}
              </h2>
              <p className="font-sans font-light text-[#444444] leading-relaxed" style={{ fontSize: '14px' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-8 md:px-16 py-24 border-b border-[#1C1C1C]">
        <p className="font-sans font-light text-[#4DFFB4] uppercase mb-16" data-reveal
          style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
          Timeline
        </p>
        <div className="flex flex-col divide-y divide-[#1C1C1C]">
          {TIMELINE.map(({ year, label, desc }) => (
            <div key={year} className="flex items-start gap-12 py-8" data-reveal>
              <span className="font-mono text-[#333333] shrink-0 w-12" style={{ fontSize: '12px' }}>{year}</span>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 flex-1">
                <span className="font-display font-light text-[#E8E8E8]"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', minWidth: '260px' }}>
                  {label}
                </span>
                <span className="font-sans font-light text-[#444444]" style={{ fontSize: '14px' }}>
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 md:px-16 py-24 flex flex-col md:flex-row md:items-center justify-between gap-10" data-reveal>
        <h2 className="font-display font-light text-[#E8E8E8] leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.04em' }}>
          Hear the difference.
        </h2>
        <Link href="/collection" data-cursor="pointer"
          className="shrink-0 font-sans font-medium text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300 uppercase px-12 py-5"
          style={{ fontSize: '11px', letterSpacing: '0.25em' }}>
          Shop the collection →
        </Link>
      </section>

    </main>
  )
}
