'use client'

import dynamic from 'next/dynamic'

const LenisProvider  = dynamic(() => import('@/components/shared/LenisProvider'),  { ssr: false })
const CustomCursor   = dynamic(() => import('@/components/shared/CustomCursor'),    { ssr: false })
const CartDrawer     = dynamic(() => import('@/components/cart/CartDrawer'),        { ssr: false })
const UserStoreSync  = dynamic(() => import('@/components/shared/UserStoreSync'),   { ssr: false })

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <UserStoreSync />
      {children}
      <CustomCursor />
      <CartDrawer />
    </LenisProvider>
  )
}
