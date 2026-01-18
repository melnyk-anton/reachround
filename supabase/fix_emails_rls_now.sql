-- Emergency fix for emails RLS policy
-- This allows inserting emails through campaigns

-- Drop any existing INSERT policies on emails
DROP POLICY IF EXISTS "Users can insert emails for their projects" ON emails;
DROP POLICY IF EXISTS "Users can insert emails for their campaigns" ON emails;
DROP POLICY IF EXISTS "Users can insert their own emails" ON emails;

-- Create the correct policy for campaign-based inserts
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

-- Also ensure users can update and delete their own emails
DROP POLICY IF EXISTS "Users can update their own emails" ON emails;
CREATE POLICY "Users can update their own emails"
  ON emails FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = emails.campaign_id
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own emails" ON emails;
CREATE POLICY "Users can delete their own emails"
  ON emails FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = emails.campaign_id
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own emails" ON emails;
CREATE POLICY "Users can view their own emails"
  ON emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = emails.campaign_id
      AND projects.user_id = auth.uid()
    )
  );
