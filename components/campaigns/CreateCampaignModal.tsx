'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface CreateCampaignModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  onSuccess: () => void
}

export function CreateCampaignModal({ open, onClose, projectId, onSuccess }: CreateCampaignModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ask: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.ask) {
      toast.error('Name and ask are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to create campaign')
      }

      toast.success('Campaign created successfully!')
      onSuccess()
      handleClose()
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setFormData({ name: '', ask: '' })
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new outreach campaign with a specific ask
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pre-seed Round, Seed Funding"
              required
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              A descriptive name for this campaign
            </p>
          </div>

          <div>
            <Label htmlFor="ask">What are you asking for? *</Label>
            <Input
              id="ask"
              value={formData.ask}
              onChange={(e) => setFormData({ ...formData, ask: e.target.value })}
              placeholder="e.g., Pre-seed funding ($500k), Seed round ($2M), Advisory"
              required
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              What you want from investors in this campaign
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
