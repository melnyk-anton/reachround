-- Add missing columns to research_logs table
ALTER TABLE research_logs
ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 5;

-- Add missing columns to emails table
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add approved_at column if it doesn't exist
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Add gmail columns if they don't exist
ALTER TABLE emails
ADD COLUMN IF NOT EXISTS gmail_message_id TEXT,
ADD COLUMN IF NOT EXISTS gmail_thread_id TEXT;
