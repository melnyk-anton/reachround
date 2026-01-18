-- Add missing columns to research_logs table
ALTER TABLE research_logs
ADD COLUMN IF NOT EXISTS investment_focus TEXT[],
ADD COLUMN IF NOT EXISTS recent_investments TEXT[],
ADD COLUMN IF NOT EXISTS thesis_alignment TEXT,
ADD COLUMN IF NOT EXISTS personalization_angles TEXT[],
ADD COLUMN IF NOT EXISTS recommended_talking_points TEXT[];

-- Fix emails RLS policy to allow campaign-based inserts
DROP POLICY IF EXISTS "Users can insert emails for their projects" ON emails;

CREATE POLICY "Users can insert emails for their campaigns"
  ON emails FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = emails.campaign_id
      AND projects.user_id = auth.uid()
    )
  );
