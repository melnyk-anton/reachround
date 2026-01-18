import { google } from 'googleapis'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  (process.env.NEXT_PUBLIC_URL || 'https://reachround.vercel.app') + '/api/auth/gmail/callback'
)

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
    prompt: 'consent',
  })
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function getValidAccessToken(userId: string) {
  const serviceClient = createServiceClient()

  const { data: tokenData, error } = await (serviceClient
    .from('gmail_tokens') as any)
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !tokenData) {
    throw new Error('Gmail not connected')
  }

  // Check if token is expired
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()

  if (expiresAt <= now) {
    // Token expired, refresh it
    oauth2Client.setCredentials({
      refresh_token: tokenData.refresh_token,
    })

    const { credentials } = await oauth2Client.refreshAccessToken()

    // Update tokens in database
    await (serviceClient.from('gmail_tokens') as any)
      .update({
        access_token: credentials.access_token,
        expires_at: new Date(credentials.expiry_date!).toISOString(),
      })
      .eq('user_id', userId)

    return credentials.access_token!
  }

  return tokenData.access_token
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string
) {
  try {
    const accessToken = await getValidAccessToken(userId)

    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Create email in RFC 2822 format
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n')

    // Encode email to base64
    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    })

    return {
      messageId: response.data.id,
      threadId: response.data.threadId,
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email via Gmail')
  }
}

export async function checkGmailConnection(userId: string) {
  try {
    const serviceClient = createServiceClient()

    const { data: tokenData, error } = await (serviceClient
      .from('gmail_tokens') as any)
      .select('*')
      .eq('user_id', userId)
      .single()

    return !error && !!tokenData
  } catch {
    return false
  }
}

export async function disconnectGmail(userId: string) {
  const supabase = createServerClient()

  await (supabase.from('gmail_tokens') as any)
    .delete()
    .eq('user_id', userId)
}
