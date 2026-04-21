'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface WordRevealProps {
  text: string
  className?: string
}

export default function WordReveal({ text, className }: WordRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const spans = Array.from(
      container.querySelectorAll<HTMLSpanElement>('[data-word]')
    )

    const ctx = gsap.context(() => {
      gsap.to(spans, {
        opacity: 1,
        ease: 'none',
        stagger: {
          each: 1 / spans.length,
          from: 'start',
        },
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: 1,
        },
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <p ref={containerRef} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          style={{ opacity: 0.15, display: 'inline' }}
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}
