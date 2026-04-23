'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Panel = {
  watermark: string
  word: string
  phrase: string
  cta?: boolean
}

const PANELS: Panel[] = [
  {
    watermark: 'Silence.',
    word: 'SILENCE',
    phrase: 'Engineered to block the world out. ANC −42 dB of pure absence.',
  },
  {
    watermark: 'Clarity.',
    word: 'CLARITY',
    phrase: 'Beryllium drivers, tuned to the edge of perception. Nothing added. Nothing lost.',
  },
  {
    watermark: 'Presence.',
    word: 'PRESENCE',
    phrase: "48 hours. One charge. The music stays — the battery anxiety doesn't.",
  },
  {
    watermark: 'VØID.',
    word: 'VØID',
    phrase: 'Two drivers. Zero compromise. This is the instrument.',
    cta: true,
  },
]

export default function EmotionalScroll() {
  const sectionRef    = useRef<HTMLElement>(null)
  const stickyRef     = useRef<HTMLDivElement>(null)
  const headphoneRef  = useRef<HTMLDivElement>(null)
  const watermarkRefs = useRef<(HTMLDivElement | null)[]>([])
  const panelRefs     = useRef<(HTMLDivElement | null)[]>([])
  const progFillRefs  = useRef<(HTMLDivElement | null)[]>([])
  const activePanel   = useRef(-1)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const switchPanel = (next: number) => {
      if (next === activePanel.current) return
      activePanel.current = next

      // Kill all running tweens and instantly reset every panel
      PANELS.forEach((_, i) => {
        gsap.killTweensOf(watermarkRefs.current[i])
        gsap.killTweensOf(panelRefs.current[i])
        gsap.killTweensOf(progFillRefs.current[i])

        if (i !== next) {
          gsap.set(watermarkRefs.current[i], { opacity: 0, y: 0 })
          gsap.set(panelRefs.current[i],     { opacity: 0, y: 0 })
          gsap.set(progFillRefs.current[i],  { scaleY: 0, transformOrigin: 'top' })
        }
      })

      // Animate only the active panel in
      gsap.fromTo(watermarkRefs.current[next],
        { opacity: 0, y: 16 },
        { opacity: 1,  y: 0, duration: 0.55, ease: 'power3.out' }
      )
      gsap.fromTo(panelRefs.current[next],
        { opacity: 0, y: 24 },
        { opacity: 1,  y: 0, duration: 0.5,  ease: 'expo.out', delay: 0.04 }
      )
      gsap.fromTo(progFillRefs.current[next],
        { scaleY: 0 },
        { scaleY: 1, duration: 0.45, ease: 'power2.out', transformOrigin: 'top' }
      )
    }

    const ctx = gsap.context(() => {
      // Headphone rotation: 0 → -4 → 4 → 0 across the 4 panels
      const rotationTl = gsap.timeline({ paused: true })
      rotationTl
        .to(headphoneRef.current, { rotation:  0, duration: 1, ease: 'none' })
        .to(headphoneRef.current, { rotation: -4, duration: 1, ease: 'none' })
        .to(headphoneRef.current, { rotation:  4, duration: 1, ease: 'none' })
        .to(headphoneRef.current, { rotation:  0, duration: 1, ease: 'none' })

      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   1,
        onUpdate: (self) => {
          const panelIndex = Math.min(Math.floor(self.progress * 4), 3)
          switchPanel(panelIndex)
          rotationTl.progress(self.progress)
        },
      })

      // Fade sticky in when section enters viewport
      ScrollTrigger.create({
        trigger: section,
        start:   'top 80%',
        end:     'top top',
        onEnter: () => gsap.to(stickyRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(stickyRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' }),
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '400vh' }}
      aria-label="VØID — Emotional scroll"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: 'transparent', opacity: 0 }}
      >

        {/* ── Watermarks ── */}
        {PANELS.map((panel, i) => (
          <div
            key={panel.watermark}
            ref={el => { watermarkRefs.current[i] = el }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: 0, zIndex: 0 }}
            aria-hidden="true"
          >
            <span
              className="font-display font-light text-[#E8E8E8] leading-none"
              style={{
                fontSize:      'clamp(18vw, 22vw, 28vw)',
                letterSpacing: '-0.04em',
                opacity:       0.04,
                whiteSpace:    'nowrap',
              }}
            >
              {panel.watermark}
            </span>
          </div>
        ))}

        {/* ── Headphone — mobile: moitié haute · desktop: droite ── */}
        <div
          className="absolute
            top-0 left-0 right-0 h-1/2 flex items-center justify-center
            sm:h-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-[-5%]"
          style={{ zIndex: 2 }}
          aria-hidden="true"
        >
          <div
            ref={headphoneRef}
            className="relative w-[72vw] h-[72vw] sm:w-[min(65vw,800px)] sm:h-[min(65vw,800px)]"
          >
            <Image
              src="/images/void-pro-transparent.png"
              alt="VØID Pro headphone"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 72vw, 800px"
              priority
            />
          </div>
        </div>

        {/* ── Text panels — mobile: moitié basse · desktop: gauche ── */}
        <div
          className="absolute
            bottom-0 left-0 right-0 h-1/2
            border-t border-[#1C1C1C] sm:border-t-0
            sm:h-auto sm:bottom-auto sm:left-[8%] sm:right-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-[35%]"
          style={{ zIndex: 4 }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.word}
              ref={el => { panelRefs.current[i] = el }}
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-0"
              style={{ opacity: 0 }}
            >
              <span
                className="font-display font-light text-[#E8E8E8] leading-none mb-3 block"
                style={{ fontSize: 'clamp(2.6rem, 9vw, 7rem)', letterSpacing: '-0.04em' }}
              >
                {panel.word}
              </span>
              <p
                className="font-sans font-light text-[#666666] leading-relaxed"
                style={{ fontSize: 'clamp(0.8rem, 3.2vw, 1.05rem)', maxWidth: '360px' }}
              >
                {panel.phrase}
              </p>
              {panel.cta && (
                <Link
                  href="/collection"
                  className="self-start mt-6 sm:mt-10 font-sans font-light text-sm text-[#E8E8E8] border border-[#E8E8E8] px-8 py-3.5 transition-colors duration-300 hover:bg-[#E8E8E8] hover:text-[#000000]"
                  data-cursor="pointer"
                  aria-label="Découvrir la collection VØID"
                >
                  Discover the collection
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── Progress bar — unique, repositionnée par breakpoint ── */}
        <div
          className="absolute flex flex-col gap-[6px] sm:gap-2"
          style={{
            right: 'clamp(12px, 4vw, 48px)',
            top:   '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
          }}
          aria-hidden="true"
        >
          {PANELS.map((_, i) => (
            <div
              key={i}
              className="w-px h-7 sm:h-10"
              style={{ background: '#1C1C1C', position: 'relative', overflow: 'hidden' }}
            >
              <div
                ref={el => { progFillRefs.current[i] = el }}
                style={{ position: 'absolute', inset: 0, background: '#4DFFB4', transform: 'scaleY(0)', transformOrigin: 'top' }}
              />
            </div>
          ))}
        </div>

        {/* ── Specs — masquées mobile (redondant avec les panels) · desktop: bas gauche ── */}
        <div
          className="hidden sm:block absolute"
          style={{ left: '48px', bottom: '48px', zIndex: 4 }}
          aria-label="Spécifications clés"
        >
          <span
            className="font-sans font-light text-[#4DFFB4] tracking-widest uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.25em' }}
          >
            40MM · BERYLLIUM · ANC
          </span>
        </div>

      </div>
    </section>
  )
}
