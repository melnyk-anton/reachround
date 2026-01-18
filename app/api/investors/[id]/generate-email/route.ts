import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateEmail } from '@/lib/agents/email-generator'

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

    // Get investor
    const { data: investor, error: investorError } = await (supabase
      .from('investors') as any)
      .select('*')
      .eq('id', params.id)
      .single()

    if (investorError || !investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', investor.project_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify ownership
    if ((project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get campaign
    const { data: campaign } = await (supabase
      .from('campaigns') as any)
      .select('*')
      .eq('id', investor.campaign_id)
      .single()

    // Check if investor has been researched
    if (investor.research_status !== 'completed') {
      return NextResponse.json(
        { error: 'Investor must be researched before generating email' },
        { status: 400 }
      )
    }

    // Get research results
    const { data: researchLog } = await (supabase
      .from('research_logs') as any)
      .select('*')
      .eq('investor_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Generate email
    const emailResult = await generateEmail({
      investorName: investor.name,
      firm: investor.firm || undefined,
      projectName: project.name,
      projectOneLiner: project.one_liner || '',
      founderName: user.user_metadata?.full_name || user.email || 'Founder',
      ask: campaign?.ask || 'investment',
      researchSummary: researchLog?.summary,
      thesisAlignment: researchLog?.thesis_alignment,
      personalizationAngles: researchLog?.personalization_angles,
      talkingPoints: researchLog?.recommended_talking_points,
    })

    // Save generated email to database
    // Use service client to bypass RLS (we've already verified ownership above)
    const serviceClient = createServiceClient()
    const emailData = {
      project_id: investor.project_id,
      campaign_id: investor.campaign_id,
      investor_id: params.id,
      subject: emailResult.subject,
      body: emailResult.body,
      status: 'draft',
      generated_at: new Date().toISOString(),
    }

    const { data: savedEmail, error: saveError } = await (serviceClient
      .from('emails') as any)
      .insert([emailData])
      .select()
      .single()

    if (saveError) {
      console.error('Error saving email:', saveError)
      throw saveError
    }

    return NextResponse.json({
      success: true,
      email: {
        id: savedEmail.id,
        ...emailResult,
      },
    })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
