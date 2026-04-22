'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ref404       = useRef<HTMLDivElement>(null)
  const btnRef       = useRef<HTMLAnchorElement>(null)

  /* ── Glitch au load ── */
  useEffect(() => {
    const el = ref404.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-char]'))
    const orig  = ['4', '0', '4']
    const pool  = '0123456789'
    const rnd   = () => pool[Math.floor(Math.random() * 10)]

    const tween = gsap.to({}, {
      duration: 0.6,
      onUpdate() {
        if (this.progress() < 0.85) spans.forEach(s => { s.textContent = rnd() })
        else spans.forEach((s, i) => { s.textContent = orig[i] })
      },
      onComplete() { spans.forEach((s, i) => { s.textContent = orig[i] }) },
    })
    return () => { tween.kill() }
  }, [])

  /* ── Parallaxe souris ── */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const c = containerRef.current
    const el = ref404.current
    if (!c || !el) return
    const { width, height } = c.getBoundingClientRect()
    gsap.to(el, {
      x: ((e.clientX - width  / 2) / width)  * 40,
      y: ((e.clientY - height / 2) / height) * 20,
      duration: 0.8, ease: 'power2.out',
    })
  }

  /* ── Magnetic button ── */
  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    gsap.to(btn, { x: (e.clientX - r.left - r.width  / 2) * 0.3,
                   y: (e.clientY - r.top  - r.height / 2) * 0.3,
                   duration: 0.4, ease: 'power2.out' })
  }
  const onBtnLeave = () => gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden" onMouseMove={onMouseMove}>

      {/* Background */}
      <Image src="/images/error404.png" alt="" fill className="object-cover" priority />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} aria-hidden="true" />

      {/* 404 watermark — parallax */}
      <div
        ref={ref404}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 1, willChange: 'transform' }}
        aria-hidden="true"
      >
        <p style={{ fontSize: 'clamp(20vw, 30vw, 40vw)', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: 1 }}>
          <span data-char style={{ color: '#4DFFB4', opacity: 0.15 }}>4</span>
          <span data-char style={{ color: '#E8E8E8', opacity: 0.08 }}>0</span>
          <span data-char style={{ color: '#4DFFB4', opacity: 0.15 }}>4</span>
        </p>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
        <span className="font-sans font-light uppercase tracking-widest text-[#4DFFB4]"
          style={{ fontSize: '10px', marginBottom: '1.5rem' }}>
          VØID — 404
        </span>

        <h1 className="font-display font-light text-[#E8E8E8] text-center px-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', letterSpacing: '-0.03em' }}>
          You&apos;ve entered the void.
        </h1>

        <p className="font-sans font-light text-[#666666] mt-4" style={{ fontSize: '14px' }}>
          The silence here is absolute.
        </p>

        <div style={{ width: '48px', height: '1px', background: '#1C1C1C', margin: '2rem auto' }} aria-hidden="true" />

        <Link
          ref={btnRef}
          href="/"
          className="font-sans font-light text-sm text-[#E8E8E8] border border-[#1C1C1C] px-8 py-3 rounded-full transition-colors duration-300 hover:border-[#4DFFB4] hover:text-[#4DFFB4]"
          style={{ display: 'inline-block' }}
          onMouseMove={onBtnMove}
          onMouseLeave={onBtnLeave}
          data-cursor="pointer"
          aria-label="Retourner à l'accueil VØID"
        >
          Return to surface →
        </Link>
      </div>
    </div>
  )
}
