# Troubleshooting 500 Error on Project Creation

## Problem
Getting a 500 Internal Server Error when creating projects via POST to `/api/projects`

## Most Likely Causes

### 1. Schema Mismatch (MOST LIKELY)
Your database table might have old column names that don't match the code.

**Check your current schema:**
```sql
-- Run this in Supabase SQL Editor to see current columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
```

**Expected columns (what the code expects):**
- `id` (uuid)
- `user_id` (uuid)
- `name` (text)
- `one_liner` (text)
- `industry` (text)
- `stage` (text)
- `target_geography` (text) ← NOT `location`
- `pitch_deck_url` (text)
- `pitch_summary` (text) ← NOT `pitch_deck_summary`
- `created_at` (timestamp)

**If columns don't match, use the clean schema:**

Drop and recreate with correct schema:
```sql
DROP TABLE IF EXISTS projects CASCADE;
```

Then run: `supabase/schema_clean.sql` (the entire file in Supabase SQL Editor)

### 2. Row Level Security (RLS) Not Configured
Even with correct schema, RLS policies might be missing.

**Check if RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'projects';
```

Should return `rowsecurity = true`

**Check if policies exist:**
```sql
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'projects';
```

Should show 4 policies:
1. "Users can view own projects" (SELECT)
2. "Users can insert own projects" (INSERT)
3. "Users can update own projects" (UPDATE)
4. "Users can delete own projects" (DELETE)

**If policies are missing, add them:**
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Authentication Not Working
The server might not be getting the authenticated user.

**Test authentication:**
1. Open the app in your browser
2. Make sure you're logged in
3. Open browser console and run:
```javascript
fetch('/api/test-db')
  .then(r => r.json())
  .then(console.log)
```

**Expected response:**
```json
{
  "success": true,
  "user": "your-email@example.com",
  "database": "connected"
}
```

**If you get `authError` or `user: null`:**
- Check that you're actually logged in
- Check cookies in browser dev tools
- Try logging out and back in
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in `.env.local`

### 4. Server-Side Supabase Client Issue
The server client might not be using the correct configuration.

**Check your `.env.local` file has all required variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Verify the keys are correct in Supabase dashboard:**
1. Go to Project Settings → API
2. Copy the correct `URL`, `anon public` key, and `service_role` key
3. Update `.env.local`
4. Restart your dev server: `npm run dev`

## Step-by-Step Debugging Process

### Step 1: Check Server Logs
When you try to create a project, check your terminal where `npm run dev` is running.

Look for these log messages:
```
[API] Creating project - Start
[API] Supabase client created
[API] User: your-email@example.com Auth error: null
[API] Request body: { name: '...', one_liner: '...', ... }
[API] Project data to insert: { user_id: '...', name: '...', ... }
[DB] createProject called with: { ... }
[DB] Client created, inserting...
[DB] Insert result - data: {...} error: null
```

**If you see an error in these logs, that's your culprit!**

Common error messages:
- `column "location" does not exist` → Schema mismatch, use schema_clean.sql
- `column "funding_ask" does not exist` → Schema mismatch, use schema_clean.sql
- `new row violates row-level security policy` → RLS issue, check policies
- `null value in column "user_id"` → Authentication issue, user not logged in
- `relation "projects" does not exist` → Table doesn't exist, create it

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab

Look for:
```
POST http://localhost:3000/api/projects 500 (Internal Server Error)
```

Click on it to see the response body. It should show:
```json
{
  "error": "Failed to create project",
  "details": "The specific error message here"
}
```

The `details` field will tell you exactly what's wrong.

### Step 3: Test Database Connection
Run this in browser console:
```javascript
fetch('/api/test-db')
  .then(r => r.json())
  .then(console.log)
```

This verifies:
- Authentication is working
- Database connection is working
- You're actually logged in

### Step 4: Verify Schema Directly in Supabase
1. Go to Supabase Dashboard
2. Click "Table Editor" in sidebar
3. Find `projects` table
4. Click the gear icon → "Edit table"
5. Check that column names match exactly:
   - `target_geography` (NOT `location`)
   - `pitch_summary` (NOT `pitch_deck_summary`)
   - NO `funding_ask` column
   - NO `additional_context`, `writing_style_notes`, `founder_name`, `founder_background`, `updated_at` columns

### Step 5: Fresh Start (Nuclear Option)
If nothing works, start completely fresh:

1. **Drop the table:**
```sql
DROP TABLE IF EXISTS projects CASCADE;
```

2. **Run the clean schema:**
Copy and paste the ENTIRE contents of `supabase/schema_clean.sql` into Supabase SQL Editor and run it.

3. **Restart your dev server:**
```bash
# Press Ctrl+C in terminal, then:
npm run dev
```

4. **Clear browser cache and cookies:**
- Chrome: Ctrl+Shift+Delete → Clear cookies and site data
- Or just open an incognito window

5. **Log out and back in**

6. **Try creating a project again**

## Quick Fix (If Schema is the Issue)

If you just want to fix it fast without understanding:

1. Open Supabase SQL Editor
2. Run this:
```sql
DROP TABLE IF EXISTS projects CASCADE;
```

3. Copy ALL of `supabase/schema_clean.sql` and run it

4. Restart dev server:
```bash
npm run dev
```

5. Log out and back in

6. Try creating a project

## Still Not Working?

Check the exact error message in your terminal logs. The detailed logging we added should show you exactly where it's failing.

Look for lines starting with:
- `[API]` - API route processing
- `[DB]` - Database operations
- `Error:` - The actual error

Share the full error message from the terminal, including the `[DB] Insert error details:` section if present.
