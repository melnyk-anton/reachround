import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/gmail/client'

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
    const { data: project, error: projectError } = await supabase
      .from('projects')
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

    // Use service client to bypass RLS (we've already verified ownership above)
    const serviceClient = createServiceClient()

    // Get approved emails for this campaign
    const { data: approvedEmails, error: emailsError } = await (serviceClient
      .from('emails') as any)
      .select('*')
      .eq('campaign_id', params.id)
      .eq('status', 'approved')

    console.log('Found approved emails:', approvedEmails?.length || 0)

    if (emailsError) {
      console.error('Error fetching approved emails:', emailsError)
      throw emailsError
    }

    if (!approvedEmails || approvedEmails.length === 0) {
      console.log('No approved emails found for campaign:', params.id)
      return NextResponse.json({ error: 'No approved emails to send' }, { status: 400 })
    }

    // Send emails via Gmail and update status
    const sendResults = []
    console.log('Starting to process', approvedEmails.length, 'approved emails')

    for (const email of approvedEmails) {
      try {
        console.log('Processing email ID:', email.id)

        // Get investor email
        const { data: investor } = await (serviceClient
          .from('investors') as any)
          .select('email, name')
          .eq('id', email.investor_id)
          .single()

        console.log('Investor found:', investor?.name, investor?.email)

        if (!investor || !investor.email) {
          console.log('No investor email found for email ID:', email.id)
          sendResults.push({
            id: email.id,
            success: false,
            error: 'Investor email not found'
          })
          continue
        }

        // Send email via Gmail
        console.log('Sending email to:', investor.email)
        const gmailResult = await sendEmail(
          user.id,
          investor.email,
          email.subject,
          email.body
        )
        console.log('Email sent successfully, messageId:', gmailResult.messageId)

        // Update email status to sent with Gmail metadata
        const { error: updateError } = await (serviceClient
          .from('emails') as any)
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            gmail_message_id: gmailResult.messageId,
            gmail_thread_id: gmailResult.threadId,
          })
          .eq('id', email.id)

        if (updateError) {
          console.error('Error updating email status:', updateError)
          sendResults.push({ id: email.id, success: false, error: updateError.message })
        } else {
          console.log('Email status updated to sent')
          sendResults.push({ id: email.id, success: true, to: investor.email })
        }
      } catch (error) {
        console.error('Error processing email ID', email.id, ':', error)
        sendResults.push({
          id: email.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    console.log('Send results:', sendResults)

    const successCount = sendResults.filter(r => r.success).length
    const failureCount = sendResults.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      results: sendResults,
    })
  } catch (error) {
    console.error('Error sending approved emails:', error)
    return NextResponse.json(
      {
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
