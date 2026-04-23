'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Sparkline from './Sparkline'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  label: string
  value: number
  unit?: string
  trend: number
  period: string
  sparkline: number[]
  format?: 'number' | 'currency'
  index?: number
}

export default function KPICard({
  label, value, unit = '', trend, period, sparkline, format = 'number', index = 0
}: Props) {
  const countRef  = useRef<HTMLSpanElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const isPositive = trend >= 0

  useEffect(() => {
    const ctx = gsap.context(() => {
      const card = cardRef.current
      const el   = countRef.current
      if (!card || !el) return

      gsap.from(card, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'expo.out',
        delay: index * 0.08,
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      })

      const obj = { val: 0 }
      gsap.to(obj, {
        val: value,
        duration: 1.6,
        ease: 'power3.out',
        delay: index * 0.08 + 0.2,
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        onUpdate() {
          if (!el) return
          const v = Math.round(obj.val)
          if (format === 'currency') {
            el.textContent = v >= 1000
              ? `${(v / 1000).toFixed(v >= 100_000 ? 0 : 1)}k`
              : `${v}`
          } else {
            el.textContent = v.toLocaleString()
          }
        },
      })
    })

    return () => ctx.revert()
  }, [value, format, index])

  return (
    <div
      ref={cardRef}
      className="bg-void-surface border border-void-border p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Label */}
      <p className="font-sans text-void-muted text-xs tracking-[0.15em] uppercase">{label}</p>

      {/* Value + sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-1">
          {unit && (
            <span className="font-display text-void-muted text-xl">{unit}</span>
          )}
          <span
            ref={countRef}
            className="font-display text-void-white tabular-nums"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1 }}
          >
            0
          </span>
        </div>

        <Sparkline
          data={sparkline}
          color={isPositive ? '#4DFFB4' : '#FF6B6B'}
          width={100}
          height={38}
        />
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1 font-sans text-xs"
          style={{ color: isPositive ? '#4DFFB4' : '#FF6B6B' }}
        >
          {isPositive
            ? <TrendingUp size={12} strokeWidth={2} />
            : <TrendingDown size={12} strokeWidth={2} />
          }
          {isPositive ? '+' : ''}{trend}%
        </span>
        <span className="font-sans text-void-muted text-xs">{period}</span>
      </div>

      {/* Subtle corner accent */}
      <div
        className="absolute top-0 right-0 w-px h-full opacity-30"
        style={{ background: `linear-gradient(to bottom, ${isPositive ? '#4DFFB4' : '#FF6B6B'}, transparent)` }}
        aria-hidden="true"
      />
    </div>
  )
}
