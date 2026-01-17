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
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, one_liner, industry, stage, target_geography } = body

    if (!name || !one_liner) {
      return NextResponse.json(
        { error: 'Name and one-liner are required' },
        { status: 400 }
      )
    }

    const project = await createProject({
      user_id: user.id,
      name,
      one_liner,
      industry,
      stage,
      target_geography,
      pitch_deck_url: null,
      pitch_summary: null,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
