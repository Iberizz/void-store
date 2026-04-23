'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type Props = {
  number: string
  name: string
  expiry: string
  cvv: string
  brand: 'visa' | 'mastercard' | 'amex' | 'unknown'
  flipped: boolean
}

const BRAND_LABEL: Record<string, string> = {
  visa:       'VISA',
  mastercard: 'MC',
  amex:       'AMEX',
  unknown:    '',
}

export default function CardPreview({ number, name, expiry, cvv, brand, flipped }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Format number display: •••• •••• •••• 1234
  const digits = number.replace(/\D/g, '')
  const groups = brand === 'amex'
    ? [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
    : [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 16)]

  const displayNumber = groups
    .map((g, i) => {
      const isLast = i === groups.length - 1
      if (g.length === 0) return isLast ? '____' : '____'
      const maxLen = brand === 'amex' ? [4, 6, 5][i] : 4
      const padded = g.padEnd(maxLen, '_')
      // Show actual digits for last group, mask others
      return padded
    })
    .join(' ')

  // Masking: show last 4 real, mask rest
  const maskedNumber = groups
    .map((g, i) => {
      const isLast = i === groups.length - 1
      const maxLen = brand === 'amex' ? [4, 6, 5][i] : 4
      if (isLast) return g.padEnd(maxLen, '·')
      return '●'.repeat(maxLen)
    })
    .join(' ')

  useEffect(() => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotateY: flipped ? 180 : 0,
      duration: 0.6,
      ease: 'expo.inOut',
    })
  }, [flipped])

  return (
    <div className="w-full max-w-[340px]" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        className="relative w-full"
        style={{
          aspectRatio: '1.586',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-none overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #141414 100%)',
            border: '1px solid #2a2a2a',
          }}
        >
          {/* Subtle gloss */}
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: 'linear-gradient(135deg, #fff 0%, transparent 60%)' }}
            aria-hidden="true"
          />

          {/* Top row */}
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            {/* Chip */}
            <div
              className="w-9 h-7 rounded-sm border border-[#4DFFB4]/30"
              style={{ background: 'linear-gradient(135deg, #4DFFB4 0%, #2a8a64 100%)', opacity: 0.7 }}
              aria-hidden="true"
            />
            {/* Brand */}
            {brand !== 'unknown' && (
              <span className="font-display text-void-white text-sm tracking-[0.1em]">
                {BRAND_LABEL[brand]}
              </span>
            )}
          </div>

          {/* Card number */}
          <div className="absolute left-5 right-5" style={{ top: '42%' }}>
            <p
              className="font-mono text-void-white tracking-[0.18em]"
              style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)' }}
              aria-label="Card number"
            >
              {digits.length > 0 ? maskedNumber : '•••• •••• •••• ••••'}
            </p>
          </div>

          {/* Bottom row */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="font-sans text-[#555] text-[8px] tracking-[0.15em] uppercase mb-1">
                Card Holder
              </p>
              <p className="font-sans text-void-white text-sm tracking-[0.05em] uppercase">
                {name || 'YOUR NAME'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-[#555] text-[8px] tracking-[0.15em] uppercase mb-1">
                Expires
              </p>
              <p className="font-sans text-void-white text-sm tracking-[0.05em]">
                {expiry || 'MM/YY'}
              </p>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #111 0%, #080808 100%)',
            border: '1px solid #2a2a2a',
          }}
        >
          {/* Magnetic strip */}
          <div
            className="absolute w-full h-10 bg-[#1a1a1a]"
            style={{ top: '22%' }}
            aria-hidden="true"
          />

          {/* CVV strip */}
          <div className="absolute left-5 right-5" style={{ top: '52%' }}>
            <div className="bg-[#E8E8E8] h-8 flex items-center justify-end pr-3">
              <span className="font-mono text-[#000] text-sm tracking-[0.2em]">
                {cvv ? '•'.repeat(cvv.length) : '•••'}
              </span>
            </div>
            <p className="font-sans text-[#555] text-[8px] tracking-[0.15em] uppercase mt-2 text-right">
              Security code
            </p>
          </div>

          {/* Brand back */}
          {brand !== 'unknown' && (
            <p className="absolute bottom-5 right-5 font-display text-void-muted text-xs tracking-[0.1em]">
              {BRAND_LABEL[brand]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
