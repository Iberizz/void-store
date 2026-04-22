import SceneCanvasLoader from '@/components/home/SceneCanvasLoader'
import Hero from '@/components/home/Hero'
import EmotionalScroll from '@/components/home/EmotionalScroll'
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

{/* Section 2 — Emotional scroll */}
      <EmotionalScroll />

      {/* Section 3 — Stats */}
      <StatsSection />

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
