'use client'

import { useRef, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { login } from '@/app/actions/auth'

gsap.registerPlugin(SplitText)

const LEFT_SPECS = [
  { label: 'ANC',        value: '−42dB' },
  { label: 'Battery',    value: '48H'   },
  { label: 'Collection', value: 'AW25'  },
]

export default function LoginClient() {
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef   = useRef<HTMLParagraphElement>(null)
  const formRef       = useRef<HTMLDivElement>(null)
  const watermarkRef  = useRef<HTMLSpanElement>(null)
  const headphoneRef  = useRef<HTMLDivElement>(null)
  const quoteRef      = useRef<HTMLDivElement>(null)
  const specsRef      = useRef<HTMLDivElement>(null)
  const lineRef       = useRef<HTMLSpanElement>(null)
  const dotRef        = useRef<HTMLSpanElement>(null)

  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const redirect     = searchParams.get('redirect') || '/account'

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical accent line
      gsap.from(lineRef.current, {
        scaleY: 0, duration: 1.4, ease: 'expo.out', transformOrigin: 'top center',
      })

      // Watermark
      gsap.from(watermarkRef.current, {
        opacity: 0, scale: 1.08, duration: 1.6, delay: 0.1, ease: 'power2.out',
      })

      // Headphone — enter + float loop
      if (headphoneRef.current) {
        gsap.from(headphoneRef.current, {
          opacity: 0, y: 40, scale: 0.9, duration: 1.6, delay: 0.2, ease: 'expo.out',
        })
        gsap.to(headphoneRef.current, {
          y: -14, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8,
        })
      }

      // Quote
      if (quoteRef.current) {
        gsap.from(Array.from(quoteRef.current.children), {
          opacity: 0, y: 16, stagger: 0.1, duration: 0.9, delay: 0.5, ease: 'power3.out',
        })
      }

      // Specs
      if (specsRef.current) {
        gsap.from(Array.from(specsRef.current.children), {
          opacity: 0, x: -12, stagger: 0.09, duration: 0.7, delay: 0.8, ease: 'power2.out',
        })
      }

      // Right panel
      if (dotRef.current) {
        gsap.from(dotRef.current, { scale: 0, opacity: 0, duration: 0.5, delay: 0.35, ease: 'back.out(2)' })
      }
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
        gsap.from(split.chars, { y: 70, opacity: 0, stagger: 0.03, duration: 0.9, ease: 'expo.out', delay: 0.45 })
      }
      gsap.from(subtitleRef.current, { opacity: 0, y: 12, duration: 0.7, delay: 0.85, ease: 'power2.out' })
      gsap.from(formRef.current,     { opacity: 0, y: 24, duration: 0.9, delay: 1.05, ease: 'expo.out' })
    })

    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  const inputCls = [
    'w-full bg-transparent border-0 border-b border-[#1C1C1C]',
    'text-[#E8E8E8] font-sans text-sm pb-3 outline-none',
    'placeholder:text-[#242424] focus:border-[#4DFFB4] transition-colors duration-300',
  ].join(' ')

  const labelCls = 'block font-sans text-[10px] text-[#444444] tracking-[0.25em] uppercase mb-3'

  return (
    <main className="min-h-screen bg-[#000000] flex">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex relative w-[45%] flex-col justify-between p-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #050505 0%, #070707 60%, #060606 100%)' }}>

        {/* Vertical accent line — right edge */}
        <span ref={lineRef}
          className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #4DFFB4 40%, #4DFFB4 60%, transparent 100%)', opacity: 0.18 }}
          aria-hidden="true"
        />

        {/* Watermark */}
        <span ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center font-display leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(9rem, 19vw, 22rem)', letterSpacing: '-0.05em', color: '#090909' }}
          aria-hidden="true">
          VØID
        </span>

        {/* Headphone image */}
        <div ref={headphoneRef}
          className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none"
          style={{ opacity: 0.18, width: 'clamp(260px, 32vw, 420px)', height: 'clamp(260px, 32vw, 420px)' }}>
          <Image
            src="/images/void-pro-transparent.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
            priority
          />
        </div>

        {/* Top — wordmark */}
        <div className="relative z-10">
          <Link href="/"
            className="font-display text-[#E8E8E8] text-sm tracking-[0.3em] uppercase hover:text-[#4DFFB4] transition-colors duration-300">
            VØID
          </Link>
        </div>

        {/* Center — quote */}
        <div ref={quoteRef} className="relative z-10">
          <p className="font-sans text-[#2C2C2C] text-[10px] tracking-[0.3em] uppercase mb-4">
            AW25 — Premium Audio
          </p>
          <p className="font-display text-[#383838] leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', letterSpacing: '-0.03em' }}>
            Silence.<br />Redefined.
          </p>
        </div>

        {/* Bottom — specs */}
        <div ref={specsRef} className="relative z-10 flex flex-col gap-3">
          {LEFT_SPECS.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="font-sans text-[#252525] text-[9px] tracking-[0.3em] uppercase">{label}</span>
              <span className="flex-1 h-px bg-[#141414]" />
              <span className="font-display text-[#303030] text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 py-12">
        <div className="w-full max-w-xl">

          {/* Mobile — back link */}
          <Link href="/"
            className="lg:hidden font-sans text-[#444] text-xs tracking-[0.2em] uppercase mb-12 block hover:text-[#E8E8E8] transition-colors">
            ← VØID
          </Link>

          {/* Green accent dot */}
          <span ref={dotRef}
            className="block w-1.5 h-1.5 rounded-full bg-[#4DFFB4] mb-7"
            aria-hidden="true"
          />

          <h1 ref={titleRef}
            className="font-display text-[#E8E8E8] leading-none mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '-0.04em' }}>
            Welcome back.
          </h1>

          <p ref={subtitleRef} className="font-sans font-light text-[#3A3A3A] text-sm mb-12">
            New to VØID?{' '}
            <Link href="/auth/signup"
              className="text-[#4DFFB4] hover:opacity-70 transition-opacity">
              Create an account
            </Link>
          </p>

          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-8">

              <div>
                <label htmlFor="email" className={labelCls}>Email</label>
                <input
                  id="email" name="email" type="email" required
                  autoComplete="email" placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="password"
                    className="font-sans text-[10px] text-[#444444] tracking-[0.25em] uppercase">
                    Password
                  </label>
                  <span className="font-sans text-[10px] text-[#4DFFB4]/25 tracking-[0.1em] cursor-default select-none">
                    Forgot?
                  </span>
                </div>
                <input
                  id="password" name="password" type="password" required
                  autoComplete="current-password" placeholder="••••••••"
                  className={inputCls}
                />
              </div>

              {error && (
                <div className="border-l-2 border-[#FF6B6B]/60 pl-4 py-1">
                  <p className="font-sans text-xs text-[#FF6B6B]">{error}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Sign in to your VØID account"
                  className="w-full py-4 font-sans font-light text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? '#141414' : '#4DFFB4',
                    color:      loading ? '#444444' : '#000000',
                  }}>
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
              </div>

            </form>

            <p className="font-sans text-[#1E1E1E] text-[10px] tracking-[0.1em] text-center mt-8">
              VØID — AW25 — Premium Audio
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
