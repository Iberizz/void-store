'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function OrderSuccess() {
  const circleRef = useRef<SVGCircleElement>(null)
  const checkRef  = useRef<SVGPathElement>(null)
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const subRef    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const circle = circleRef.current
      const check  = checkRef.current
      if (!circle || !check) return

      const circleLen = circle.getTotalLength?.() ?? 188
      const checkLen  = check.getTotalLength?.() ?? 50

      gsap.set(circle, { strokeDasharray: circleLen, strokeDashoffset: circleLen })
      gsap.set(check,  { strokeDasharray: checkLen,  strokeDashoffset: checkLen  })

      const tl = gsap.timeline()
      tl.to(circle, { strokeDashoffset: 0, duration: 0.8, ease: 'expo.out' })
        .to(check,   { strokeDashoffset: 0, duration: 0.5, ease: 'expo.out' }, '-=0.2')
        .from(titleRef.current, { opacity: 0, y: 16, duration: 0.6, ease: 'expo.out' }, '-=0.1')
        .from(subRef.current,   { opacity: 0, y: 8,  duration: 0.5, ease: 'expo.out' }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex flex-col items-center text-center mb-12">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true" className="mb-6">
        <circle
          ref={circleRef}
          cx="36" cy="36" r="30"
          stroke="#4DFFB4"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          ref={checkRef}
          d="M22 36l10 10 18-18"
          stroke="#4DFFB4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <h1
        ref={titleRef}
        className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.04em] mb-3"
      >
        Payment approved.
      </h1>
      <p ref={subRef} className="font-sans text-void-muted text-sm">
        Your VØID order is confirmed. We'll send you a tracking update soon.
      </p>
    </div>
  )
}
