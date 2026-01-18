-- Add expires_at column to gmail_tokens table
-- The schema has token_expiry but the code uses expires_at
-- Adding expires_at to match the code

ALTER TABLE gmail_tokens
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Copy data from token_expiry to expires_at if it exists
UPDATE gmail_tokens
SET expires_at = token_expiry
WHERE token_expiry IS NOT NULL AND expires_at IS NULL;

-- We'll keep both columns for backwards compatibility
-- Future code should use expires_at
