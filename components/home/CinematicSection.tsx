'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Slide {
  label: string
  title: string
  stat?: string
  cta?: { label: string; href: string }
}

const SLIDES: Slide[] = [
  { label: 'Drivers',    title: '40mm beryllium', stat: 'Dual configuration'       },
  { label: 'Battery',    title: '48h autonomy',   stat: 'One charge. No excuses.'  },
  { label: 'Silence',    title: 'ANC −42dB',      stat: 'Total silence'            },
  { label: 'Collection', title: 'VØID Pro',        cta: { label: 'Discover →', href: '/product/void-pro' } },
]

export default function CinematicSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const headphoneRef = useRef<HTMLDivElement>(null)
  const slidesRef    = useRef<(HTMLDivElement | null)[]>([])
  const activeSlide  = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      /* ── White overlay fade ── */
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%', end: 'bottom 40%',
        onEnter:     () => gsap.to(overlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeave:     () => gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }),
        onEnterBack: () => gsap.to(overlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }),
      })

      /* ── Headphone scale + rotateY scrub ── */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1.5 },
      })
      tl.to(headphoneRef.current, { scale: 1.03, rotateY: -8, transformPerspective: 900, duration: 1 })
        .to(headphoneRef.current, { scale: 1.06, rotateY:  8, duration: 1 })
        .to(headphoneRef.current, { scale: 1.08, rotateY: -4, duration: 1 })
        .to(headphoneRef.current, { scale: 1.0,  rotateY:  0, duration: 1 })

      /* ── Slide reveal on progress ── */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top', end: 'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(Math.floor(self.progress * 4), 3)
          if (idx === activeSlide.current) return

          const prev = slidesRef.current[activeSlide.current]
          const next = slidesRef.current[idx]

          if (prev) gsap.to(prev, { clipPath: 'inset(0 0 100% 0)', duration: 0.3, ease: 'expo.in' })
          if (next) gsap.fromTo(next,
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)',   duration: 0.5, ease: 'expo.out' },
          )
          activeSlide.current = idx
        },
      })

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '400vh' }}
      aria-label="Caractéristiques VØID"
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 6 }}>

        {/* White overlay — covers canvas */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#FFFFFF] pointer-events-none"
          style={{ opacity: 0, zIndex: 0 }}
          aria-hidden="true"
        />

        {/* Headphone */}
        <div
          ref={headphoneRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="relative w-[55vw] max-w-2xl" style={{ aspectRatio: '1 / 1' }}>
            <Image
              src="/images/headphone-hero.png"
              alt="VØID headphone"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.label}
            ref={el => { slidesRef.current[i] = el }}
            className="absolute inset-0 flex flex-col justify-end p-12 md:p-20 pointer-events-none"
            style={{ clipPath: i === 0 ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', zIndex: 2 }}
          >
            <div className="flex flex-col gap-2">
              <span
                className="font-sans font-light uppercase text-[#4DFFB4]"
                style={{ fontSize: '10px', letterSpacing: '0.3em' }}
              >
                {slide.label}
              </span>
              <h2
                className="font-display font-light text-[#000000] leading-none"
                style={{ fontSize: 'clamp(4rem, 8vw, 9rem)', letterSpacing: '-0.03em', fontWeight: 300 }}
              >
                {slide.title}
              </h2>
              {slide.stat && (
                <p className="font-sans font-light text-[#666666] mt-1" style={{ fontSize: '14px' }}>
                  {slide.stat}
                </p>
              )}
              {slide.cta && (
                <Link
                  href={slide.cta.href}
                  className="self-start mt-4 font-sans font-light text-sm text-[#000000] border border-[#000000] px-6 py-3 rounded-full transition-all duration-300 hover:bg-[#000000] hover:text-[#FFFFFF] pointer-events-auto"
                  data-cursor="pointer"
                  aria-label={slide.cta.label}
                >
                  {slide.cta.label}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
