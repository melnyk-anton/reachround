import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, body: emailBody } = body

    // Use service client to bypass RLS for fetching
    const serviceClient = createServiceClient()

    // Get email
    const { data: email, error: emailError } = await (serviceClient
      .from('emails') as any)
      .select('*')
      .eq('id', params.id)
      .single()

    if (emailError || !email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Get campaign
    const { data: campaign } = await (serviceClient
      .from('campaigns') as any)
      .select('*')
      .eq('id', email.campaign_id)
      .single()

    // Get project to verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', campaign.project_id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update email (use service client to bypass RLS)
    const { error } = await (serviceClient
      .from('emails') as any)
      .update({
        subject,
        body: emailBody,
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating email:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service client to bypass RLS
    const serviceClient = createServiceClient()

    // Get email
    const { data: email, error: emailError } = await (serviceClient
      .from('emails') as any)
      .select('*')
      .eq('id', params.id)
      .single()

    if (emailError || !email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Get campaign
    const { data: campaign } = await (serviceClient
      .from('campaigns') as any)
      .select('*')
      .eq('id', email.campaign_id)
      .single()

    // Get project to verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', campaign.project_id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete email (use service client to bypass RLS)
    const { error } = await (serviceClient
      .from('emails') as any)
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting email:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    )
  }
}
