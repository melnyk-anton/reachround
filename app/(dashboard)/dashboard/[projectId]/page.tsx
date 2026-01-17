'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types'
import { Button } from '@/components/ui/button'
import { InvestorFinderModal } from '@/components/investors/InvestorFinderModal'
import { EditProjectModal } from '@/components/projects/EditProjectModal'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

interface Investor {
  id: string
  name: string
  email: string | null
  firm: string | null
  title: string | null
  linkedin_url: string | null
  twitter_url: string | null
  research_status: string
  source: string
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [finderModalOpen, setFinderModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
      router.push('/dashboard')
    }
  }

  const fetchInvestors = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/investors`)
      if (!response.ok) throw new Error('Failed to fetch investors')
      const data = await response.json()
      setInvestors(data)
    } catch (error) {
      console.error('Error fetching investors:', error)
      toast.error('Failed to load investors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
    fetchInvestors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const researchedCount = investors.filter(inv => inv.research_status === 'completed').length
  const sentCount = 0 // TODO: Count from emails table

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-muted-foreground">{project.one_liner}</p>
              <div className="flex flex-wrap gap-2 mt-3">
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
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              Edit Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Investors</div>
              <div className="text-2xl font-bold">{investors.length}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Researched</div>
              <div className="text-2xl font-bold">{researchedCount}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Emails Sent</div>
              <div className="text-2xl font-bold">{sentCount}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Replies</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Find Investors with AI</h3>
                  <p className="text-sm opacity-90">
                    Let AI discover investors that match your startup using advanced search
                  </p>
                </div>
                <Search className="w-8 h-8 opacity-80" />
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setFinderModalOpen(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Find Investors
              </Button>
            </div>

            <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Investor Manually</h3>
                  <p className="text-sm opacity-90">
                    Add a specific investor you want to reach out to
                  </p>
                </div>
                <Plus className="w-8 h-8 opacity-80" />
              </div>
              <Button variant="secondary" className="w-full" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Add Investor (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Investors List or Empty State */}
          {investors.length === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Investors Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by finding investors with AI or add them manually. Our AI will research each investor and generate personalized emails.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setFinderModalOpen(true)}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Investors
                  </Button>
                  <Button variant="outline" disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Investors ({investors.length})</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setFinderModalOpen(true)} size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Find More
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {investors.map((investor) => (
                  <div
                    key={investor.id}
                    className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{investor.name}</h3>
                            {investor.title && investor.firm && (
                              <p className="text-sm text-muted-foreground">
                                {investor.title} at {investor.firm}
                              </p>
                            )}
                            {investor.email && (
                              <p className="text-sm text-muted-foreground mt-1">{investor.email}</p>
                            )}
                            <div className="flex gap-3 mt-2">
                              {investor.linkedin_url && (
                                <a
                                  href={investor.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  LinkedIn
                                </a>
                              )}
                              {investor.twitter_url && (
                                <a
                                  href={investor.twitter_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  Twitter
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                investor.research_status === 'completed'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                  : investor.research_status === 'researching'
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                  : investor.research_status === 'failed'
                                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {investor.research_status === 'completed'
                                ? 'Researched'
                                : investor.research_status === 'researching'
                                ? 'Researching...'
                                : investor.research_status === 'failed'
                                ? 'Failed'
                                : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {investor.research_status === 'pending' && (
                      <div className="mt-4">
                        <Button size="sm" disabled>
                          Start Research (Coming Soon)
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <InvestorFinderModal
        open={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        projectId={projectId}
        projectName={project.name}
      />

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
        onSuccess={fetchProject}
      />
    </div>
  )
}
