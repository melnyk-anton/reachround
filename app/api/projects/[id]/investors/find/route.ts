import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { findInvestors } from '@/lib/agents/investor-finder'

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
    const { count = 5, criteria, geography } = body

    // Use AI to find investors
    const investors = await findInvestors({
      projectName: project.name,
      oneLiner: project.one_liner || '',
      industry: project.industry || undefined,
      stage: project.stage || undefined,
      targetGeography: geography || project.target_geography || undefined,
      additionalCriteria: criteria || undefined,
      count,
    })

    return NextResponse.json({ investors })
  } catch (error) {
    console.error('Error finding investors:', error)
    return NextResponse.json(
      {
        error: 'Failed to find investors',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
