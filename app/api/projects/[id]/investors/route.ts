import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    // Verify project exists and user owns it
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.user_id !== user.id) {
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

    const investorData = {
      project_id: params.id,
      name,
      email: email || null,
      firm: firm || null,
      title: title || null,
      linkedin_url: linkedin_url || null,
      twitter_url: twitter_url || null,
      source: source || 'manual',
      research_status: 'pending',
    }

    const { data: investor, error } = await supabase
      .from('investors')
      .insert([investorData])
      .select()
      .single()

    if (error) {
      console.error('Error creating investor:', error)
      throw error
    }

    return NextResponse.json(investor, { status: 201 })
  } catch (error) {
    console.error('Error creating investor:', error)
    return NextResponse.json(
      {
        error: 'Failed to create investor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

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

    // Verify project exists and user owns it
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all investors for this project
    const { data: investors, error } = await supabase
      .from('investors')
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching investors:', error)
      throw error
    }

    return NextResponse.json(investors || [])
  } catch (error) {
    console.error('Error fetching investors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investors' },
      { status: 500 }
    )
  }
}
