'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  value: number
  prefix?: string
  suffix?: string
  unit?: string       // unit in #4DFFB4
  symbol?: string     // symbol in #4DFFB4 (after value)
  label: string
}

const STATS: Stat[] = [
  { value: 12000, prefix: '', suffix: '', symbol: '+', label: 'Customers worldwide' },
  { value: 98,    unit: 'dB',                           label: 'Dynamic range' },
  { value: 1,     prefix: 'AW', unit: '25',             label: 'Collection' },
  { value: 48,    unit: 'h',                            label: 'Battery life' },
]

function formatValue(val: number, stat: Stat): string {
  if (stat.prefix === 'AW') return 'AW'
  return val >= 1000 ? val.toLocaleString('en-US') : String(val)
}

export default function StatsSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const numbersRef  = useRef<(HTMLSpanElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered section reveal
      gsap.from(containerRef.current?.children ?? [], {
        opacity: 0,
        y: 32,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      // Counter animations
      STATS.forEach((stat, i) => {
        const el = numbersRef.current[i]
        if (!el) return

        // AW25 — no counter, just reveal
        if (stat.prefix === 'AW') return

        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.value,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          onUpdate() {
            el.textContent = formatValue(Math.round(obj.val), stat)
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-[#080808] border-y border-[#1C1C1C]"
      aria-label="VØID — Chiffres clés"
    >
      <div
        ref={containerRef}
        className="grid grid-cols-2 md:grid-cols-4"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={[
              'flex flex-col justify-center gap-3 px-8 py-16 md:py-20',
              i < STATS.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#1C1C1C]' : '',
              i % 2 === 0 && i < 2 ? 'border-r md:border-r-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Number row */}
            <p
              className="font-display leading-none select-none"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.04em' }}
              aria-label={`${stat.prefix ?? ''}${stat.value}${stat.unit ?? ''}${stat.symbol ?? ''}`}
            >
              {stat.prefix === 'AW' ? (
                /* Static — no counter */
                <>
                  <span className="text-[#E8E8E8]">AW</span>
                  <span className="text-[#4DFFB4]">25</span>
                </>
              ) : (
                /* Animated counter */
                <>
                  <span
                    ref={(el) => { numbersRef.current[i] = el }}
                    className="text-[#E8E8E8]"
                  >
                    0
                  </span>
                  {stat.unit && (
                    <span className="text-[#4DFFB4]">{stat.unit}</span>
                  )}
                  {stat.symbol && (
                    <span className="text-[#4DFFB4]">{stat.symbol}</span>
                  )}
                </>
              )}
            </p>

            {/* Label */}
            <p className="font-sans font-light text-[10px] tracking-[0.25em] text-[#444444] uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
