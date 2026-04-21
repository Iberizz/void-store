'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

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
    groupRef.current.rotation.y += 0.003 + scrollRef.current * 0.008
    const targetZ = 3 - scrollRef.current * 0.5
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} rotation={[0.05, -0.3, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/headphone.glb')

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={4} color="#E8E8E8" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#4DFFB4" />
      <pointLight position={[0, 5, 2]} intensity={2} color="#E8E8E8" />
      <Suspense fallback={null}>
        <HeadphoneModel />
      </Suspense>
    </Canvas>
  )
}
