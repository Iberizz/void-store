import type { Metadata } from 'next'
import ClientProviders from '@/components/layout/ClientProviders'
import Navbar from '@/components/layout/Navbar'
import './globals.css'
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: 'VØID — Silence. Redefined.',
  description:
    'VØID crafts precision audio instruments for those who demand absolute silence in motion. Premium wireless headphones engineered at the intersection of acoustic science and obsessive design.',
  keywords: ['premium headphones', 'wireless audio', 'noise cancelling', 'VØID', 'luxury audio'],
  openGraph: {
    title: 'VØID — Silence. Redefined.',
    description: 'Premium wireless headphones. Engineered to disappear.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#000000] text-[#F2F2F2] antialiased overflow-x-hidden">
        <Navbar />
        <ClientProviders>{children}</ClientProviders>
        <Footer />
      </body>
    </html>
  )
}
