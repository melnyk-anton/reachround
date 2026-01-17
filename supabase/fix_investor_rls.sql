-- Drop existing policies
drop policy if exists "Users can insert investors to their projects" on investors;
drop policy if exists "Users can view investors from their projects" on investors;
drop policy if exists "Users can update investors from their projects" on investors;
drop policy if exists "Users can delete investors from their projects" on investors;

-- Create corrected policies
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
      where projects.id = investors.project_id
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
