'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Target } from 'lucide-react'
import { toast } from 'sonner'
import type { Project, Campaign } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'

export default function CampaignsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchCampaigns()
  }, [projectId])

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

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/campaigns`)
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Campaigns</h2>
              <p className="text-muted-foreground">
                Create different campaigns for different funding goals or asks
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-purple-900/40 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first campaign to start finding and reaching out to investors
                </p>
                <Button onClick={() => setModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/${projectId}/campaigns/${campaign.id}`}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
                        <p className="text-muted-foreground mb-3">Ask: {campaign.ask}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'active'
                              ? 'bg-green-800/40 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : campaign.status === 'paused'
                              ? 'bg-yellow-800/40 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-gray-800/40 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateCampaignModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        onSuccess={() => {
          fetchCampaigns()
          setModalOpen(false)
        }}
      />
    </div>
  )
}
