'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    one_liner: '',
    industry: '',
    stage: '',
    target_geography: '',
    funding_ask: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const project = await response.json()
      router.push(`/dashboard/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
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
          Create New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tell us about your startup to get started with investor outreach
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
              One-Liner *
            </label>
            <input
              type="text"
              id="one_liner"
              required
              value={formData.one_liner}
              onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
              placeholder="AI-powered solution for..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              A brief description of what your company does
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

          <div>
            <label htmlFor="funding_ask" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
              Funding Ask
            </label>
            <input
              type="text"
              id="funding_ask"
              value={formData.funding_ask}
              onChange={(e) => setFormData({ ...formData, funding_ask: e.target.value })}
              className="w-full px-4 py-2 bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground dark:text-foreground"
              placeholder="$500K, $2M, etc."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Project'}
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
