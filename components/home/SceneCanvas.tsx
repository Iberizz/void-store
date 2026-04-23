'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Scroll-driven state keyframes ─────────────────────────── */

interface ScrollKeyframe {
  progress: number
  rotYOffset: number
  scale: number
}

const KEYFRAMES: ScrollKeyframe[] = [
  { progress: 0.0, rotYOffset: 0.0,  scale: 1.0 },
  { progress: 0.3, rotYOffset: 0.5,  scale: 1.1 },
  { progress: 0.6, rotYOffset: 1.2,  scale: 0.9 },
  { progress: 0.9, rotYOffset: 1.2,  scale: 0.9 },
]

function lerpKeyframes(progress: number): { rotYOffset: number; scale: number } {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const from = KEYFRAMES[i]
    const to   = KEYFRAMES[i + 1]
    if (progress >= from.progress && progress <= to.progress) {
      const t = (progress - from.progress) / (to.progress - from.progress)
      return {
        rotYOffset: from.rotYOffset + (to.rotYOffset - from.rotYOffset) * t,
        scale:      from.scale      + (to.scale      - from.scale)      * t,
      }
    }
  }
  return { rotYOffset: KEYFRAMES[KEYFRAMES.length - 1].rotYOffset, scale: KEYFRAMES[KEYFRAMES.length - 1].scale }
}

/* ─── 3D Model ───────────────────────────────────────────────── */

function HeadphoneModel() {
  const groupRef      = useRef<THREE.Group>(null)
  const scrollRef     = useRef(0)
  const idleRotRef    = useRef(0)
  const curRotOff     = useRef(0)
  const curScale      = useRef(1)

  const { scene } = useGLTF('/models/headphone.glb') as { scene: THREE.Group }

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = total > 0 ? Math.min(1, window.scrollY / total) : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    const { rotYOffset, scale } = lerpKeyframes(scrollRef.current)

    // Smooth lerp toward scroll-driven targets
    curRotOff.current  += (rotYOffset - curRotOff.current)  * 0.04
    curScale.current   += (scale      - curScale.current)   * 0.04

    // Continuous idle spin layered on top of the scroll offset
    idleRotRef.current += 0.002

    groupRef.current.rotation.y = idleRotRef.current + curRotOff.current
    groupRef.current.scale.setScalar(curScale.current)
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0.05, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/headphone.glb')

/* ─── SVG Sound Waves ────────────────────────────────────────── */

const WAVE_RADII = [120, 200, 300, 420]

function SoundWaves() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        width="840"
        height="840"
        viewBox="0 0 840 840"
        fill="none"
        style={{ position: 'absolute' }}
      >
        {WAVE_RADII.map((r, i) => (
          <circle
            key={r}
            cx="420"
            cy="420"
            r={r}
            stroke="#1C1C1C"
            strokeWidth="0.5"
            fill="none"
            style={{
              animation: `wave-pulse 3.2s ease-in-out ${i * 0.8}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

/* ─── Scene ──────────────────────────────────────────────────── */

function CameraSetup() {
  const { camera, size } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.position.z = size.width < 640 ? 3.8 : 2.2
    cam.updateProjectionMatrix()
  }, [camera, size.width])
  return null
}

function Scene() {
  return (
    <>
      <CameraSetup />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]}  intensity={3}   color="#E8E8E8" />
      <pointLight position={[-3, 0, 3]} intensity={0.6} color="#4DFFB4" />
      <HeadphoneModel />
    </>
  )
}

/* ─── Export ─────────────────────────────────────────────────── */

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <SoundWaves />
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#000000' }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <Scene />
      </Canvas>
    </div>
  )
}
