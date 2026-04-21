'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WordReveal from '@/components/shared/WordReveal'

gsap.registerPlugin(ScrollTrigger)

const SPECS    = ['40mm', 'Beryllium', 'ANC'] as const
const MANIFESTO =
  'Two drivers. Zero compromise. Every material chosen for silence. Forty hours. One charge. No excuses.'

export default function ManifestoSection() {
  const specsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const specs = specsRef.current
    if (!specs) return

    const ctx = gsap.context(() => {
      gsap.from(Array.from(specs.children), {
        opacity: 0,
        y: 12,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: specs,
          start: 'top 85%',
          once: true,
        },
      })
    }, specs)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-24 bg-transparent overflow-hidden"
      aria-label="Manifeste VØID"
    >
      {/* ① Background number */}
      <span
        className="absolute top-1/2 left-8 -translate-y-1/2 font-display font-medium leading-none select-none pointer-events-none"
        style={{
          fontSize: '20vw',
          color: '#0F0F0F',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        01
      </span>

      {/* Main content */}
      <div className="flex flex-col flex-1 justify-center gap-12 py-24">

        {/* ③ Vertical line + word reveal */}
        <div className="flex items-start gap-8">
          <div
            className="w-px bg-[#1C1C1C] shrink-0 mt-2"
            style={{ height: '4rem' }}
            aria-hidden="true"
          />
          <WordReveal
            text={MANIFESTO}
            className="font-sans font-light text-3xl md:text-5xl leading-[1.4] max-w-3xl text-[#E8E8E8]"
          />
        </div>

        {/* ② Specs row — bottom */}
        <div
          ref={specsRef}
          className="flex flex-row gap-8 mt-auto"
          style={{ paddingBottom: '0' }}
          aria-label="Spécifications clés"
        >
          {SPECS.map((spec) => (
            <span
              key={spec}
              className="font-sans font-light text-xs tracking-[0.2em] uppercase text-[#4DFFB4]"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
