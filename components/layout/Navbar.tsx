'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { href: '/collection', label: 'Collection' },
  { href: '/about',      label: 'About'      },
  { href: '/contact',    label: 'Contact'    },
] as const

export default function Navbar() {
  const pathname   = usePathname()
  const pillRef    = useRef<HTMLDivElement>(null)
  const burgerRef  = useRef<HTMLButtonElement>(null)
  const mobileRef  = useRef<HTMLDivElement>(null)
  const mobileLinksRef = useRef<HTMLDivElement>(null)
  const tlRef      = useRef<gsap.core.Timeline | null>(null)
  const isOpenRef  = useRef(false)
  const [isOpen, setIsOpen] = useState(false)
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null)
  const cartCount  = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setAuthUser(data.user))
  }, [pathname])

  /* ── Scroll → pill border brightens ── */
  useEffect(() => {
    const pill = pillRef.current
    if (!pill) return

    const st = ScrollTrigger.create({
      start: 'top+=50 top',
      onEnter:     () => gsap.to(pill, { borderColor: '#333333', duration: 0.4, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(pill, { borderColor: '#1C1C1C', duration: 0.4, ease: 'power2.out' }),
    })

    return () => st.kill()
  }, [])

  /* ── Pill entrance animation ── */
  useEffect(() => {
    gsap.from(pillRef.current, {
      opacity: 0, y: -16, duration: 0.7, delay: 0.3, ease: 'power3.out',
    })
  }, [])

  /* ── Mobile menu timeline ── */
  useEffect(() => {
    const menu   = mobileRef.current
    const links  = mobileLinksRef.current
    const burger = burgerRef.current
    if (!menu || !links || !burger) return

    const line1 = burger.querySelector<HTMLSpanElement>('[data-line="1"]')
    const line2 = burger.querySelector<HTMLSpanElement>('[data-line="2"]')
    const line3 = burger.querySelector<HTMLSpanElement>('[data-line="3"]')

    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => gsap.set(menu, { display: 'none' }),
    })

    tl.set(menu, { display: 'flex' })
      .to(menu,  { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .to(line2, { opacity: 0, duration: 0.2, ease: 'none' }, '<')
      .to(line1, { y: 7, rotate: 45, duration: 0.35, ease: 'power2.inOut' }, '<')
      .to(line3, { y: -7, rotate: -45, duration: 0.35, ease: 'power2.inOut' }, '<')
      .from(Array.from(links.children), {
        y: 48, opacity: 0, stagger: 0.07, duration: 0.55, ease: 'power4.out',
      }, '-=0.15')

    tlRef.current = tl
    return () => { tl.kill(); tlRef.current = null }
  }, [])

  /* ── Close on route change ── */
  useEffect(() => {
    if (!isOpenRef.current) return
    tlRef.current?.reverse()
    isOpenRef.current = false
    setIsOpen(false)
  }, [pathname])

  /* ── Logo click: refresh if already on home ── */
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      window.location.reload()
    }
  }, [pathname])

  /* ── Nav link click: scroll to top if same page ── */
  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    if (pathname === href || pathname.startsWith(href + '/')) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname])

  const toggleMenu = () => {
    const tl = tlRef.current
    if (!tl) return
    if (isOpenRef.current) {
      tl.reverse(); isOpenRef.current = false; setIsOpen(false)
    } else {
      tl.play();   isOpenRef.current = true;  setIsOpen(true)
    }
  }

  return (
    <>
      {/* ── Floating pill ── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div
          ref={pillRef}
          className="pointer-events-auto flex items-center gap-8 px-6 py-3 rounded-full border border-[#1C1C1C]"
          style={{
            background: 'rgba(15,15,15,0.80)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="font-display font-medium text-[#E8E8E8] tracking-tighter text-base leading-none select-none"
            aria-label="VØID — Retour à l'accueil"
            data-cursor="pointer"
          >
            VØID
          </Link>

          {/* Desktop links */}
          <nav aria-label="Navigation principale">
            <ul className="hidden md:flex items-center gap-6" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <li key={href} className="relative flex flex-col items-center gap-1">
                    <Link
                      href={href}
                      onClick={(e) => handleNavClick(e, href)}
                      className="font-sans font-light text-sm tracking-wide transition-colors duration-200"
                      style={{ color: isActive ? '#E8E8E8' : '#666666' }}
                      aria-label={label}
                      aria-current={isActive ? 'page' : undefined}
                      data-cursor="pointer"
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#E8E8E8' }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#666666' }}
                    >
                      {label}
                    </Link>
                    {isActive && (
                      <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-[#4DFFB4]" aria-hidden="true" />
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Cart */}
          <button
            className="relative p-1 -m-1 text-[#666666] hover:text-[#E8E8E8] transition-colors duration-200"
            aria-label={cartCount > 0 ? `Panier — ${cartCount} article${cartCount > 1 ? 's' : ''}` : 'Ouvrir le panier'}
            onClick={() => useCartStore.getState().openCart()}
            data-cursor="pointer"
            data-cart-target
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#4DFFB4]" aria-hidden="true" />
            )}
          </button>

          {/* BO link — admin only */}
          {authUser?.user_metadata?.is_admin && (
            <Link
              href="/admin"
              aria-label="Back office"
              data-cursor="pointer"
              className="font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
              style={{ color: '#4DFFB4' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.6' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              BO
            </Link>
          )}

          {/* User / Account */}
          <Link
            href={authUser ? '/account' : '/auth/login'}
            aria-label={authUser ? 'My account' : 'Sign in'}
            data-cursor="pointer"
            className="relative p-1 -m-1 transition-colors duration-200"
            style={{ color: authUser ? '#4DFFB4' : '#666666' }}
            onMouseEnter={(e) => { if (!authUser) e.currentTarget.style.color = '#E8E8E8' }}
            onMouseLeave={(e) => { if (!authUser) e.currentTarget.style.color = '#666666' }}
          >
            <User size={18} strokeWidth={1.5} />
            {authUser && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#4DFFB4]" aria-hidden="true" />
            )}
          </Link>

          {/* Burger — mobile only */}
          <button
            ref={burgerRef}
            className="md:hidden flex flex-col justify-center gap-[5px] p-1 -m-1"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            data-cursor="pointer"
          >
            <span data-line="1" className="block w-5 h-px bg-[#E8E8E8] origin-center" />
            <span data-line="2" className="block w-5 h-px bg-[#E8E8E8]" />
            <span data-line="3" className="block w-5 h-px bg-[#E8E8E8] origin-center" />
          </button>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <div
        ref={mobileRef}
        className="md:hidden fixed inset-0 z-40 bg-[#000000] flex-col justify-center px-8"
        style={{ display: 'none', opacity: 0 }}
        aria-hidden={!isOpen}
        aria-label="Menu mobile"
      >
        <div ref={mobileLinksRef} className="flex flex-col gap-6 pt-24">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="font-display text-[clamp(2.5rem,10vw,5rem)] font-medium tracking-tighter leading-none transition-colors duration-200"
                style={{ color: isActive ? '#4DFFB4' : '#E8E8E8' }}
                onClick={(e) => { handleNavClick(e, href); toggleMenu() }}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                data-cursor="pointer"
              >
                {label}
              </Link>
            )
          })}
        </div>
        <p className="absolute bottom-10 left-8 font-sans font-light text-xs tracking-widest text-[#666666] uppercase">
          VØID — Silence. Redefined.
        </p>
      </div>
    </>
  )
}
