'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const STATS = [
  { value: 3,  suffix: '',  label: 'Instruments',        sub: 'Depth over breadth — always.' },
  { value: 72, suffix: 'H', label: 'To sell out',        sub: 'VØID Pro launch, 2023.' },
  { value: 4,  suffix: '+', label: 'Years of obsession', sub: 'Founded Paris, 2021.' },
]

const VALUES = [
  { n: '01', title: 'Silence.',          body: "We don't mask noise. We eliminate it. Every material, every joint, every driver is chosen with one question: does this make it quieter?" },
  { n: '02', title: 'Craft.',            body: 'We prototype in-house. We reject 90% of components before production. The remaining 10% are the ones you hear.' },
  { n: '03', title: 'Zero\ncompromise.', body: "Three products. Not thirty. If we can't make it the best, we don't make it at all." },
]

const TIMELINE = [
  { year: '2021', label: 'Founded',         desc: 'Two acoustic engineers. One obsession.' },
  { year: '2022', label: 'First prototype', desc: 'Eighteen months of silence. One headphone.' },
  { year: '2023', label: 'VØID Pro',        desc: '€890. Sold out in 72 hours.' },
  { year: '2025', label: 'AW25 Collection', desc: 'Three instruments. Perfected.' },
]

const TICKER = ['SILENCE', 'CRAFT', 'ZERO COMPROMISE', '3 PRODUCTS', '72H SOLD OUT', 'PARIS, FR', 'EST. 2021']

