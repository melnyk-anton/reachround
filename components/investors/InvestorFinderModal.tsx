'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Search } from 'lucide-react'

interface InvestorFinderModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

interface InvestorMatch {
  name: string
  firm: string
  title: string
  linkedin_url?: string
  twitter_url?: string
  reasoning: string
  match_score: number
  selected?: boolean
}

export function InvestorFinderModal({ open, onClose, projectId, projectName }: InvestorFinderModalProps) {
  const [count, setCount] = useState('5')
  const [criteria, setCriteria] = useState('')
  const [geography, setGeography] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<InvestorMatch[]>([])
  const [adding, setAdding] = useState(false)

  const handleSearch = async () => {
    if (!count || parseInt(count) < 1) {
      toast.error('Please enter a valid number of investors')
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/investors/find`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: parseInt(count),
          criteria: criteria || undefined,
          geography: geography || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to find investors')
      }

      const data = await response.json()
      setResults(data.investors.map((inv: InvestorMatch) => ({ ...inv, selected: true })))
      toast.success(`Found ${data.investors.length} investors!`)
    } catch (error) {
      console.error('Error finding investors:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to find investors')
    } finally {
      setSearching(false)
    }
  }

  const toggleSelection = (index: number) => {
    setResults(prev =>
      prev.map((inv, i) => (i === index ? { ...inv, selected: !inv.selected } : inv))
    )
  }

  const handleAddSelected = async () => {
    const selected = results.filter(inv => inv.selected)
    if (selected.length === 0) {
      toast.error('Please select at least one investor')
      return
    }

    setAdding(true)
    try {
      const promises = selected.map(async (investor) => {
        const response = await fetch(`/api/projects/${projectId}/investors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: investor.name,
            firm: investor.firm,
            title: investor.title,
            linkedin_url: investor.linkedin_url,
            twitter_url: investor.twitter_url,
            source: 'ai_found',
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to add ${investor.name}`)
        }

        return response.json()
      })

      await Promise.all(promises)
      toast.success(`Added ${selected.length} investors!`)
      onClose()
      window.location.reload() // Refresh to show new investors
    } catch (error) {
      console.error('Error adding investors:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add investors')
    } finally {
      setAdding(false)
    }
  }

  const handleClose = () => {
    if (!searching && !adding) {
      setResults([])
      setCriteria('')
      setGeography('')
      setCount('5')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Investors with AI</DialogTitle>
          <DialogDescription>
            Let AI discover investors that match {projectName} using advanced search
          </DialogDescription>
        </DialogHeader>

        {results.length === 0 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="count">Number of Investors</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 investors</SelectItem>
                  <SelectItem value="5">5 investors</SelectItem>
                  <SelectItem value="10">10 investors</SelectItem>
                  <SelectItem value="15">15 investors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="criteria">Additional Criteria (Optional)</Label>
              <Textarea
                id="criteria"
                placeholder="e.g., Focus on fintech, experienced with B2B SaaS, active on Twitter..."
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="geography">Geography (Optional)</Label>
              <Input
                id="geography"
                placeholder="e.g., San Francisco, New York, Europe"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={searching}
              className="w-full"
            >
              {searching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Investors
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Found {results.length} investors. Select the ones you want to add:
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((investor, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    investor.selected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleSelection(index)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={investor.selected}
                      onChange={() => toggleSelection(index)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{investor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {investor.title} at {investor.firm}
                      </div>
                      <div className="text-sm mt-2">{investor.reasoning}</div>
                      <div className="flex gap-2 mt-2">
                        {investor.linkedin_url && (
                          <a
                            href={investor.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            LinkedIn
                          </a>
                        )}
                        {investor.twitter_url && (
                          <a
                            href={investor.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Twitter
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Match Score: {investor.match_score}/10
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setResults([])}
                variant="outline"
                className="flex-1"
                disabled={adding}
              >
                Back to Search
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={adding || results.filter(inv => inv.selected).length === 0}
                className="flex-1"
              >
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${results.filter(inv => inv.selected).length} Selected`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
