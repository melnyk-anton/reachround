import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">ReachRound</h1>
        <p className="text-2xl text-muted-foreground mb-4">
          AI-Powered Investor Outreach
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Send highly personalized cold emails to investors with deep AI research
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="font-semibold mb-2">Deep Research</h3>
            <p className="text-sm text-muted-foreground">
              AI researches each investor&apos;s background, investments, and recent activity
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Personalized Emails</h3>
            <p className="text-sm text-muted-foreground">
              Every email references specific insights - no generic templates
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">You&apos;re in Control</h3>
            <p className="text-sm text-muted-foreground">
              Approve every email before sending from your Gmail account
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
