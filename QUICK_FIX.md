# Quick Fix for Project Creation Error

## The Problem
You're getting a 500 error when creating projects because the database schema doesn't match the code.

## Quick Solution

Run this SQL in your Supabase SQL Editor to fix the projects table:

```sql
-- First, check what columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects';

-- If you see 'location' instead of 'target_geography', run this:
ALTER TABLE projects RENAME COLUMN location TO target_geography;

-- If you see 'funding_ask', remove it:
ALTER TABLE projects DROP COLUMN IF EXISTS funding_ask;

-- If you see 'pitch_deck_summary', rename it:
ALTER TABLE projects RENAME COLUMN pitch_deck_summary TO pitch_summary;

-- Make sure these columns exist (add if missing):
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_geography TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pitch_summary TEXT;

-- Remove any extra columns we don't need:
ALTER TABLE projects DROP COLUMN IF EXISTS additional_context;
ALTER TABLE projects DROP COLUMN IF EXISTS writing_style_notes;
ALTER TABLE projects DROP COLUMN IF EXISTS founder_name;
ALTER TABLE projects DROP COLUMN IF EXISTS founder_background;
ALTER TABLE projects DROP COLUMN IF EXISTS updated_at;
```

## Expected Final Schema

Your `projects` table should have exactly these columns:
- `id` (uuid)
- `user_id` (uuid)
- `name` (text)
- `one_liner` (text)
- `industry` (text)
- `stage` (text)
- `target_geography` (text)
- `pitch_deck_url` (text)
- `pitch_summary` (text)
- `created_at` (timestamp)

## Alternative: Fresh Start

If you have no important data yet, you can recreate the table:

```sql
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  one_liner TEXT,
  industry TEXT,
  stage TEXT,
  target_geography TEXT,
  pitch_deck_url TEXT,
  pitch_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);
```

After running this, project creation will work!
