import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getTokensFromCode } from '@/lib/gmail/client'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthorized', process.env.NEXT_PUBLIC_URL!)
      )
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=gmail_oauth_failed', process.env.NEXT_PUBLIC_URL!)
      )
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...')
    const tokens = await getTokensFromCode(code)
    console.log('Tokens received:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      hasExpiryDate: !!tokens.expiry_date
    })

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
      throw new Error('Invalid tokens received')
    }

    // Get user's email address from their Supabase profile or use a default
    const emailAddress = user.email || 'unknown@example.com'

    // Store tokens in database (use service client to bypass RLS)
    console.log('Storing tokens in database for user:', user.id)
    const serviceClient = createServiceClient()
    const { error: dbError } = await (serviceClient
      .from('gmail_tokens') as any)
      .upsert({
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expiry_date).toISOString(),
        email_address: emailAddress,
      })

    if (dbError) {
      console.error('Error storing Gmail tokens:', dbError)
      throw dbError
    }

    console.log('Gmail tokens stored successfully')

    return NextResponse.redirect(
      new URL('/dashboard?success=gmail_connected', process.env.NEXT_PUBLIC_URL!)
    )
  } catch (error) {
    console.error('Error in Gmail OAuth callback:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.redirect(
      new URL('/dashboard?error=gmail_connection_failed', process.env.NEXT_PUBLIC_URL || 'https://reachround.vercel.app')
    )
  }
}
