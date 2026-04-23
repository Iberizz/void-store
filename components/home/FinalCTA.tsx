'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import MagneticButton from '@/components/shared/MagneticButton'

gsap.registerPlugin(ScrollTrigger, SplitText)

const TRUST = ['Free shipping', '30-day returns', '2-year warranty']

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref   = useRef<HTMLSpanElement>(null)
  const line2Ref   = useRef<HTMLSpanElement>(null)
  const voidRef    = useRef<HTMLSpanElement>(null)
  const btnRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // SplitText on line 1
      const split1 = new SplitText(line1Ref.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
      const split2 = new SplitText(line2Ref.current, { type: 'chars', charsClass: 'inline-block overflow-hidden' })
      const chars  = [...split1.chars, ...split2.chars] as HTMLElement[]

      gsap.from(chars, {
        y: 80, opacity: 0, stagger: 0.02, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })

      // "void." clip-path reveal
      gsap.fromTo(voidRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.out', delay: 0.6,
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }
      )

      // Button pulse
      gsap.to(btnRef.current, {
        scale: 1.02, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const titleStyle: React.CSSProperties = {
    fontSize:      'clamp(3rem, 9vw, 11rem)',
    fontWeight:    300,
    color:         '#E8E8E8',
    letterSpacing: '-0.04em',
    lineHeight:    0.9,
    display:       'block',
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      aria-label="Call to action final VØID"
    >
      {/* Overlay — lisibilité texte gauche */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(24px, 5vw, 64px)', paddingRight: 'clamp(24px, 5vw, 64px)', width: '100%' }}>
        <div className="grid items-center" style={{ gridTemplateColumns: '60fr 1px 40fr', gap: 0 }}>

          {/* ── Col gauche ── */}
          <div style={{ paddingRight: 'clamp(0px, 5vw, 80px)' }}>
            <p className="font-sans font-light text-[#4DFFB4] uppercase mb-6"
              style={{ fontSize: '10px', letterSpacing: '0.3em' }}>
              THE COLLECTION
            </p>
            <h2 className="font-display select-none">
              <span ref={line1Ref} style={titleStyle}>Enter the</span>
              <span style={titleStyle}>
                <span ref={line2Ref} style={{ color: '#E8E8E8' }}>void</span>
                <span ref={voidRef}  style={{ color: '#4DFFB4', clipPath: 'inset(0 100% 0 0)', display: 'inline-block' }}>.</span>
              </span>
            </h2>
            <p className="font-sans font-light text-[#666666] leading-relaxed mt-8"
              style={{ fontSize: '16px', maxWidth: '400px', fontWeight: 300 }}>
              Experience sound the way it was meant to be heard.
            </p>
            {/* CTA mobile uniquement */}
            <div className="md:hidden mt-10" style={{ width: 'fit-content' }}>
              <MagneticButton
                href="/collection"
                label="Shop the collection →"
                className="font-sans text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300"
                style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 500, padding: '16px 32px', textTransform: 'uppercase' }}
              />
            </div>
          </div>

          {/* ── Séparateur vertical ── */}
          <div className="self-stretch hidden md:block" style={{ background: '#1C1C1C', margin: '0 64px' }} aria-hidden="true" />

          {/* ── Col droite ── */}
          <div className="hidden md:flex flex-col" style={{ paddingLeft: '80px', gap: '32px' }}>
            <p className="font-sans font-light text-[#4DFFB4] uppercase"
              style={{ fontSize: '13px', letterSpacing: '0.2em' }}>
              From €590
            </p>

            <div ref={btnRef} style={{ width: 'fit-content' }}>
              <MagneticButton
                href="/collection"
                label="Shop the collection →"
                className="font-sans text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300"
                style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 500, padding: '20px 48px', textTransform: 'uppercase' }}
              />
            </div>

            <div className="flex flex-col" style={{ gap: '12px' }}>
              {TRUST.map((line) => (
                <p key={line} className="flex items-center font-sans font-light text-[#666666]"
                  style={{ fontSize: '13px', letterSpacing: '0.05em' }}>
                  <span style={{ color: '#4DFFB4', marginRight: '8px' }}>—</span>{line}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
