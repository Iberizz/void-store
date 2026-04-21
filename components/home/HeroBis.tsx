'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/* ─── 3D Model ─────────────────────────────────────────── */

function HeadphoneModel() {
  const groupRef = useRef<THREE.Group>(null)
  const scrollRef = useRef(0)
  const { scene } = useGLTF('/models/headphone.glb') as { scene: THREE.Group }

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = Math.min(1, window.scrollY / window.innerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ camera }) => {
    if (!groupRef.current) return

    /* Idle rotation + scroll boost */
    groupRef.current.rotation.y += 0.003 + scrollRef.current * 0.008

    /* Camera zoom : 3 → 2.5 au scroll */
    const targetZ = 3 - scrollRef.current * 0.5
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      rotation={[0.1, -0.3, 0]}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/headphone.glb')

/* ─── Scene ─────────────────────────────────────────────── */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 3, 5]} intensity={2} color="#E8E8E8" />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#4DFFB4" />
      <Suspense fallback={null}>
        <HeadphoneModel />
      </Suspense>
    </>
  )
}

/* ─── Component ─────────────────────────────────────────── */

export default function HeroBis() {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.from(Array.from(overlay.children), {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      delay: 0.8,
      ease: 'power2.out',
    })
  }, [])

  return (
    <section className="w-full h-screen bg-[#000000] relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000000' }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>

      {/* Overlay texte */}
      <div
        ref={overlayRef}
        className="absolute bottom-16 left-8 md:left-16 flex flex-col gap-3 pointer-events-none"
      >
        <span className="font-sans font-light text-xs tracking-[0.2em] text-[#666666] uppercase">
          VØID — 001
        </span>
        <h2
          className="font-display text-6xl text-[#E8E8E8] leading-none"
          style={{ letterSpacing: '-0.03em' }}
        >
          Experience the void.
        </h2>
      </div>
    </section>
  )
}
