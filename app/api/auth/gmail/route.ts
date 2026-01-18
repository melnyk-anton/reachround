import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAuthUrl } from '@/lib/gmail/client'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authUrl = getAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error initiating Gmail OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Gmail OAuth' },
      { status: 500 }
    )
  }
}
