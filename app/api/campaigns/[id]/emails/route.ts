import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

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

    // Get campaign
    const { data: campaign, error: campaignError } = await (supabase
      .from('campaigns') as any)
      .select('*')
      .eq('id', params.id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Get project to verify ownership
    const { data: project, error: projectError } = await (supabase
      .from('projects') as any)
      .select('*')
      .eq('id', campaign.project_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify ownership
    if ((project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get emails for this campaign with investor details
    // Use service client to bypass RLS (we've already verified ownership above)
    const serviceClient = createServiceClient()
    const { data: emails, error: emailsError } = await (serviceClient
      .from('emails') as any)
      .select('*')
      .eq('campaign_id', params.id)
      .order('generated_at', { ascending: false })

    if (emailsError) {
      console.error('Error fetching emails:', emailsError)
      throw emailsError
    }

    // Fetch investor details for each email
    const emailsWithInvestors = await Promise.all(
      (emails || []).map(async (email: any) => {
        const { data: investor } = await (serviceClient
          .from('investors') as any)
          .select('name, email, firm')
          .eq('id', email.investor_id)
          .single()

        return {
          ...email,
          investor: investor || { name: 'Unknown', email: null, firm: null }
        }
      })
    )

    return NextResponse.json({ emails: emailsWithInvestors })
  } catch (error) {
    console.error('Error fetching campaign emails:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
