'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

interface Props {
  href: string
  label: string
  className?: string
  style?: React.CSSProperties
}

export default function MagneticButton({ href, label, className = '', style }: Props) {
  const btnRef   = useRef<HTMLAnchorElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn  = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const dx   = e.clientX - (rect.left + rect.width  / 2)
    const dy   = e.clientY - (rect.top  + rect.height / 2)
    gsap.to(btn,       { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power2.out' })
    gsap.to(innerRef.current, { x: dx * 0.15, y: dy * 0.15, duration: 0.4, ease: 'power2.out' })
  }

  const onLeave = () => {
    gsap.to(btnRef.current,   { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <Link
      ref={btnRef}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="pointer"
      aria-label={label}
      className={`inline-block ${className}`}
      style={{ willChange: 'transform', ...style }}
    >
      <span ref={innerRef} className="block">{label}</span>
    </Link>
  )
}
