'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    one_liner: '',
    industry: '',
    stage: '',
    target_geography: '',
  })

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const project: Project = await response.json()
      setFormData({
        name: project.name,
        one_liner: project.one_liner || '',
        industry: project.industry || '',
        stage: project.stage || '',
        target_geography: project.target_geography || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
      toast.error('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update project')
      }

      toast.success('Project updated successfully')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      toast.error(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-foreground dark:hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-semibold text-foreground dark:text-foreground mb-2">
          Edit Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Update your project information
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label htmlFor="one_liner" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Project Description *
            </label>
            <textarea
              id="one_liner"
              required
              rows={5}
              value={formData.one_liner}
              onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground resize-none"
              placeholder="Describe your project in detail. What problem are you solving? Who are your customers? What traction do you have? Include any key metrics, achievements, or unique differentiators..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide detailed context about your project. The more information, the better the AI can personalize emails to investors.
            </p>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
              placeholder="Fintech, Healthcare, SaaS, etc."
            />
          </div>

          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Stage
            </label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
            >
              <option value="">Select stage</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C+">Series C+</option>
            </select>
          </div>

          <div>
            <label htmlFor="target_geography" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Target Geography
            </label>
            <input
              type="text"
              id="target_geography"
              value={formData.target_geography}
              onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
              placeholder="North America, Europe, Global, etc."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-border dark:border-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
