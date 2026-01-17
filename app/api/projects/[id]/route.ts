import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { Project } from '@/types'

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

    // Query directly using the server client (which has auth context)
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single<Project>()

    if (error) {
      console.error('Error fetching project:', error)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

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

    // First check if project exists and user owns it
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single<Project>()

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existingProject.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update using the server client
    const body = await request.json()
    const { data: updatedProject, error: updateError } = await (supabase
      .from('projects') as any)
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating project:', updateError)
      throw updateError
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    // First check if project exists and user owns it
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single<Project>()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete using the server client
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting project:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
