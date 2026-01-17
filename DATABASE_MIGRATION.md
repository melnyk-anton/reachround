# Database Migration Required

## Issue Fixed

You reported a 500 error when creating projects. This was caused by a mismatch between the database schema and the TypeScript types.

## Changes Made

1. **Removed `funding_ask` from projects** - This will now be part of email presets (to be implemented later)
2. **Renamed `location` to `target_geography`** - For consistency
3. **Simplified Project schema** - Removed unused fields for MVP

## Migration Steps

### Option 1: Run Migration SQL (Recommended)

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase/migration_update_projects.sql`
4. Click "Run"

This will safely update your existing `projects` table.

### Option 2: Recreate Projects Table (If you have no data yet)

If you haven't created any projects yet and want a clean start:

1. Open Supabase SQL Editor
2. Run this SQL:

```sql
-- Drop existing projects table
DROP TABLE IF EXISTS projects CASCADE;

-- Create new simplified projects table
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

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

## Updated Project Schema

The new simplified `projects` table has these fields:

- `id` - UUID primary key
- `user_id` - Reference to auth.users
- `name` - Company name (required)
- `one_liner` - Brief description (required)
- `industry` - Industry/sector (optional)
- `stage` - Funding stage (optional)
- `target_geography` - Geographic focus (optional)
- `pitch_deck_url` - Supabase storage URL (optional)
- `pitch_summary` - AI-generated summary (optional)
- `created_at` - Timestamp

## After Migration

Once you've run the migration, project creation should work without errors. The form now has these fields:

- Company Name (required)
- One-Liner (required)
- Industry
- Stage (dropdown)
- Target Geography

**Note:** `funding_ask` has been removed from projects. In the future, you'll be able to create multiple email presets per project, each with a different funding ask amount.
