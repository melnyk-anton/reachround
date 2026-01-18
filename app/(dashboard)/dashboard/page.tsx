'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import type { Project } from '@/types'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { GmailConnectButton } from '@/components/gmail/GmailConnectButton'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [hasGmailAccess, setHasGmailAccess] = useState(false)
  const [stats, setStats] = useState({ investors: 0, emailsSent: 0 })

  useEffect(() => {
    fetchProjects()
    checkGmailConnection()
    fetchStats()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const checkGmailConnection = async () => {
    try {
      const response = await fetch('/api/auth/gmail/status')
      if (response.ok) {
        const data = await response.json()
        setHasGmailAccess(data.connected)
      }
    } catch (error) {
      console.error('Error checking Gmail connection:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ReachRound</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              {hasGmailAccess ? (
                <p className="text-xs text-green-600 dark:text-green-400">✓ Gmail Connected</p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400">⚠ Gmail Not Connected</p>
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

            {/* Gmail Status - Only show if not connected */}
            {!hasGmailAccess && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Gmail Connection</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Connect Gmail to send personalized emails to investors
                    </p>
                  </div>
                  <GmailConnectButton size="sm" />
                </div>
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
              <p className="text-3xl font-bold">{loading ? '...' : projects.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {projects.length === 0 ? 'Create your first project' : 'Active projects'}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Investors</h3>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{loading ? '...' : stats.investors}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.investors === 0 ? 'Find investors with AI' : 'Total investors found'}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Emails Sent</h3>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{loading ? '...' : stats.emailsSent}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.emailsSent === 0 ? 'Start reaching out' : 'Total emails sent'}
              </p>
            </div>
          </div>

          {/* Next Steps - Only show when no projects exist */}
          {projects.length === 0 && !loading && (
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
                      AI researches each investor&apos;s background and interests
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
                <Link href="/dashboard/new-project">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Projects List */}
          {projects.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Projects</h3>
                <Link href="/dashboard/new-project">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-card border rounded-lg p-6 hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <Link href={`/dashboard/${project.id}`} className="flex-1">
                        <h4 className="text-lg font-semibold mb-3 hover:text-primary-500 transition-colors">{project.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.industry && (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              {project.industry}
                            </span>
                          )}
                          {project.stage && (
                            <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                              {project.stage}
                            </span>
                          )}
                          {project.target_geography && (
                            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                              {project.target_geography}
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/dashboard/${project.id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
