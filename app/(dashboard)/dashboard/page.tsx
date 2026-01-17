'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, session, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  // Check if user has Gmail access
  const hasGmailAccess = session?.provider_token !== null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ReachRound</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              {hasGmailAccess ? (
                <p className="text-xs text-green-600">✓ Gmail Connected</p>
              ) : (
                <p className="text-xs text-amber-600">⚠ Gmail Not Connected</p>
              )}
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to ReachRound! 👋
            </h2>
            <p className="text-muted-foreground mb-4">
              Your AI-powered investor outreach platform is ready.
            </p>

            {/* Gmail Status */}
            {hasGmailAccess ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Gmail Connected</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You're all set to send emails from your Gmail account!
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">Gmail Not Connected</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  We need Gmail access to send emails on your behalf. Please sign out and sign in again to grant Gmail permissions.
                </p>
                <Button onClick={handleSignOut} size="sm" variant="outline">
                  Sign Out & Reconnect
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first project</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Investors</h3>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">Find investors with AI</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Emails Sent</h3>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">Start reaching out</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Create Your Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Add your startup information so AI can personalize emails
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Find Investors</h4>
                  <p className="text-sm text-muted-foreground">
                    Let AI discover investors matching your startup
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Deep Research</h4>
                  <p className="text-sm text-muted-foreground">
                    AI researches each investor's background and interests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Review & Send</h4>
                  <p className="text-sm text-muted-foreground">
                    Approve personalized emails and send from your Gmail
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button disabled className="w-full">
                Create Your First Project (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Debug Info (for development) */}
          <div className="mt-8 bg-muted p-4 rounded-lg">
            <details>
              <summary className="text-sm font-medium cursor-pointer">Debug Info</summary>
              <div className="mt-2 text-xs space-y-1">
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Provider Token:</strong> {session?.provider_token ? '✓ Present' : '✗ Missing'}</p>
                <p><strong>Provider Refresh Token:</strong> {session?.provider_refresh_token ? '✓ Present' : '✗ Missing'}</p>
                <p><strong>Session Expires:</strong> {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}</p>
              </div>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
