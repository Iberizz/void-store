'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'

interface ProductCardProps {
  name: string
  price: string
  category: string
  slug: string
  imageSrc: string
  size?: 'large' | 'small'
  delay?: number
  tilt?: boolean
}

export default function ProductCard({
  name, price, category, slug, imageSrc, size = 'small', delay = 0, tilt = true,
}: ProductCardProps) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const cardRef  = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(wrapRef, { once: true, margin: '0px 0px -10% 0px' })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x    = (e.clientX - rect.left)  / rect.width  - 0.5
    const y    = (e.clientY - rect.top)   / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 8, rotateX: -y * 8,
      duration: 0.4, ease: 'power2.out', transformPerspective: 800,
    })
  }

  const onMouseEnter = () =>
    gsap.to(imageRef.current, { scale: 1.03, duration: 0.6, ease: 'power2.out' })

  const onMouseLeave = () => {
    gsap.to(cardRef.current,  { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <motion.div
      ref={wrapRef}
      className="w-full h-full"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={isInView ? { clipPath: 'inset(0 0 0% 0)' } : {}}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay }}
    >
      <Link href={`/product/${slug}`} className="block w-full h-full" data-cursor="pointer" aria-label={`${name} — ${price}`}>
        <div
          ref={cardRef}
          className="relative w-full h-full bg-[#0F0F0F] overflow-hidden"
          style={tilt ? { transformStyle: 'preserve-3d' } : undefined}
          onMouseMove={tilt ? onMouseMove : undefined}
          onMouseEnter={onMouseEnter}
          onMouseLeave={tilt ? onMouseLeave : () => gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' })}
        >
          {/* Category tag */}
          <span className="absolute top-4 left-4 z-10 font-sans font-light uppercase text-[#4DFFB4]"
            style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
            {category}
          </span>

          {/* Image */}
          <div ref={imageRef} className="absolute inset-0 p-8 will-change-transform">
            <div className="relative w-full h-full">
              <Image
                src={imageSrc} alt={name} fill
                className="object-contain"
                sizes={size === 'large' ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 50vw'}
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 border-t border-[#1C1C1C] bg-[#0F0F0F]">
            <span className="font-sans font-light uppercase text-[#F2F2F2]"
              style={{ fontSize: '11px', letterSpacing: '0.15em' }}>
              {name}
            </span>
            <span className="font-sans font-light text-[#4DFFB4]"
              style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
              {price}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
