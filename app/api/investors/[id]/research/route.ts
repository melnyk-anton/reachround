import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getInvestor, updateInvestor } from '@/lib/supabase/investors'
import { performDeepResearch } from '@/lib/agents/deep-research'
import { generateEmail } from '@/lib/agents/email-writer'
import { getProject } from '@/lib/supabase/projects'

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

    const investor = await getInvestor(params.id)

    if (!investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Get project to verify ownership
    const project = await getProject(investor.project_id)
    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update status to researching
    await updateInvestor(params.id, { research_status: 'researching' })

    try {
      // Perform deep research
      const research = await performDeepResearch({
        investorName: investor.name,
        firm: investor.firm || undefined,
        projectContext: {
          name: project.name,
          oneLiner: project.one_liner || '',
          industry: project.industry || undefined,
          stage: project.stage || undefined,
        },
      })

      // Update investor with research data
      await updateInvestor(params.id, {
        research_status: 'completed',
        research_summary: research.background,
        research_raw: research as any,
        recent_investments: research.recent_investments || [],
        investment_thesis: research.investment_thesis,
        recent_activity: research.recent_activity || [],
        talking_points: research.talking_points || [],
      })

      // Generate initial email
      const email = await generateEmail({
        projectContext: {
          name: project.name,
          oneLiner: project.one_liner || '',
          industry: project.industry || undefined,
          stage: project.stage || undefined,
        },
        investorResearch: research,
      })

      // Create email in database
      const { data: emailData, error: emailError } = await (supabase as any)
        .from('emails')
        .insert([{
          investor_id: params.id,
          project_id: investor.project_id,
          subject: email.subject,
          body: email.body,
          status: 'draft',
        }])
        .select()
        .single()

      if (emailError) {
        console.error('Error creating email:', emailError)
      }

      return NextResponse.json({
        success: true,
        research,
        email: emailData,
      })
    } catch (error) {
      // Update status to failed
      await updateInvestor(params.id, { research_status: 'failed' })
      throw error
    }
  } catch (error) {
    console.error('Error researching investor:', error)
    return NextResponse.json(
      { error: 'Failed to research investor' },
      { status: 500 }
    )
  }
}
