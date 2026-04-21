import type { Metadata } from 'next'
import CollectionClient from './CollectionClient'

export const metadata: Metadata = {
  title: 'Collection — VØID',
  description: 'Découvrez la collection AW25 VØID. Casques audio premium Over-ear, In-ear et Studio.',
}

export default function CollectionPage() {
  return (
    <main className="relative z-10 bg-[#000000]">
      <CollectionClient />
    </main>
  )
}
