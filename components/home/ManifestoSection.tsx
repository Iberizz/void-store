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
  const specsRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  // IntersectionObserver — play/pause selon visibilité
  useEffect(() => {
    const section = sectionRef.current
    const video   = videoRef.current
    if (!section || !video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

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
      ref={sectionRef}
      className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-24 bg-[#000000] overflow-hidden"
      aria-label="Manifeste VØID"
    >
      {/* Vidéo headphone exploded */}
      <video
        ref={videoRef}
        src="/videos/headphone-exploded.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', right: 0,
          transform: 'translateY(-50%)',
          height: '70%', width: 'auto',
          objectFit: 'contain',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

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
        VID.
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
            className="font-sans font-light text-xl md:text-3xl leading-[1.6] max-w-3xl text-[#E8E8E8]"
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
