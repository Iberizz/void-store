'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      gsap.from(Array.from(container.children), {
        opacity: 0,
        y: 32,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          once: true,
        },
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center px-8 bg-transparent"
      aria-label="Call to action final"
    >
      <div ref={containerRef} className="flex flex-col items-center gap-8">
        <h2
          className="font-display font-medium text-[#E8E8E8] leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '-0.04em' }}
        >
          Ready for silence?
        </h2>

        <Link
          href="/collection"
          className="font-sans font-light text-sm tracking-[0.15em] uppercase text-[#4DFFB4] border border-[#4DFFB4] px-12 py-4 transition-all duration-300 hover:bg-[#4DFFB4] hover:text-[#000000]"
          data-cursor="pointer"
          aria-label="Commander VØID — 349€"
        >
          Order now — €&thinsp;349
        </Link>

        <p className="font-sans font-light text-sm text-[#666666]">
          Free shipping&ensp;·&ensp;30-day returns
        </p>
      </div>
    </section>
  )
}
