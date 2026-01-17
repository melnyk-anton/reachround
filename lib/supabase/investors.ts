import { createClient } from '@/lib/supabase/client'
import type { Investor } from '@/types'

export async function getInvestors(projectId: string): Promise<Investor[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('investors')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getInvestor(id: string): Promise<Investor | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('investors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createInvestor(investor: Omit<Investor, 'id' | 'created_at'>): Promise<Investor> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('investors')
    .insert([investor])
    .select()
    .single()

  if (error) throw error
  return data as Investor
}

export async function updateInvestor(id: string, updates: Partial<Investor>): Promise<Investor> {
  const supabase = createClient()

  const { data, error } = await (supabase as any)
    .from('investors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Investor
}

export async function deleteInvestor(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('investors')
    .delete()
    .eq('id', id)

  if (error) throw error
}
