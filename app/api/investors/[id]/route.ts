import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get investor to verify ownership
    const { data: investor, error: investorError } = await (supabase
      .from('investors') as any)
      .select('*, project:projects(user_id)')
      .eq('id', params.id)
      .single()

    if (investorError || !investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Verify ownership
    if ((investor as any).project_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, firm, title, linkedin_url, twitter_url } = body

    // Use service client to bypass RLS (we've already verified ownership above)
    const serviceClient = createServiceClient()

    const { data: updatedInvestor, error: updateError } = await (serviceClient
      .from('investors') as any)
      .update({
        name: name || investor.name,
        email: email !== undefined ? email : investor.email,
        firm: firm !== undefined ? firm : investor.firm,
        title: title !== undefined ? title : investor.title,
        linkedin_url: linkedin_url !== undefined ? linkedin_url : investor.linkedin_url,
        twitter_url: twitter_url !== undefined ? twitter_url : investor.twitter_url,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating investor:', updateError)
      throw updateError
    }

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error updating investor:', error)
    return NextResponse.json(
      {
        error: 'Failed to update investor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get investor to verify ownership
    const { data: investor, error: investorError } = await (supabase
      .from('investors') as any)
      .select('*, project:projects(user_id)')
      .eq('id', params.id)
      .single()

    if (investorError || !investor) {
      return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
    }

    // Verify ownership
    if ((investor as any).project_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service client to bypass RLS (we've already verified ownership above)
    const serviceClient = createServiceClient()

    const { error: deleteError } = await (serviceClient
      .from('investors') as any)
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting investor:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting investor:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete investor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
