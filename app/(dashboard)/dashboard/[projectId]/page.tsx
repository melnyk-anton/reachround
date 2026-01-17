'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types'
import { Button } from '@/components/ui/button'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
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
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
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
            <Button variant="outline" size="sm">
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
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Researched</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Emails Sent</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Replies</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Find Investors with AI</h3>
                  <p className="text-sm opacity-90">
                    Let AI discover investors that match your startup using advanced search
                  </p>
                </div>
                <Search className="w-8 h-8 opacity-80" />
              </div>
              <Button variant="secondary" className="w-full" disabled>
                Find Investors (Coming Soon)
              </Button>
            </div>

            <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl p-6 text-white">
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
                Add Investor (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Empty State */}
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
                <Button disabled>
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
        </div>
      </main>
    </div>
  )
}
