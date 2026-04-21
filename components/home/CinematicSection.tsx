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
  imageSrc: string
  alt: string
}

const SLIDES: Slide[] = [
  { label: 'Drivers',    title: '40mm beryllium', stat: 'Dual configuration',      imageSrc: '/images/slide-drivers.png', alt: 'VØID — drivers beryllium 40mm dual configuration'   },
  { label: 'Battery',    title: '48h autonomy',   stat: 'One charge. No excuses.', imageSrc: '/images/slide-battery.png', alt: 'VØID — batterie 48h une seule charge'               },
  { label: 'Silence',    title: 'ANC −42dB',      stat: 'Total silence',           imageSrc: '/images/slide-anc.png',    alt: 'VØID — réduction bruit active ANC moins 42 décibels' },
  { label: 'Collection', title: 'VØID Pro',        cta: { label: 'Discover →', href: '/product/void-pro' }, imageSrc: '/images/slide-hero.png', alt: 'VØID Pro — casque audio premium AW25' },
]

export default function CinematicSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const slidesRef   = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef   = useRef<(HTMLDivElement | null)[]>([])
  const progRef     = useRef<(HTMLDivElement | null)[]>([])
  const activeSlide = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const goTo = (next: number) => {
      const prev   = activeSlide.current
      if (next === prev) return
      const pSlide = slidesRef.current[prev]
      const nSlide = slidesRef.current[next]
      const pImg   = imagesRef.current[prev]
      const nImg   = imagesRef.current[next]
      const pTitle = pSlide?.querySelector<HTMLElement>('[data-title]')
      const nTitle = nSlide?.querySelector<HTMLElement>('[data-title]')

      if (pTitle) gsap.to(pTitle, { y: -40, skewY: 3, opacity: 0, duration: 0.4, ease: 'power2.in' })
      if (pSlide) gsap.to(pSlide, { opacity: 0, duration: 0.4 })
      if (pImg)   gsap.to(pImg,   { opacity: 0, scale: 1.05, duration: 0.6 })
      if (nSlide) gsap.set(nSlide, { opacity: 1 })
      if (nTitle) gsap.fromTo(nTitle, { y: 60, skewY: -3, opacity: 0 }, { y: 0, skewY: 0, opacity: 1, duration: 0.6, ease: 'expo.out' })
      if (nImg)   gsap.fromTo(nImg,   { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.6 })
      if (progRef.current[prev]) gsap.to(progRef.current[prev], { height: 0, duration: 0.3 })
      if (progRef.current[next]) gsap.fromTo(progRef.current[next], { height: 0 }, { height: 48, duration: 0.5, ease: 'power2.out' })
      activeSlide.current = next
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section, start: 'top 60%', end: 'bottom 40%',
        onEnter:     () => gsap.to(overlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeave:     () => gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }),
        onEnterBack: () => gsap.to(overlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }),
      })
      ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => goTo(Math.min(Math.floor(self.progress * 4), 3)),
      })
      gsap.set(progRef.current[0], { height: 48 })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10" style={{ height: '400vh' }} aria-label="Caractéristiques VØID">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 6 }}>

        {/* White overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-[#FFFFFF] pointer-events-none" style={{ opacity: 0, zIndex: 0 }} aria-hidden="true" />

        <div className="absolute inset-0 flex flex-col md:flex-row" style={{ zIndex: 1 }}>

          {/* Left — text */}
          <div className="relative h-[50vh] md:h-screen w-full md:w-[45%] flex flex-col justify-center px-8 md:px-16 order-2 md:order-1">

            {/* Progress bar — desktop only */}
            <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-2" aria-hidden="true">
              {SLIDES.map((_, i) => (
                <div key={i} className="relative overflow-hidden" style={{ width: '1px', height: '48px', background: '#1C1C1C' }}>
                  <div ref={el => { progRef.current[i] = el }} style={{ width: '1px', height: 0, background: '#4DFFB4', position: 'absolute', bottom: 0 }} />
                </div>
              ))}
            </div>

            {/* Slides text */}
            <div className="relative" style={{ minHeight: '220px' }}>
              {SLIDES.map((slide, i) => (
                <div key={slide.label} ref={el => { slidesRef.current[i] = el }}
                  className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                  style={{ opacity: i === 0 ? 1 : 0 }}>
                  <span className="font-sans font-light uppercase text-[#4DFFB4] mb-4"
                    style={{ fontSize: '13px', letterSpacing: '0.2em' }}>
                    {slide.label}
                  </span>
                  <h2 data-title className="font-display text-[#000000] leading-none"
                    style={{ fontSize: 'clamp(4rem, 7vw, 8rem)', letterSpacing: '-0.03em', fontWeight: 500 }}>
                    {slide.title}
                  </h2>
                  {slide.stat && (
                    <p className="font-sans font-light text-[#666666] mt-4" style={{ fontSize: '14px' }}>{slide.stat}</p>
                  )}
                  {slide.cta && (
                    <Link href={slide.cta.href}
                      className="self-start mt-8 font-sans font-light text-sm text-[#000000] border border-[#000000] px-8 py-3 rounded-full transition-all duration-300 hover:bg-[#000000] hover:text-[#FFFFFF] pointer-events-auto"
                      data-cursor="pointer" aria-label={slide.cta.label}>
                      {slide.cta.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — images */}
          <div className="relative h-[50vh] md:h-screen w-full md:w-[55%] overflow-hidden order-1 md:order-2">
            {SLIDES.map((slide, i) => (
              <div key={slide.label} ref={el => { imagesRef.current[i] = el }}
                className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image src={slide.imageSrc} alt={slide.alt} fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 55vw"
                  priority={i === 0} loading={i === 0 ? undefined : 'lazy'} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
