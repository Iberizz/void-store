'use client'

import { useRef, useState, useEffect } from 'react'

const ITEMS = ['SILENCE', 'REDEFINED', 'PREMIUM AUDIO', 'AW25', 'ENGINEERED SOUND', 'VØID']

function MarqueeRow({ direction }: { direction: 'left' | 'right' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLUListElement>(null)
  const copiesRef    = useRef(3)
  const [copies, setCopies] = useState(3)

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const recalculate = () => {
      const trackWidth = track.scrollWidth
      if (!trackWidth) return
      const singleW   = trackWidth / copiesRef.current
      const newCopies = Math.ceil(window.innerWidth / singleW) + 2
      if (newCopies !== copiesRef.current) {
        copiesRef.current = newCopies
        setCopies(newCopies)
      }
    }

    const ro = new ResizeObserver(recalculate)
    ro.observe(container)
    recalculate()

    return () => ro.disconnect()
  }, [])

  const repeated = Array.from({ length: copies }, () => ITEMS).flat()
  const offset   = `${(100 / copies).toFixed(4)}%`

  return (
    <div ref={containerRef} className="overflow-hidden">
      <ul
        ref={trackRef}
        role="list"
        style={{
          display: 'flex',
          willChange: 'transform',
          '--marquee-offset': `-${offset}`,
          animation: `${direction === 'left' ? 'scroll-left' : 'scroll-right'} ${direction === 'left' ? '25s' : '35s'} linear infinite`,
        } as React.CSSProperties}
      >
        {repeated.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-6 shrink-0 font-sans font-light text-sm tracking-[0.15em] uppercase"
            style={{ color: '#444444' }}
          >
            {item}
            <span style={{ color: '#4DFFB4' }} aria-hidden="true">·</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Marquee() {
  return (
    <section
      className="bg-[#080808] py-6 overflow-hidden border-y border-[#1C1C1C] flex flex-col gap-y-3"
      aria-hidden="true"
    >
      <MarqueeRow direction="left" />
      <MarqueeRow direction="right" />
    </section>
  )
}
