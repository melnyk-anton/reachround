-- Clean schema for ReachRound (updated to match current code)
-- Use this if creating tables from scratch

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table (simplified schema)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  one_liner text,
  industry text,
  stage text,
  target_geography text,
  pitch_deck_url text,
  pitch_summary text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on projects
alter table projects enable row level security;

-- Projects RLS policies
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- Index for performance
create index if not exists idx_projects_user_id on projects(user_id);

-- Investors table
create table if not exists investors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  email text,
  firm text,
  title text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  source text default 'manual',
  research_status text default 'pending',
  research_summary text,
  research_raw jsonb,
  recent_investments jsonb,
  investment_thesis text,
  recent_activity jsonb,
  talking_points jsonb,
  why_good_fit text,
  research_sources jsonb,
  research_completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS on investors
alter table investors enable row level security;

-- Investors RLS policies
create policy "Users can view investors from their projects"
  on investors for select
  using (
    exists (
      select 1 from projects
      where projects.id = investors.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert investors to their projects"
  on investors for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update investors from their projects"
  on investors for update
  using (
    exists (
      select 1 from projects
      where projects.id = investors.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete investors from their projects"
  on investors for delete
  using (
    exists (
      select 1 from projects
      where projects.id = investors.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Indexes
create index if not exists idx_investors_project_id on investors(project_id);
create index if not exists idx_investors_research_status on investors(research_status);

-- Emails table
create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references investors(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  subject text not null,
  body text not null,
  status text default 'draft',
  feedback text,
  version int default 1,
  include_typos boolean default false,
  gmail_message_id text,
  gmail_thread_id text,
  sent_at timestamp with time zone,
  opened_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on emails
alter table emails enable row level security;

-- Emails RLS policies
create policy "Users can view emails from their projects"
  on emails for select
  using (
    exists (
      select 1 from projects
      where projects.id = emails.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert emails to their projects"
  on emails for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update emails from their projects"
  on emails for update
  using (
    exists (
      select 1 from projects
      where projects.id = emails.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete emails from their projects"
  on emails for delete
  using (
    exists (
      select 1 from projects
      where projects.id = emails.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Indexes
create index if not exists idx_emails_project_id on emails(project_id);
create index if not exists idx_emails_investor_id on emails(investor_id);
create index if not exists idx_emails_status on emails(status);

-- Gmail tokens table
create table if not exists gmail_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  access_token text not null,
  refresh_token text not null,
  token_expiry timestamp with time zone,
  email_address text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on gmail_tokens
alter table gmail_tokens enable row level security;

-- Gmail tokens policies
create policy "Users can view own gmail tokens"
  on gmail_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert own gmail tokens"
  on gmail_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can update own gmail tokens"
  on gmail_tokens for update
  using (auth.uid() = user_id);

create policy "Users can delete own gmail tokens"
  on gmail_tokens for delete
  using (auth.uid() = user_id);

-- Index
create index if not exists idx_gmail_tokens_user_id on gmail_tokens(user_id);

-- Email versions table
create table if not exists email_versions (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade not null,
  version int not null,
  subject text not null,
  body text not null,
  feedback text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on email_versions
alter table email_versions enable row level security;

-- Email versions policies
create policy "Users can view email versions"
  on email_versions for select
  using (
    exists (
      select 1 from emails
      join projects on projects.id = emails.project_id
      where emails.id = email_versions.email_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert email versions"
  on email_versions for insert
  with check (
    exists (
      select 1 from emails
      join projects on projects.id = emails.project_id
      where emails.id = email_id
      and projects.user_id = auth.uid()
    )
  );

-- Index
create index if not exists idx_email_versions_email_id on email_versions(email_id);

-- Research logs table
create table if not exists research_logs (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references investors(id) on delete cascade not null,
  step_number int not null,
  query text not null,
  finding text,
  source_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on research_logs
alter table research_logs enable row level security;

-- Research logs policies
create policy "Users can view research logs from their investors"
  on research_logs for select
  using (
    exists (
      select 1 from investors
      join projects on projects.id = investors.project_id
      where investors.id = research_logs.investor_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert research logs to their investors"
  on research_logs for insert
  with check (
    exists (
      select 1 from investors
      join projects on projects.id = investors.project_id
      where investors.id = investor_id
      and projects.user_id = auth.uid()
    )
  );

-- Index
create index if not exists idx_research_logs_investor_id on research_logs(investor_id);

-- Storage bucket for pitch decks
insert into storage.buckets (id, name, public)
values ('pitch-decks', 'pitch-decks', false)
on conflict (id) do nothing;

-- Storage policies for pitch decks
create policy "Users can upload their own pitch decks"
  on storage.objects for insert
  with check (
    bucket_id = 'pitch-decks' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own pitch decks"
  on storage.objects for select
  using (
    bucket_id = 'pitch-decks' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own pitch decks"
  on storage.objects for delete
  using (
    bucket_id = 'pitch-decks' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
