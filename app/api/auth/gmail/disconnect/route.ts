import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { disconnectGmail } from '@/lib/gmail/client'

export async function POST() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await disconnectGmail(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting Gmail:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    )
  }
}
