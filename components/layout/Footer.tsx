'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV   = [
  { label: 'Collection', href: '/collection' },
  { label: 'About',      href: '/about'      },
  { label: 'Contact',    href: '/contact'    },
]
const LEGAL = [
  { label: 'Privacy',  href: '#' },
  { label: 'Terms',    href: '#' },
  { label: 'Cookies',  href: '#' },
]
const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'X / Twitter', href: '#' },
  { label: 'Spotify',   href: '#' },
]
const TICKER_ITEMS = ['SILENCE', '·', 'BERYLLIUM DRIVERS', '·', 'ANC −42dB', '·', '48H BATTERY', '·', 'AW25', '·', 'VØID', '·']

export default function Footer() {
  const footerRef   = useRef<HTMLElement>(null)
  const wordRef     = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ctaRef.current, {
        opacity: 0, y: 40, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 88%', once: true },
      })
      gsap.from(Array.from(gridRef.current?.children ?? []), {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
      })
      gsap.from(wordRef.current, {
        opacity: 0, y: 80, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: wordRef.current, start: 'top 95%', once: true },
      })
    }, footerRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
  }

  return (
    <footer ref={footerRef} className="relative z-10 bg-[#000000]" aria-label="Pied de page VØID">

      {/* ── Editorial CTA strip ── */}
      <div ref={ctaRef} className="border-t border-[#1C1C1C] px-8 md:px-16 py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <p className="font-sans font-light text-[#4DFFB4] uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
            Stay in the silence
          </p>
          <h2 className="font-display font-light text-[#E8E8E8] leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}>
            Join the inner circle.
          </h2>
        </div>

        {/* Newsletter */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm" aria-label="Inscription newsletter">
          {sent ? (
            <p className="font-sans font-light text-[#4DFFB4]" style={{ fontSize: '13px', letterSpacing: '0.1em' }}>
              Welcome to the silence. ✓
            </p>
          ) : (
            <>
              <div className="flex border-b border-[#333333] focus-within:border-[#4DFFB4] transition-colors duration-300">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Adresse email"
                  className="flex-1 bg-transparent font-sans font-light text-[#E8E8E8] placeholder-[#333333] outline-none py-3"
                  style={{ fontSize: '14px' }}
                />
                <button
                  type="submit"
                  className="font-sans font-light text-[#4DFFB4] hover:text-[#E8E8E8] transition-colors duration-200 pl-4 shrink-0"
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  data-cursor="pointer"
                  aria-label="S'inscrire"
                >
                  JOIN →
                </button>
              </div>
              <p className="font-sans font-light text-[#333333]" style={{ fontSize: '11px' }}>
                No spam. Early access to new drops only.
              </p>
            </>
          )}
        </form>
      </div>

      {/* ── Grid ── */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-10 px-8 md:px-16 py-14 border-t border-[#1C1C1C]">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
          <Link href="/" className="font-display font-medium text-[#E8E8E8] text-xl tracking-tighter leading-none select-none w-fit" aria-label="VØID accueil">
            VØID
          </Link>
          <p className="font-sans font-light text-[#444444] leading-relaxed" style={{ fontSize: '13px', maxWidth: '180px' }}>
            Premium audio engineered for those who hear the difference.
          </p>
          <div className="flex flex-col gap-1 mt-2">
            {['Free shipping', '30-day returns', '2-year warranty'].map(t => (
              <p key={t} className="font-sans font-light text-[#333333] flex items-center gap-2" style={{ fontSize: '11px' }}>
                <span className="text-[#4DFFB4]">—</span>{t}
              </p>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-5">
          <p className="font-sans font-light text-[#E8E8E8] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>Pages</p>
          <ul className="flex flex-col gap-3" role="list">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="font-sans font-light text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200" style={{ fontSize: '13px' }} data-cursor="pointer">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-5">
          <p className="font-sans font-light text-[#E8E8E8] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>Follow</p>
          <ul className="flex flex-col gap-3" role="list">
            {SOCIALS.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className="font-sans font-light text-[#666666] hover:text-[#4DFFB4] transition-colors duration-200" style={{ fontSize: '13px' }} data-cursor="pointer">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-5">
          <p className="font-sans font-light text-[#E8E8E8] uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>Legal</p>
          <ul className="flex flex-col gap-3" role="list">
            {LEGAL.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className="font-sans font-light text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200" style={{ fontSize: '13px' }} data-cursor="pointer">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Giant outline wordmark ── */}
      <div ref={wordRef} className="px-6 md:px-12 overflow-hidden" aria-hidden="true">
        <p
          className="font-display font-light leading-none select-none"
          style={{
            fontSize:           'clamp(20vw, 24vw, 32vw)',
            letterSpacing:      '-0.04em',
            lineHeight:         0.82,
            color:              'transparent',
            WebkitTextStroke:   '1px #1C1C1C',
          }}
        >
          VØID
        </p>
      </div>

      {/* ── Ticker + copyright bar ── */}
      <div className="border-t border-[#1C1C1C] mt-6">
        {/* Specs ticker */}
        <div className="overflow-hidden py-3 border-b border-[#0F0F0F]" aria-hidden="true">
          <ul
            className="flex shrink-0"
            style={{
              animation:         'scroll-left 30s linear infinite',
              '--marquee-offset': '-50%',
              willChange:        'transform',
            } as React.CSSProperties}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <li key={i} className="font-sans font-light shrink-0 px-6" style={{ fontSize: '10px', letterSpacing: '0.2em', color: item === '·' ? '#4DFFB4' : '#2A2A2A' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-8 md:px-16 py-5">
          <p className="font-sans font-light text-[#2A2A2A]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
            © 2026 VØID Studio - Iberizz. All rights reserved.
          </p>
          <p className="font-sans font-light text-[#2A2A2A]" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
            SILENCE. REDEFINED.
          </p>
        </div>
      </div>

    </footer>
  )
}
