import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { TrustBadge } from '@/components/landing/TrustBadge'
import { ExampleEmails } from '@/components/landing/ExampleEmails'
import { VideoSection } from '@/components/landing/VideoSection'
import { AnimatedBackground } from '@/components/landing/AnimatedBackground'

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navigation />

      <main>
        <HeroSection />
        <TrustBadge />
        <VideoSection />
        <ExampleEmails />
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="mb-4">
            <Link
              href="/privacy"
              className="text-purple-700 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline"
            >
              Privacy Policy
            </Link>
          </div>
          <p>© 2026 ReachRound. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
