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

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get campaigns
    const { data: campaigns, error } = await (supabase
      .from('campaigns') as any)
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns:', error)
      throw error
    }

    return NextResponse.json(campaigns || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, ask } = body

    if (!name || !ask) {
      return NextResponse.json(
        { error: 'Name and ask are required' },
        { status: 400 }
      )
    }

    // Create campaign
    const { data: campaign, error } = await (supabase
      .from('campaigns') as any)
      .insert([{
        project_id: params.id,
        name,
        ask,
        status: 'active',
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      throw error
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
