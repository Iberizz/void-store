'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    watermark: 'Silence.',
    word:      'SILENCE',
    phrase:    'Engineered to block the world out. ANC −42 dB of pure absence.',
  },
  {
    watermark: 'Clarity.',
    word:      'CLARITY',
    phrase:    'Beryllium drivers, tuned to the edge of perception. Nothing added. Nothing lost.',
  },
  {
    watermark: 'Presence.',
    word:      'PRESENCE',
    phrase:    "48 hours. One charge. The music stays — the battery anxiety doesn't.",
  },
  {
    watermark: 'VØID.',
    word:      'VØID',
    phrase:    'Two drivers. Zero compromise. This is the instrument.',
    cta:       true,
  },
] as const

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

        {/* ── Text panels — left ── */}
        <div
          className="absolute"
          style={{ left: '8%', top: '50%', transform: 'translateY(-50%)', width: '35%', zIndex: 4 }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.word}
              ref={el => { panelRefs.current[i] = el }}
              className="absolute inset-0 flex flex-col justify-center"
              style={{ opacity: 0 }}
            >
              <span
                className="font-display font-light text-[#E8E8E8] leading-none mb-6 block"
                style={{ fontSize: 'clamp(3.5rem, 6vw, 7rem)', letterSpacing: '-0.04em' }}
              >
                {panel.word}
              </span>
              <p
                className="font-sans font-light text-[#666666] leading-relaxed"
                style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1.05rem)', maxWidth: '360px' }}
              >
                {panel.phrase}
              </p>
              {panel.cta && (
                <Link
                  href="/collection"
                  className="self-start mt-10 font-sans font-light text-sm text-[#E8E8E8] border border-[#E8E8E8] px-8 py-3.5 transition-colors duration-300 hover:bg-[#E8E8E8] hover:text-[#000000]"
                  data-cursor="pointer"
                  aria-label="Découvrir la collection VØID"
                >
                  Discover the collection
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── Headphone — right ── */}
        <div
          ref={headphoneRef}
          className="absolute"
          style={{
            right:     '-5%',
            top:       '50%',
            transform: 'translateY(-50%)',
            width:     'min(65vw, 800px)',
            height:    'min(65vw, 800px)',
            zIndex:    2,
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/void-pro-transparent.png"
            alt="VØID Pro headphone"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 65vw, 800px"
            priority
          />
        </div>

        {/* ── Progress bar — right edge ── */}
        <div
          className="absolute flex flex-col gap-2"
          style={{ right: '48px', top: '50%', transform: 'translateY(-50%)', zIndex: 4 }}
          aria-hidden="true"
        >
          {PANELS.map((_, i) => (
            <div
              key={i}
              style={{ width: '1px', height: '40px', background: '#1C1C1C', position: 'relative', overflow: 'hidden' }}
            >
              <div
                ref={el => { progFillRefs.current[i] = el }}
                style={{
                  position:        'absolute',
                  inset:           0,
                  background:      '#4DFFB4',
                  transform:       'scaleY(0)',
                  transformOrigin: 'top',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Specs — bottom left ── */}
        <div
          className="absolute"
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
