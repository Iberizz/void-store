'use client'

import dynamic from 'next/dynamic'

const HeroBis = dynamic(
  () => import('@/components/home/HeroBis'),
  {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-[#000000]" />,
  }
)

export default function HeroBisLoader() {
  return <HeroBis />
}
