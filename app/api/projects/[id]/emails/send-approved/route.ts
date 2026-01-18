import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
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

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if Gmail is connected
    const { data: gmailToken } = await (supabase
      .from('gmail_tokens') as any)
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!gmailToken) {
      return NextResponse.json(
        { error: 'Gmail not connected. Please connect your Gmail account first.' },
        { status: 400 }
      )
    }

    // Get approved emails
    const { data: emails, error } = await (supabase
      .from('emails') as any)
      .select(`
        *,
        investor:investors(name, firm, email)
      `)
      .eq('project_id', params.id)
      .eq('status', 'approved')

    if (error) {
      console.error('Error fetching approved emails:', error)
      throw error
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: 'No approved emails to send' },
        { status: 400 }
      )
    }

    // Send emails via Gmail with delays
    const results = []
    for (const email of emails) {
      if (!email.investor.email) {
        console.warn(`Skipping ${email.investor.name} - no email address`)
        continue
      }

      try {
        // Update status to sending
        await (supabase.from('emails') as any)
          .update({ status: 'sending' })
          .eq('id', email.id)

        // Send via Gmail
        const { messageId, threadId } = await sendEmail(
          user.id,
          email.investor.email,
          email.subject,
          email.body
        )

        // Update status to sent
        await (supabase.from('emails') as any)
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            gmail_message_id: messageId,
            gmail_thread_id: threadId,
          })
          .eq('id', email.id)

        results.push({ id: email.id, success: true })

        // Add delay between sends (2-5 seconds)
        if (emails.indexOf(email) < emails.length - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, 2000 + Math.random() * 3000)
          )
        }
      } catch (error) {
        console.error(`Error sending email to ${email.investor.name}:`, error)

        // Mark as failed
        await (supabase.from('emails') as any)
          .update({ status: 'draft' })
          .eq('id', email.id)

        results.push({
          id: email.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failedCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failedCount,
      results,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}
