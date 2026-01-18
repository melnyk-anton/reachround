'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Investor {
  id: string
  name: string
  email: string | null
  firm: string | null
  title: string | null
  linkedin_url: string | null
  twitter_url: string | null
}

interface EditInvestorModalProps {
  open: boolean
  onClose: () => void
  investor: Investor | null
  onSuccess: () => void
}

export function EditInvestorModal({ open, onClose, investor, onSuccess }: EditInvestorModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firm: '',
    title: '',
    linkedin_url: '',
    twitter_url: '',
  })

  useEffect(() => {
    if (investor) {
      setFormData({
        name: investor.name || '',
        email: investor.email || '',
        firm: investor.firm || '',
        title: investor.title || '',
        linkedin_url: investor.linkedin_url || '',
        twitter_url: investor.twitter_url || '',
      })
    }
  }, [investor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error('Name is required')
      return
    }

    if (!investor) return

    setSaving(true)
    try {
      const response = await fetch(`/api/investors/${investor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to update investor')
      }

      toast.success('Investor updated successfully!')
      onSuccess()
      handleClose()
    } catch (error) {
      console.error('Error updating investor:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update investor')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Investor</DialogTitle>
          <DialogDescription>
            Update investor information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firm">Firm</Label>
              <Input
                id="firm"
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                placeholder="Acme Ventures"
                disabled={saving}
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Partner"
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="twitter_url">Twitter/X URL</Label>
            <Input
              id="twitter_url"
              type="url"
              value={formData.twitter_url}
              onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
              placeholder="https://twitter.com/..."
              disabled={saving}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
