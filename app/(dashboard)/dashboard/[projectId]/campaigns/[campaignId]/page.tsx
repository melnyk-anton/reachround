'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Loader2, Mail, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import type { Campaign } from '@/types'
import { Button } from '@/components/ui/button'
import { InvestorFinderModal } from '@/components/investors/InvestorFinderModal'
import { AddInvestorModal } from '@/components/investors/AddInvestorModal'
import { EditInvestorModal } from '@/components/investors/EditInvestorModal'

interface Investor {
  id: string
  name: string
  email: string | null
  firm: string | null
  title: string | null
  linkedin_url: string | null
  twitter_url: string | null
  research_status: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const campaignId = params.campaignId as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [emailCount, setEmailCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [finderModalOpen, setFinderModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [researchingIds, setResearchingIds] = useState<Set<string>>(new Set())
  const [generatingEmailIds, setGeneratingEmailIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCampaign()
    fetchInvestors()
    fetchEmailCount()
  }, [campaignId])

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`)
      if (!response.ok) throw new Error('Failed to fetch campaign')
      const data = await response.json()
      setCampaign(data)
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast.error('Failed to load campaign')
      router.push(`/dashboard/${projectId}/campaigns`)
    }
  }

  const fetchInvestors = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/investors`)
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

  const fetchEmailCount = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/emails`)
      if (!response.ok) throw new Error('Failed to fetch emails')
      const data = await response.json()
      setEmailCount(data.emails?.length || 0)
    } catch (error) {
      console.error('Error fetching email count:', error)
    }
  }

  const handleStartResearch = async (investorId: string) => {
    setResearchingIds(prev => new Set(prev).add(investorId))
    toast.loading('Researching investor...', { id: `research-${investorId}` })

    try {
      const response = await fetch(
        `/api/investors/${investorId}/research`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to start research')
      }

      toast.success('Research completed!', { id: `research-${investorId}` })
      fetchInvestors()
    } catch (error) {
      console.error('Error starting research:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start research', { id: `research-${investorId}` })
      fetchInvestors()
    } finally {
      setResearchingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(investorId)
        return newSet
      })
    }
  }

  const handleGenerateEmail = async (investorId: string) => {
    setGeneratingEmailIds(prev => new Set(prev).add(investorId))
    toast.loading('Generating email...', { id: `email-${investorId}` })

    try {
      const response = await fetch(
        `/api/investors/${investorId}/generate-email`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to generate email')
      }

      toast.success('Email generated successfully!', { id: `email-${investorId}` })
      fetchEmailCount()
      router.push(`/dashboard/${projectId}/campaigns/${campaignId}/emails`)
    } catch (error) {
      console.error('Error generating email:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate email', { id: `email-${investorId}` })
    } finally {
      setGeneratingEmailIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(investorId)
        return newSet
      })
    }
  }

  const researchedCount = investors.filter(inv => inv.research_status === 'completed').length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaign) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/dashboard/${projectId}/campaigns`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
            <p className="text-muted-foreground">Ask: {campaign.ask}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Investors</div>
              <div className="text-2xl font-bold">{investors.length}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Researched</div>
              <div className="text-2xl font-bold">{researchedCount}</div>
            </div>
            <Link href={`/dashboard/${projectId}/campaigns/${campaignId}/emails`}>
              <div className="bg-card border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
                <div className="text-sm text-muted-foreground mb-1">Emails</div>
                <div className="text-2xl font-bold">{emailCount}</div>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Find Investors with AI</h3>
                  <p className="text-sm opacity-90">
                    Let AI discover investors for this campaign
                  </p>
                </div>
                <Search className="w-8 h-8 opacity-80" />
              </div>
              <Button
                className="w-full bg-purple-950 hover:bg-purple-950/80 text-white"
                onClick={() => setFinderModalOpen(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Find Investors
              </Button>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Investor Manually</h3>
                  <p className="text-sm opacity-90">
                    Add a specific investor to this campaign
                  </p>
                </div>
                <Plus className="w-8 h-8 opacity-80" />
              </div>
              <Button
                className="w-full bg-indigo-950 hover:bg-indigo-950/80 text-white"
                onClick={() => setAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Investor
              </Button>
            </div>
          </div>

          {/* Email Queue Link */}
          {researchedCount > 0 && (
            <div className="mb-8">
              <Link href={`/dashboard/${projectId}/campaigns/${campaignId}/emails`}>
                <div className="bg-gradient-to-br from-violet-900 to-violet-800 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Review & Send Emails</h3>
                      <p className="text-sm opacity-90">
                        View generated emails, make edits, and send to investors
                      </p>
                    </div>
                    <Mail className="w-8 h-8 opacity-80" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Investors List */}
          {investors.length === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Investors Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by finding investors with AI or add them manually
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setFinderModalOpen(true)}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Investors
                  </Button>
                  <Button variant="outline" onClick={() => setAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Firm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {investors.map((investor) => (
                    <tr key={investor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{investor.name}</div>
                        {investor.title && (
                          <div className="text-sm text-muted-foreground">{investor.title}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {investor.firm || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          investor.research_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : investor.research_status === 'researching'
                            ? 'bg-blue-100 text-blue-800'
                            : investor.research_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {investor.research_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedInvestor(investor)
                              setEditModalOpen(true)
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {investor.research_status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartResearch(investor.id)}
                              disabled={researchingIds.has(investor.id)}
                            >
                              {researchingIds.has(investor.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Researching...
                                </>
                              ) : (
                                'Start Research'
                              )}
                            </Button>
                          )}
                          {investor.research_status === 'researching' && (
                            <Button size="sm" disabled>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Researching...
                            </Button>
                          )}
                          {investor.research_status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateEmail(investor.id)}
                              disabled={generatingEmailIds.has(investor.id)}
                            >
                              {generatingEmailIds.has(investor.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                'Generate Email'
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <InvestorFinderModal
        open={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        projectId={projectId}
        campaignId={campaignId}
        campaignAsk={campaign?.ask}
        onSuccess={() => {
          fetchInvestors()
          setFinderModalOpen(false)
        }}
      />

      <AddInvestorModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        projectId={projectId}
        campaignId={campaignId}
        onSuccess={() => {
          fetchInvestors()
          setAddModalOpen(false)
        }}
      />

      <EditInvestorModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedInvestor(null)
        }}
        investor={selectedInvestor}
        onSuccess={() => {
          fetchInvestors()
          setEditModalOpen(false)
          setSelectedInvestor(null)
        }}
      />
    </div>
  )
}
