'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle2, XCircle, Edit2, Save, Mail } from 'lucide-react'

interface Email {
  id: string
  investor_id: string
  subject: string
  body: string
  status: 'draft' | 'approved' | 'sent'
  generated_at: string
  investor: {
    name: string
    firm: string | null
    email: string | null
  }
}

export default function EmailQueuePage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedSubject, setEditedSubject] = useState('')
  const [editedBody, setEditedBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | 'draft' | 'approved' | 'sent'>('all')

  useEffect(() => {
    fetchEmails()
  }, [params.projectId])

  const fetchEmails = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}/emails`)
      if (!response.ok) throw new Error('Failed to fetch emails')
      const data = await response.json()
      setEmails(data.emails || [])
    } catch (error) {
      console.error('Error fetching emails:', error)
      toast.error('Failed to load emails')
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (email: Email) => {
    setEditingId(email.id)
    setEditedSubject(email.subject)
    setEditedBody(email.body)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditedSubject('')
    setEditedBody('')
  }

  const saveEdit = async (emailId: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editedSubject,
          body: editedBody,
        }),
      })

      if (!response.ok) throw new Error('Failed to save changes')

      toast.success('Email updated successfully')
      setEditingId(null)
      fetchEmails()
    } catch (error) {
      console.error('Error saving email:', error)
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const approveEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/approve`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to approve email')

      toast.success('Email approved')
      fetchEmails()
    } catch (error) {
      console.error('Error approving email:', error)
      toast.error('Failed to approve email')
    }
  }

  const rejectEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to reject email')

      toast.success('Email rejected')
      fetchEmails()
    } catch (error) {
      console.error('Error rejecting email:', error)
      toast.error('Failed to reject email')
    }
  }

  const sendApprovedEmails = async () => {
    const approvedEmails = emails.filter(e => e.status === 'approved')
    if (approvedEmails.length === 0) {
      toast.error('No approved emails to send')
      return
    }

    try {
      const response = await fetch(`/api/projects/${params.projectId}/emails/send-approved`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to send emails')

      toast.success(`Sent ${approvedEmails.length} email(s)`)
      fetchEmails()
    } catch (error) {
      console.error('Error sending emails:', error)
      toast.error('Failed to send emails')
    }
  }

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true
    return email.status === filter
  })

  const stats = {
    draft: emails.filter(e => e.status === 'draft').length,
    approved: emails.filter(e => e.status === 'approved').length,
    sent: emails.filter(e => e.status === 'sent').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emails...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/${params.projectId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
            <h1 className="text-3xl font-bold">Email Approval Queue</h1>
          </div>
          {stats.approved > 0 && (
            <Button onClick={sendApprovedEmails} className="gap-2">
              <Mail className="w-4 h-4" />
              Send {stats.approved} Approved Email{stats.approved !== 1 ? 's' : ''}
            </Button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({emails.length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
            size="sm"
          >
            Draft ({stats.draft})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            size="sm"
          >
            Approved ({stats.approved})
          </Button>
          <Button
            variant={filter === 'sent' ? 'default' : 'outline'}
            onClick={() => setFilter('sent')}
            size="sm"
          >
            Sent ({stats.sent})
          </Button>
        </div>

        {filteredEmails.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No emails found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEmails.map((email) => (
              <Card key={email.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{email.investor.name}</h3>
                    {email.investor.firm && (
                      <p className="text-sm text-gray-600">{email.investor.firm}</p>
                    )}
                    {email.investor.email && (
                      <p className="text-sm text-gray-500">{email.investor.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {email.status === 'draft' && (
                      <>
                        {editingId === email.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(email.id)}
                              disabled={saving}
                              className="gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(email)}
                              className="gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectEmail(email.id)}
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => approveEmail(email.id)}
                              className="gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </Button>
                          </>
                        )}
                      </>
                    )}
                    {email.status === 'approved' && (
                      <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        Approved
                      </span>
                    )}
                    {email.status === 'sent' && (
                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Sent
                      </span>
                    )}
                  </div>
                </div>

                {editingId === email.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`subject-${email.id}`}>Subject</Label>
                      <Input
                        id={`subject-${email.id}`}
                        value={editedSubject}
                        onChange={(e) => setEditedSubject(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`body-${email.id}`}>Body</Label>
                      <Textarea
                        id={`body-${email.id}`}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        rows={12}
                        disabled={saving}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Subject</Label>
                      <p className="font-semibold">{email.subject}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Body</Label>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                        {email.body}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Generated {new Date(email.generated_at).toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
