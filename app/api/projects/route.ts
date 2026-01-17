import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getProjects, createProject } from '@/lib/supabase/projects'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await getProjects(user.id)
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('[API] Creating project - Start')

    const supabase = createServerClient()
    console.log('[API] Supabase client created')

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[API] User:', user?.email, 'Auth error:', authError?.message)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, one_liner, industry, stage, target_geography } = body
    console.log('[API] Request body:', { name, one_liner, industry, stage, target_geography })

    if (!name || !one_liner) {
      return NextResponse.json(
        { error: 'Name and one-liner are required' },
        { status: 400 }
      )
    }

    const projectData = {
      user_id: user.id,
      name,
      one_liner,
      industry,
      stage,
      target_geography,
      pitch_deck_url: null,
      pitch_summary: null,
    }
    console.log('[API] Project data to insert:', projectData)

    const project = await createProject(projectData)
    console.log('[API] Project created successfully:', project.id)

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)

    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json(
      {
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
