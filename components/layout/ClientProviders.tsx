'use client'

import dynamic from 'next/dynamic'

const LenisProvider = dynamic(
  () => import('@/components/shared/LenisProvider'),
  { ssr: false }
)

const CustomCursor = dynamic(
  () => import('@/components/shared/CustomCursor'),
  { ssr: false }
)

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      {children}
      <CustomCursor />
    </LenisProvider>
  )
}