export default function AboutPage() {
  const heroRef     = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero SplitText ── */
      const split = new SplitText(heroRef.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
      gsap.from(split.chars, { yPercent: 110, opacity: 0, stagger: 0.025, duration: 1.2, ease: 'expo.out', delay: 0.3 })

      /* ── Subtitle clip-path reveal ── */
      gsap.set(subtitleRef.current, { clipPath: 'inset(0 100% 0 0)' })
      gsap.to(subtitleRef.current,  { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out', delay: 0.9 })

      /* ── Stat counters ── */
      STATS.forEach((stat, i) => {
        const el = counterRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.value, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate() { el.textContent = Math.round(obj.val).toString() },
        })
      })

      /* ── Scroll reveals ── */
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      return () => split.revert()
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="relative z-10 bg-[#000000]" style={{ overflowX: 'clip' }} aria-label="À propos de VØID">

      {/* ─────── HERO ─────── */}
      <section className="relative min-h-screen flex flex-col justify-end px-8 md:px-16 pb-16 pt-32 border-b border-[#1C1C1C] overflow-hidden">
        {/* Background watermark */}
        <span aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-4vw] top-1/2 -translate-y-1/2 leading-none font-display font-light"
          style={{ color: 'transparent', WebkitTextStroke: '1px #0C0C0C', fontSize: 'clamp(28vw, 38vw, 46vw)', letterSpacing: '-0.05em' }}>
          VØID
        </span>

        <p className="font-mono text-[#4DFFB4] uppercase mb-10 relative z-10"
          style={{ fontSize: '10px', letterSpacing: '0.35em' }}>
          EST. MMXXI &nbsp;·&nbsp; PARIS, FR
        </p>

        <h1 ref={heroRef}
          className="font-display font-light text-[#E8E8E8] leading-none mb-12 relative z-10"
          style={{ fontSize: 'clamp(4.5rem, 12vw, 13rem)', letterSpacing: '-0.045em' }}>
          We build<br />instruments.
        </h1>

        <div className="flex items-end justify-between gap-8 relative z-10">
          <p ref={subtitleRef}
            className="font-sans font-light text-[#666666] leading-relaxed max-w-sm"
            style={{ fontSize: '14px' }}>
            Born from a conviction: premium audio should never ask for compromise.
            Three products. Perfected.
          </p>
          <span className="hidden md:flex items-center gap-3 font-mono text-[#3A3A3A] shrink-0"
            style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            <span className="inline-block w-8 h-px bg-[#4DFFB4]" />
            AW25 COLLECTION
          </span>
        </div>
      </section>

      {/* ─────── TICKER ─────── */}
      <div className="py-5 border-b border-[#1C1C1C] overflow-hidden bg-[#040404]" aria-hidden="true">
        <div
          className="flex whitespace-nowrap"
          style={{
            width: 'max-content',
            '--marquee-offset': '-50%',
            animation: 'scroll-left 28s linear infinite',
          } as React.CSSProperties}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="font-mono text-[#4DFFB4] uppercase inline-flex items-center gap-8 px-8"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
              {item}
              <span className="inline-block w-1 h-1 rounded-full bg-[#4DFFB4] opacity-30" />
            </span>
          ))}
        </div>
      </div>

      {/* ─────── MANIFESTO ─────── */}
      <section className="relative px-8 md:px-16 py-28 border-b border-[#1C1C1C] overflow-hidden" data-reveal>
        <span aria-hidden="true"
          className="absolute -top-6 left-4 font-display font-light pointer-events-none select-none"
          style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px #090909', letterSpacing: '-0.05em' }}>
          "
        </span>
        <p className="font-display font-light text-[#E8E8E8] leading-tight relative z-10 max-w-5xl"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)', letterSpacing: '-0.035em' }}>
          Sound has a shape. Our job is to remove everything that distorts it.
        </p>
        <div className="flex items-center gap-4 mt-10 relative z-10">
          <div className="w-6 h-px bg-[#4DFFB4]" />
          <p className="font-mono text-[#555555]" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
            VØID FOUNDING MANIFESTO — 2021
          </p>
        </div>
      </section>

      {/* ─────── STATS ─────── */}
      <section className="border-b border-[#1C1C1C]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1C1C1C]">
          {STATS.map((stat, i) => (
            <div key={i} className="px-8 md:px-14 py-16 flex flex-col gap-4" data-reveal>
              <div className="font-display font-light leading-none"
                style={{ fontSize: 'clamp(4.5rem, 10vw, 9rem)', letterSpacing: '-0.05em' }}>
                <span ref={(el) => { counterRefs.current[i] = el }} className="text-[#E8E8E8]">0</span>
                <span className="text-[#4DFFB4]">{stat.suffix}</span>
              </div>
              <p className="font-mono text-[#666666] uppercase" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                {stat.label}
              </p>
              <p className="font-sans font-light text-[#555555]" style={{ fontSize: '12px' }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────── VALUES ─────── */}
      <section className="border-b border-[#1C1C1C]">
        <div className="px-8 md:px-16 py-5 border-b border-[#1C1C1C]">
          <p className="font-mono text-[#4DFFB4] uppercase" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
            Our values
          </p>
        </div>

        {VALUES.map(({ n, title, body }) => (
          <div key={n}
            className="grid grid-cols-1 md:grid-cols-[64px_1fr_1fr] border-b border-[#1C1C1C] last:border-0 group hover:bg-[#030303] transition-colors duration-500"
            data-reveal>
            <div className="px-8 pt-10 md:pt-14">
              <span className="font-mono text-[#1C1C1C] group-hover:text-[#4DFFB4] transition-colors duration-500"
                style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                {n}
              </span>
            </div>
            <div className="px-8 md:pl-0 pb-6 md:py-14 flex items-center md:border-r border-[#1C1C1C]">
              <h2 className="font-display font-light text-[#E8E8E8] whitespace-pre-line"
                style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', letterSpacing: '-0.045em', lineHeight: 0.88 }}>
                {title}
              </h2>
            </div>
            <div className="px-8 md:pl-12 pb-10 md:py-14 flex items-center">
              <p className="font-sans font-light text-[#555555] leading-relaxed group-hover:text-[#888888] transition-colors duration-500 max-w-md"
                style={{ fontSize: '14px' }}>
                {body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ─────── PHILOSOPHY ─────── */}
      <section className="px-8 md:px-16 py-28 border-b border-[#1C1C1C] bg-[#040404]" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-end">
          <div>
            <p className="font-mono text-[#4DFFB4] uppercase mb-12"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
              Philosophy
            </p>
            <h2 className="font-display font-light text-[#E8E8E8]"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', letterSpacing: '-0.04em', lineHeight: 0.88 }}>
              Two engineers.<br />One obsession.
            </h2>
          </div>
          <div className="flex flex-col gap-6 border-l border-[#1C1C1C] pl-10">
            <p className="font-sans font-light text-[#666666] leading-relaxed" style={{ fontSize: '15px' }}>
              VØID was founded in Paris by two acoustic engineers who believed the industry
              had forgotten what mattered: the sound.
            </p>
            <p className="font-sans font-light text-[#555555] leading-relaxed" style={{ fontSize: '15px' }}>
              Everything we make is prototyped in our studio. Every component is chosen by ear,
              not spreadsheet. We answer to our listeners — not to shareholders.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-6 h-px bg-[#4DFFB4]" />
              <span className="font-mono text-[#444444]" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
                PARIS, FRANCE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── TIMELINE ─────── */}
      <section className="px-8 md:px-16 py-24 border-b border-[#1C1C1C]">
        <p className="font-mono text-[#4DFFB4] uppercase mb-16"
          style={{ fontSize: '10px', letterSpacing: '0.3em' }} data-reveal>
          Timeline
        </p>
        <div className="relative">
          <div className="absolute left-[52px] top-3 bottom-3 w-px bg-[#1C1C1C] hidden md:block" />
          {TIMELINE.map(({ year, label, desc }) => (
            <div key={year}
              className="flex items-start gap-6 md:gap-12 py-10 border-b border-[#1C1C1C] last:border-0 group"
              data-reveal>
              <div className="hidden md:block shrink-0 relative z-10" style={{ marginLeft: '44px', paddingTop: '8px' }}>
                <div className="w-2 h-2 border border-[#252525] group-hover:border-[#4DFFB4] bg-[#000000] transition-colors duration-400" />
              </div>
              <span className="font-mono text-[#555555] shrink-0 pt-1"
                style={{ fontSize: '11px', letterSpacing: '0.1em', minWidth: '36px' }}>
                {year}
              </span>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-16 flex-1">
                <span className="font-display font-light text-[#E8E8E8] shrink-0"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.035em', minWidth: '260px' }}>
                  {label}
                </span>
                <span className="font-sans font-light text-[#555555] group-hover:text-[#888888] transition-colors duration-300"
                  style={{ fontSize: '14px' }}>
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="px-8 md:px-16 py-32 flex flex-col md:flex-row md:items-end justify-between gap-12" data-reveal>
        <div>
          <p className="font-mono text-[#3A3A3A] uppercase mb-8" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
            AW25 Collection
          </p>
          <h2 className="font-display font-light text-[#E8E8E8]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)', letterSpacing: '-0.045em', lineHeight: 0.88 }}>
            Hear the<br />difference.
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
          <Link href="/collection" data-cursor="pointer"
            className="font-sans font-medium text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300 uppercase px-14 py-5"
            style={{ fontSize: '11px', letterSpacing: '0.3em' }}>
            Shop the collection →
          </Link>
          <p className="font-mono text-[#444444]" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
            FREE SHIPPING FROM €500
          </p>
        </div>
      </section>

    </main>
  )
}
