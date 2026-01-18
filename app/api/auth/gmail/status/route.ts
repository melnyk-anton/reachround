import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { checkGmailConnection } from '@/lib/gmail/client'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connected = await checkGmailConnection(user.id)

    return NextResponse.json({ connected })
  } catch (error) {
    console.error('Error checking Gmail status:', error)
    return NextResponse.json(
      { error: 'Failed to check Gmail status' },
      { status: 500 }
    )
  }
}
