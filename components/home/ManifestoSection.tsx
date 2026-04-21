'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WordReveal from '@/components/shared/WordReveal'

gsap.registerPlugin(ScrollTrigger)

const SPECS = ['40mm', 'Beryllium', 'ANC']

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
        x: 24,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: specs,
          start: 'top 75%',
          once: true,
        },
      })
    }, specs)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="relative z-10 min-h-screen flex items-center px-8 md:px-24 bg-transparent"
      aria-label="Manifeste VØID"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-16 md:gap-24 items-center">
        {/* Word reveal — left */}
        <WordReveal
          text={MANIFESTO}
          className="font-sans font-light text-3xl md:text-5xl leading-[1.4] max-w-3xl text-[#E8E8E8]"
        />

        {/* Specs — right */}
        <div
          ref={specsRef}
          className="flex flex-row md:flex-col gap-6 md:gap-8"
          aria-label="Spécifications clés"
        >
          {SPECS.map((spec) => (
            <div key={spec} className="flex flex-col gap-1">
              <span
                className="font-sans font-light text-sm tracking-[0.2em] text-[#4DFFB4] uppercase"
              >
                {spec}
              </span>
              <span className="block w-8 h-px bg-[#1C1C1C]" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
