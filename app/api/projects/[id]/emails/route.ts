import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!project || (project as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get emails with investor info
    const { data: emails, error } = await (supabase
      .from('emails') as any)
      .select(`
        *,
        investor:investors(name, firm, email)
      `)
      .eq('project_id', params.id)
      .order('generated_at', { ascending: false })

    if (error) {
      console.error('Error fetching emails:', error)
      throw error
    }

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
