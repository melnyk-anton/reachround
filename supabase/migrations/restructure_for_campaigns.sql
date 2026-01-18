-- Remove ask from projects table (no longer needed there)
ALTER TABLE projects
DROP COLUMN IF EXISTS ask;

-- Create campaigns table (each project can have multiple campaigns/asks)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ask TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add campaign_id to investors table
ALTER TABLE investors
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE;

-- Add campaign_id to emails table
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_project_id ON campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_investors_campaign_id ON investors(campaign_id);
CREATE INDEX IF NOT EXISTS idx_emails_campaign_id ON emails(campaign_id);

-- Enable RLS for campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create campaigns for their projects"
  ON campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );
