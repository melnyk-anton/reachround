import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { TrustBadge } from '@/components/landing/TrustBadge'
import { LogoMarquee } from '@/components/landing/LogoMarquee'
import { FeatureCards } from '@/components/landing/FeatureCards'

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />

      <main>
        <HeroSection />
        <DashboardPreview />
        <TrustBadge />
        <LogoMarquee />
        <FeatureCards />
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 ReachRound. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
