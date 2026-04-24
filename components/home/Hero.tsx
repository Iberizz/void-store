'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import MagneticButton from '@/components/shared/MagneticButton'

gsap.registerPlugin(SplitText)

const HEADLINE       = 'SILENCE.'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#%&*'
const ITEMS          = ['SILENCE', 'REDEFINED', 'PREMIUM AUDIO', 'AW25', 'ENGINEERED SOUND', 'VØID']

const SPECS = [
  { label: 'ANC',      value: '−42dB' },
  { label: 'Battery',  value: '48H'   },
  { label: 'Drivers',  value: '40MM'  },
]

/* ── Marquee row ── */
function MarqueeRow({ direction }: { direction: 'left' | 'right' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLUListElement>(null)
  const copiesRef    = useRef(3)
  const [copies, setCopies] = useState(3)

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const recalculate = () => {
      const trackWidth = track.scrollWidth
      if (!trackWidth) return
      const singleW   = trackWidth / copiesRef.current
      const newCopies = Math.ceil(window.innerWidth / singleW) + 2
      if (newCopies !== copiesRef.current) {
        copiesRef.current = newCopies
        setCopies(newCopies)
      }
    }
    const ro = new ResizeObserver(recalculate)
    ro.observe(container)
    recalculate()
    return () => ro.disconnect()
  }, [])

  const repeated = Array.from({ length: copies }, () => ITEMS).flat()
  const offset   = `${(100 / copies).toFixed(4)}%`

  return (
    <div ref={containerRef} className="overflow-hidden">
      <ul ref={trackRef} role="list"
        style={{
          display: 'flex', willChange: 'transform',
          '--marquee-offset': `-${offset}`,
          animation: `${direction === 'left' ? 'scroll-left' : 'scroll-right'} ${direction === 'left' ? '25s' : '35s'} linear infinite`,
        } as React.CSSProperties}>
        {repeated.map((item, i) => (
          <li key={i}
            className="flex items-center gap-6 shrink-0 font-sans font-light text-sm tracking-[0.15em] uppercase"
            style={{ color: '#444444' }}>
            {item}
            <span style={{ color: '#4DFFB4' }} aria-hidden="true">·</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Hero ── */
export default function Hero() {
  const badgeRef      = useRef<HTMLDivElement>(null)
  const headlineRef   = useRef<HTMLHeadingElement>(null)
  const subtitleRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const specsRef      = useRef<HTMLDivElement>(null)
  const scrollRef     = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)
  const marqueeRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const tickersRef    = useRef<Function[]>([])

  useEffect(() => {
    const headline = headlineRef.current
    if (!headline) return

    const split = new SplitText(headline, { type: 'chars', charsClass: 'inline-block' })
    const chars  = split.chars as HTMLElement[]
    const targets = chars.map(el => el.textContent ?? '')

    chars.forEach(char => {
      const mask = document.createElement('span')
      mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;'
      char.parentNode!.insertBefore(mask, char)
      mask.appendChild(char)
    })

    gsap.set(headline, { opacity: 1 })

    const ctx = gsap.context(() => {
      // Badge
      gsap.from(badgeRef.current, { opacity: 0, y: -10, duration: 0.6, delay: 0.2, ease: 'power2.out' })

      // Eyebrow
      gsap.from(eyebrowRef.current, { opacity: 0, y: 10, duration: 0.6, delay: 0.3, ease: 'power2.out' })

      // Headline scramble + slide up
      chars.forEach((charEl, i) => {
        const target = targets[i]
        gsap.delayedCall(0.4 + i * 0.03, () => {
          let t0: number | null = null
          const tick = (time: number) => {
            if (t0 === null) t0 = time
            const elapsed = time - t0
            if (elapsed < 0.8) {
              charEl.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            } else {
              charEl.textContent = target
              gsap.ticker.remove(tick)
              tickersRef.current = tickersRef.current.filter(fn => fn !== tick)
            }
          }
          gsap.ticker.add(tick)
          tickersRef.current.push(tick)
        })
      })
      gsap.from(chars, { yPercent: 110, stagger: 0.03, duration: 0.9, ease: 'power4.out', delay: 0.4 })

      // Subtitle
      gsap.from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.7, delay: 1.1, ease: 'power2.out' })

      // Floating specs (stagger right-to-left feel)
      if (specsRef.current) {
        gsap.from(Array.from(specsRef.current.children), {
          opacity: 0, x: 16, stagger: 0.08, duration: 0.6, delay: 1.3, ease: 'power2.out',
        })
      }

      // CTAs
      if (ctaRef.current) {
        gsap.from(Array.from(ctaRef.current.children), {
          opacity: 0, y: 16, stagger: 0.12, duration: 0.6, delay: 1.4, ease: 'power2.out',
        })
      }

      // Scroll indicator
      gsap.from(scrollRef.current, {
        opacity: 0, duration: 0.6, delay: 1.8, ease: 'power2.out',
        onComplete: () => {
          gsap.fromTo(scrollLineRef.current,
            { scaleY: 0, transformOrigin: 'top center', opacity: 1 },
            { scaleY: 1, transformOrigin: 'top center', opacity: 0, duration: 1.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.4 }
          )
        },
      })

      // Marquee
      gsap.from(marqueeRef.current, { opacity: 0, duration: 0.6, delay: 2.0, ease: 'power2.out' })
    })

    return () => {
      tickersRef.current.forEach(fn => gsap.ticker.remove(fn as gsap.TickerCallback))
      tickersRef.current = []
      split.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section className="relative z-10 min-h-screen overflow-hidden pointer-events-none flex flex-col" aria-label="Hero VØID">

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '70%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9) 65%, #000000)' }}
        aria-hidden="true" />

      {/* Badge */}
      <div ref={badgeRef} className="absolute top-24 left-8 md:left-16 border border-[#282828] px-5 py-2">
        <span className="font-sans font-light text-[10px] tracking-[0.3em] text-[#4DFFB4] uppercase">
          AW25 Collection
        </span>
      </div>

      {/* Product identifier — top right */}
      <div className="absolute top-24 right-8 md:right-16 hidden md:flex items-center gap-3">
        <span className="font-sans text-[#2A2A2A] text-[10px] tracking-[0.2em] uppercase">VØID PRO</span>
        <span className="w-4 h-px bg-[#2A2A2A]" />
        <span className="font-mono text-[#2A2A2A] text-[10px]">01 / 03</span>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none" aria-hidden="true">
        <span className="font-sans font-light text-[#333333] uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.2em', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          scroll
        </span>
        <div style={{ position: 'relative', width: '1px', height: '64px', background: '#1A1A1A' }}>
          <div ref={scrollLineRef}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #4DFFB4, transparent)', transformOrigin: 'top center', transform: 'scaleY(0)' }} />
        </div>
      </div>

      {/* Floating product specs — desktop right */}
      <div ref={specsRef} className="absolute right-8 md:right-16 bottom-52 hidden md:flex flex-col items-end gap-4" aria-hidden="true">
        {SPECS.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="font-sans text-[#2E2E2E] text-[9px] tracking-[0.3em] uppercase">{label}</span>
            <span className="w-5 h-px bg-[#1C1C1C]" />
            <span className="font-display text-[#555555] text-xs tracking-wider">{value}</span>
          </div>
        ))}
      </div>

      {/* Main content — bottom anchored */}
      <div className="relative flex flex-col justify-end flex-1 pb-6 gap-5 px-8 md:px-16">

        {/* Eyebrow */}
        <p ref={eyebrowRef} className="font-sans font-light text-[#333333] text-[10px] tracking-[0.35em] uppercase">
          Silence. Redefined.
        </p>

        {/* Headline */}
        <h1 ref={headlineRef}
          className="font-display font-medium text-[#4DFFB4] leading-none select-none"
          style={{ fontSize: 'clamp(4rem, 20vw, 22rem)', letterSpacing: '-0.04em', opacity: 0 }}
          aria-label={HEADLINE}>
          {HEADLINE}
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="font-sans font-light text-[#555555] max-w-xs md:max-w-sm"
          style={{ fontSize: '14px', lineHeight: '1.7', letterSpacing: '0.01em' }}>
          Engineered for those who hear the difference.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex items-center gap-8 pointer-events-auto mt-2">
          {/* Primary — MagneticButton */}
          <MagneticButton
            href="/collection"
            label="Discover"
            className="font-sans font-light text-xs tracking-[0.25em] uppercase px-8 py-4 bg-[#4DFFB4] text-[#000000] hover:bg-[#E8E8E8] transition-colors duration-300"
          />

          {/* Secondary — animated arrow link */}
          <Link
            href="/collection"
            data-cursor="pointer"
            aria-label="Explorer la collection AW25"
            className="group flex items-center gap-3 pointer-events-auto"
          >
            <span className="block h-px w-6 bg-[#2A2A2A] group-hover:w-10 group-hover:bg-[#4DFFB4] transition-all duration-500 ease-out" />
            <span className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-[#3A3A3A] group-hover:text-[#666666] transition-colors duration-300">
              AW25
            </span>
          </Link>
        </div>
      </div>

      {/* Marquee */}
      <div ref={marqueeRef}
        className="relative z-10 bg-[#080808] py-5 overflow-hidden border-t border-[#111111] flex flex-col gap-y-3 pointer-events-none"
        aria-hidden="true">
        <MarqueeRow direction="left" />
        <MarqueeRow direction="right" />
      </div>
    </section>
  )
}
