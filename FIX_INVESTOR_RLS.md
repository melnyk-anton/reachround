# Fix Investor RLS Policies

## Problem
The `investors` table has incorrect Row Level Security (RLS) policies that are blocking inserts. When trying to add investors, you get this error:
```
new row violates row-level security policy for table "investors"
```

## Solution
Run the SQL migration to fix the RLS policies.

### Steps:

1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Navigate to the **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/fix_investor_rls.sql`
5. Click **Run** to execute the migration

The migration will:
- Drop the existing (broken) RLS policies
- Create new policies with proper `auth.uid()` checks
- Allow users to insert/view/update/delete investors only from their own projects

### What the Fix Does

The corrected policies ensure that:
- Users can only view investors from projects they own
- Users can only add investors to projects they own
- Users can only update/delete investors from projects they own

The fix adds proper `EXISTS` subqueries that check if the project belongs to the authenticated user via `auth.uid()`.

### After Running the Migration

Once you've run the migration:
1. Refresh your application
2. Try finding investors again - the insert should now work successfully
3. You should see the investors appear in your project

## Verification

After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'investors';
```

You should see 4 policies:
- Users can view investors from their projects (SELECT)
- Users can insert investors to their projects (INSERT)
- Users can update investors from their projects (UPDATE)
- Users can delete investors from their projects (DELETE)

All policies should have proper checks involving `auth.uid()`.
