-- Add 'ask' column to projects table to store what user wants from investors
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS ask TEXT;

-- Example values: "Pre-seed funding ($500k)", "Seed funding ($2M)", "Series A ($10M)", "Advisory/Mentorship", etc.
