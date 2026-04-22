'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface Props {
  images:   string[]
  name:     string
  category: string
}

export default function ProductGallery({ images, name, category }: Props) {
  const [active, setActive] = useState(0)
  const imgRef   = useRef<HTMLDivElement>(null)
  const prevIdx  = useRef(0)

  // Reset to 0 when images list changes (color switch)
  useEffect(() => { setActive(0) }, [images])

  const goTo = (next: number) => {
    if (next === active) return
    gsap.to(imgRef.current, {
      opacity: 0, scale: 1.03, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        prevIdx.current = active
        setActive(next)
        gsap.fromTo(imgRef.current,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        )
      },
    })
  }

  return (
    <div className="relative h-full flex flex-col bg-[#080808]">

      {/* Category badge */}
      <div className="absolute top-6 left-6 z-10">
        <span
          className="font-sans font-light text-[#4DFFB4] uppercase border border-[#4DFFB4] px-4 py-1.5"
          style={{ fontSize: '10px', letterSpacing: '0.25em' }}
        >
          {category}
        </span>
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-6 z-10">
        <span className="font-mono text-[#333333]" style={{ fontSize: '11px' }}>
          {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 p-12">
          <div className="relative w-full h-full">
            <Image
              src={images[active]}
              alt={`${name} — vue ${active + 1}`}
              fill
              className="object-contain"
              sizes="50vw"
              priority={active === 0}
            />
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-3 py-4" aria-label="Navigation galerie">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Image ${i + 1}`}
            style={{
              width:   i === active ? '24px' : '16px',
              height:  '1px',
              background: i === active ? '#4DFFB4' : '#333333',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 px-6 pb-6" role="list">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="listitem"
            aria-label={`Voir image ${i + 1}`}
            className="relative shrink-0 overflow-hidden"
            style={{
              width:  '72px',
              height: '72px',
              border: `1px solid ${i === active ? '#4DFFB4' : '#1C1C1C'}`,
              background: '#0F0F0F',
              transition: 'border-color 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <Image src={src} alt="" fill className="object-contain p-2" sizes="72px" />
          </button>
        ))}
      </div>
    </div>
  )
}
