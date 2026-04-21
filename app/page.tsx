import SceneCanvasLoader from '@/components/home/SceneCanvasLoader'
import Hero from '@/components/home/Hero'
import Marquee from '@/components/home/Marquee'
import ManifestoSection from '@/components/home/ManifestoSection'
import StatsSection from '@/components/home/StatsSection'
import CinematicSection from '@/components/home/CinematicSection'
import CollectionPreview from '@/components/home/CollectionPreview'
import FinalCTA from '@/components/home/FinalCTA'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="relative bg-[#000000]">
      {/* Global fixed 3D canvas — z-0, behind everything */}
      <SceneCanvasLoader />

      {/* Section 1 — Hero */}
      <Hero />

      {/* Visual break */}
      <Marquee />

      {/* Section 2 — Stats */}
      <StatsSection />

      {/* Section 3 — Manifesto word reveal */}
      <ManifestoSection />

      {/* Section 4 — Cinematic sticky scroll */}
      <CinematicSection />

      {/* Section 5 — Collection Preview */}
      <CollectionPreview />

      {/* Section 5 — Final CTA */}
      <FinalCTA />

      <Footer />
    </main>
  )
}
