-- Update projects table to match our simplified schema
-- Run this in your Supabase SQL editor

-- Rename location to target_geography if it exists
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='location') THEN
    ALTER TABLE projects RENAME COLUMN location TO target_geography;
  END IF;
END $$;

-- Remove funding_ask from projects (will be part of email presets instead)
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='funding_ask') THEN
    ALTER TABLE projects DROP COLUMN funding_ask;
  END IF;
END $$;

-- Remove additional fields we don't need yet (keep simple for MVP)
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='additional_context') THEN
    ALTER TABLE projects DROP COLUMN additional_context;
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='writing_style_notes') THEN
    ALTER TABLE projects DROP COLUMN writing_style_notes;
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='founder_name') THEN
    ALTER TABLE projects DROP COLUMN founder_name;
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='founder_background') THEN
    ALTER TABLE projects DROP COLUMN founder_background;
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='updated_at') THEN
    ALTER TABLE projects DROP COLUMN updated_at;
  END IF;
END $$;

-- Rename pitch_deck_summary to pitch_summary if it exists
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns
            WHERE table_name='projects' AND column_name='pitch_deck_summary') THEN
    ALTER TABLE projects RENAME COLUMN pitch_deck_summary TO pitch_summary;
  END IF;
END $$;
