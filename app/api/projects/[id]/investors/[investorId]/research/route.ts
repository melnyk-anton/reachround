import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { researchInvestor } from '@/lib/agents/investor-researcher'
import type { Project } from '@/types'

export async function POST(
  request: Request,
  { params }: { params: { id: string; investorId: string } }
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
      .single<Project>()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get investor
    const { data: investor, error: investorError } = await (supabase
      .from('investors') as any)
      .select('*')
      .eq('id', params.investorId)
      .eq('project_id', params.id)
      .single()

    if (investorError || !investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Update status to researching
    await (supabase.from('investors') as any)
      .update({ research_status: 'researching' })
      .eq('id', params.investorId)

    // Perform research
    const researchResult = await researchInvestor({
      investorName: investor.name,
      firm: investor.firm || undefined,
      title: investor.title || undefined,
      linkedinUrl: investor.linkedin_url || undefined,
      twitterUrl: investor.twitter_url || undefined,
      projectName: project.name,
      projectOneLiner: project.one_liner || '',
      industry: project.industry || undefined,
      stage: project.stage || undefined,
    })

    // Save research results
    const researchData = {
      investor_id: params.investorId,
      summary: researchResult.summary,
      investment_focus: researchResult.investment_focus,
      recent_investments: researchResult.recent_investments,
      thesis_alignment: researchResult.thesis_alignment,
      personalization_angles: researchResult.personalization_angles,
      recommended_talking_points: researchResult.recommended_talking_points,
      confidence_score: researchResult.confidence_score,
    }

    const { error: logError } = await (supabase
      .from('research_logs') as any)
      .insert([researchData])

    if (logError) {
      console.error('Error saving research log:', logError)
    }

    // Update investor status to completed
    await (supabase.from('investors') as any)
      .update({
        research_status: 'completed',
        research_summary: researchResult.summary,
      })
      .eq('id', params.investorId)

    return NextResponse.json({
      success: true,
      research: researchResult,
    })
  } catch (error) {
    console.error('Error researching investor:', error)

    // Update status to failed
    try {
      const supabase = createServerClient()
      await (supabase.from('investors') as any)
        .update({ research_status: 'failed' })
        .eq('id', params.investorId)
    } catch (updateError) {
      console.error('Error updating failed status:', updateError)
    }

    return NextResponse.json(
      {
        error: 'Failed to research investor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
