import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify campaign ownership via project
    const { data: campaign } = await (supabase
      .from('campaigns') as any)
      .select('project:projects(user_id)')
      .eq('id', params.id)
      .single()

    if (!campaign || (campaign as any).project_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get investors for this campaign
    const { data: investors, error } = await (supabase
      .from('investors') as any)
      .select('*')
      .eq('campaign_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching investors:', error)
      throw error
    }

    return NextResponse.json(investors || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investors' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify campaign ownership via project
    const { data: campaign } = await (supabase
      .from('campaigns') as any)
      .select('project_id, project:projects(user_id)')
      .eq('id', params.id)
      .single()

    if (!campaign || (campaign as any).project_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, firm, title, linkedin_url, twitter_url, source } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Create investor
    const investorData = {
      project_id: campaign.project_id,
      campaign_id: params.id,
      name,
      email: email || null,
      firm: firm || null,
      title: title || null,
      linkedin_url: linkedin_url || null,
      twitter_url: twitter_url || null,
      source: source || 'manual',
      research_status: 'pending',
    }

    const { data: investor, error } = await (supabase
      .from('investors') as any)
      .insert([investorData])
      .select()
      .single()

    if (error) {
      console.error('Error creating investor:', error)
      throw error
    }

    return NextResponse.json(investor)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to add investor' },
      { status: 500 }
    )
  }
}
