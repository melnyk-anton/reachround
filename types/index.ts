// Database types based on Supabase schema

export interface GmailToken {
  id: string
  user_id: string
  access_token: string
  refresh_token: string
  token_expiry: string | null
  email_address: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  one_liner: string | null
  industry: string | null
  stage: string | null
  location: string | null
  funding_ask: string | null
  pitch_deck_url: string | null
  pitch_deck_summary: string | null
  additional_context: string | null
  writing_style_notes: string | null
  founder_name: string | null
  founder_background: string | null
  created_at: string
  updated_at: string
}

export interface Investor {
  id: string
  project_id: string
  name: string
  email: string | null
  firm: string | null
  title: string | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  source: 'ai_found' | 'manual'
  research_status: 'pending' | 'researching' | 'completed' | 'failed'
  research_summary: string | null
  research_raw: InvestorResearchRaw | null
  recent_investments: RecentInvestment[] | null
  investment_thesis: string | null
  recent_activity: RecentActivity[] | null
  talking_points: TalkingPoint[] | null
  why_good_fit: string | null
  research_sources: ResearchSource[] | null
  research_completed_at: string | null
  created_at: string
}

export interface InvestorResearchRaw {
  [key: string]: any
}

export interface RecentInvestment {
  company: string
  date: string
  stage: string
  description: string
  relevance?: string
}

export interface RecentActivity {
  type: 'tweet' | 'linkedin' | 'podcast' | 'blog' | 'interview'
  content: string
  date: string
  source_url: string
  relevance?: string
}

export interface TalkingPoint {
  hook: string
  reasoning: string
  source: string
}

export interface ResearchSource {
  url: string
  title: string
  used_for: string
}

export interface Email {
  id: string
  investor_id: string
  project_id: string
  subject: string
  body: string
  status: 'draft' | 'approved' | 'sending' | 'sent' | 'failed'
  feedback: string | null
  version: number
  include_typos: boolean
  gmail_message_id: string | null
  gmail_thread_id: string | null
  sent_at: string | null
  opened_at: string | null
  created_at: string
  updated_at: string
}

export interface EmailVersion {
  id: string
  email_id: string
  version: number
  subject: string
  body: string
  feedback: string | null
  created_at: string
}

export interface ResearchLog {
  id: string
  investor_id: string
  step_number: number
  query: string
  finding: string | null
  source_url: string | null
  created_at: string
}

// Form input types
export interface CreateProjectInput {
  name: string
  one_liner?: string
  industry?: string
  stage?: string
  location?: string
  funding_ask?: string
  additional_context?: string
  writing_style_notes?: string
  founder_name?: string
  founder_background?: string
}

export interface CreateInvestorInput {
  project_id: string
  name: string
  email?: string
  firm?: string
  title?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  source?: 'ai_found' | 'manual'
}

export interface FindInvestorsInput {
  project_id: string
  count: number
  criteria?: string
  geography?: string
}

export interface GenerateEmailInput {
  investor_id: string
  project_id: string
  include_typos?: boolean
}

export interface RegenerateEmailInput {
  email_id: string
  feedback: string
  include_typos?: boolean
}

// AI Agent types
export interface InvestorFinderResult {
  name: string
  firm: string
  title: string
  linkedin_url?: string
  twitter_url?: string
  reasoning: string
}

export interface ResearchStep {
  label: string
  status: 'searching' | 'found' | 'complete' | 'failed'
  finding?: string
  source_url?: string
}

export interface EmailGenerationResult {
  subject: string
  body: string
}

// Stage options
export const STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
] as const

export type Stage = typeof STAGES[number]

// Industry options
export const INDUSTRIES = [
  'AI/ML',
  'Developer Tools',
  'SaaS',
  'Fintech',
  'Healthcare',
  'E-commerce',
  'Education',
  'Cybersecurity',
  'Climate Tech',
  'Consumer',
  'Enterprise Software',
  'Biotech',
  'Hardware',
  'Other',
] as const

export type Industry = typeof INDUSTRIES[number]

// Writing style options
export const WRITING_STYLES = [
  'Professional',
  'Casual',
  'Direct',
  'Friendly',
  'Formal',
] as const

export type WritingStyle = typeof WRITING_STYLES[number]
