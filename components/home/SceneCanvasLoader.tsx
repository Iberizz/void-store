'use client'

import dynamic from 'next/dynamic'

const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-[#000000]" />,
})

export default function SceneCanvasLoader() {
  return <SceneCanvas />
}
