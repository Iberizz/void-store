'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef  = useRef<Lenis | null>(null)
  const tickerRef = useRef<((time: number) => void) | null>(null)
  const pathname  = usePathname()

  /* Désactive la restauration de scroll du navigateur une seule fois */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    // Cleanup instance précédente
    if (tickerRef.current) gsap.ticker.remove(tickerRef.current)
    if (lenisRef.current)  lenisRef.current.destroy()

    // Reset toutes les couches de scroll avant que Lenis prenne la main
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Force Lenis lui-même à 0 (sans animation)
    lenis.scrollTo(0, { immediate: true })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    tickerRef.current = tick
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [pathname])

  return <>{children}</>
}
