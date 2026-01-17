'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Project } from '@/types'

interface EditProjectModalProps {
  open: boolean
  onClose: () => void
  project: Project
  onSuccess: () => void
}

export function EditProjectModal({ open, onClose, project, onSuccess }: EditProjectModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: project.name,
    one_liner: project.one_liner || '',
    industry: project.industry || '',
    stage: project.stage || '',
    target_geography: project.target_geography || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.one_liner) {
      toast.error('Name and one-liner are required')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to update project')
      }

      toast.success('Project updated successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update project')
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
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Startup"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="one_liner">One-Liner *</Label>
            <Textarea
              id="one_liner"
              value={formData.one_liner}
              onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
              placeholder="A brief description of what your startup does"
              rows={2}
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Fintech, Healthcare, SaaS"
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="stage">Stage</Label>
            <Input
              id="stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              placeholder="e.g., Pre-seed, Seed, Series A"
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="target_geography">Target Geography</Label>
            <Input
              id="target_geography"
              value={formData.target_geography}
              onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })}
              placeholder="e.g., North America, Europe, Global"
              disabled={saving}
            />
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
