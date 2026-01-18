import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all user's projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    const projectIds = projects?.map(p => p.id) || []

    // Get all campaigns for these projects
    let campaignIds: string[] = []
    if (projectIds.length > 0) {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id')
        .in('project_id', projectIds)

      if (!campaignsError && campaigns) {
        campaignIds = campaigns.map(c => c.id)
      }
    }

    // Get total investors count from both campaign-based and project-based systems
    let investorCount = 0

    // Count campaign-based investors
    if (campaignIds.length > 0) {
      const { count, error: campaignInvestorsError } = await supabase
        .from('investors')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', campaignIds)

      if (!campaignInvestorsError && count !== null) {
        investorCount += count
      }
    }

    // Count project-based investors (older system)
    if (projectIds.length > 0) {
      const { count, error: projectInvestorsError } = await supabase
        .from('investors')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .is('campaign_id', null) // Only count those NOT in campaigns to avoid double-counting

      if (!projectInvestorsError && count !== null) {
        investorCount += count
      }
    }

    // Get total sent emails count from both campaign-based and project-based emails
    let emailsSentCount = 0

    // Count campaign-based emails
    if (campaignIds.length > 0) {
      // Use service client to bypass RLS and see if emails exist
      const serviceClient = createServiceClient()

      // Debug: Let's see ALL emails in these campaigns with their statuses (bypassing RLS)
      const { data: allCampaignEmailsService } = await (serviceClient
        .from('emails') as any)
        .select('id, status, campaign_id')
        .in('campaign_id', campaignIds)

      console.log('All campaign emails (service client, bypassing RLS):', JSON.stringify(allCampaignEmailsService, null, 2))

      // Also check with regular client
      const { data: allCampaignEmails } = await supabase
        .from('emails')
        .select('id, status, campaign_id')
        .in('campaign_id', campaignIds)

      console.log('All campaign emails (regular client, with RLS):', JSON.stringify(allCampaignEmails, null, 2))

      // Count using service client
      const { count, error: campaignEmailsError } = await (serviceClient
        .from('emails') as any)
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', campaignIds)
        .eq('status', 'sent')

      console.log('Campaign sent emails count:', count, 'error:', campaignEmailsError)

      if (!campaignEmailsError && count !== null) {
        emailsSentCount += count
      }
    }

    // Count project-based emails (older system)
    if (projectIds.length > 0) {
      const { count, error: projectEmailsError } = await supabase
        .from('emails')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .eq('status', 'sent')
        .is('campaign_id', null) // Only count those NOT in campaigns to avoid double-counting

      if (!projectEmailsError && count !== null) {
        emailsSentCount += count
      }
    }

    return NextResponse.json({
      investors: investorCount,
      emailsSent: emailsSentCount,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
