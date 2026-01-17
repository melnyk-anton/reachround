import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types'

export async function getProjects(userId: string): Promise<Project[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('projects')
    .insert([project])
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}
