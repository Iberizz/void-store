'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CURSOR_SIZE_DEFAULT = 12
const CURSOR_SIZE_HOVER   = 40

export default function CustomCursor() {
  const cursorRef   = useRef<HTMLDivElement>(null)
  const hasShownRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    /* Parked off-screen, invisible until first mousemove */
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -200, y: -200, opacity: 0 })

    const onMouseMove = (e: MouseEvent) => {
      if (!hasShownRef.current) {
        hasShownRef.current = true
        /* Snap to exact position first, then fade in — no flash */
        gsap.set(cursor, { x: e.clientX, y: e.clientY })
        gsap.to(cursor, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const onPointerEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      if (target.dataset.cursor !== 'pointer') return
      gsap.to(cursor, {
        width: CURSOR_SIZE_HOVER,
        height: CURSOR_SIZE_HOVER,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const onPointerLeave = () => {
      gsap.to(cursor, {
        width: CURSOR_SIZE_DEFAULT,
        height: CURSOR_SIZE_DEFAULT,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const bindPointerElements = () => {
      document.querySelectorAll<HTMLElement>('[data-cursor="pointer"]').forEach((el) => {
        el.addEventListener('mouseenter', onPointerEnter)
        el.addEventListener('mouseleave', onPointerLeave)
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    bindPointerElements()

    const observer = new MutationObserver(bindPointerElements)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      document.querySelectorAll<HTMLElement>('[data-cursor="pointer"]').forEach((el) => {
        el.removeEventListener('mouseenter', onPointerEnter)
        el.removeEventListener('mouseleave', onPointerLeave)
      })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: CURSOR_SIZE_DEFAULT,
        height: CURSOR_SIZE_DEFAULT,
        borderRadius: '50%',
        backgroundColor: '#E8E8E8',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform, width, height',
      }}
    />
  )
}
