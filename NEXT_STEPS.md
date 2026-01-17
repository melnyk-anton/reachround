# Next Steps - What You Need to Do

## ✅ What's Done

Phase 1 & 2 are complete! You now have:
- ✅ Full Next.js app setup with TypeScript
- ✅ Database schema designed (in `supabase/schema.sql`)
- ✅ Authentication with Google OAuth
- ✅ Login page with "Sign in with Google" button
- ✅ Protected dashboard
- ✅ Environment variables configured

## 🔧 What You Need to Configure

### 1. Run the Database Schema in Supabase

The database tables don't exist yet. You need to create them:

1. Go to your Supabase project: https://app.supabase.com
2. Click on your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: "Success. No rows returned"

This creates all the tables: projects, investors, emails, gmail_tokens, etc.

### 2. Set Up Google OAuth in Supabase

Follow the detailed guide in `SETUP_GOOGLE_OAUTH.md`. Quick version:

#### A. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project called "ReachRound"
3. Enable Gmail API

#### B. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External**
3. Add these scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`

#### C. Create OAuth Credentials
1. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Type: **Web application**
3. **Authorized redirect URIs**: Add your Supabase callback URL
   - Format: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Your project: `https://nbawsysodsqfjtytzcat.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**

#### D. Configure in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and toggle it ON
3. Paste your Client ID and Client Secret
4. In **Scopes** field, add:
   ```
   https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly
   ```
5. Click **Save**

## 🚀 Test the App

Once Google OAuth is configured:

```bash
npm run dev
```

Open http://localhost:3000

1. Click "Get Started" or "Sign In"
2. Click "Continue with Google"
3. You'll be redirected to Google's sign-in page
4. Grant permissions (including Gmail access)
5. You'll be redirected back to the dashboard

### ✅ Success Indicators

After signing in, the dashboard should show:
- ✓ Your email address in the header
- ✓ "Gmail Connected" status (green checkmark)
- ✓ Debug info at the bottom should show "Provider Token: ✓ Present"

### ❌ If Gmail is Not Connected

If you see "Gmail Not Connected" (amber warning):
- Gmail scopes weren't requested during sign-in
- Go back and verify scopes are added in BOTH:
  1. Google Cloud Console OAuth consent screen
  2. Supabase Google provider settings
- Sign out and sign in again

## 🎯 What's Next After Authentication Works

Once you can sign in and see "Gmail Connected" in the dashboard:

### Phase 3: Projects (Next to Build)
- Create project form
- Save project to Supabase
- List user's projects

### Phase 4: AI Agents
- Set up Claude Agent SDK
- Build investor finder agent
- Build deep research agent
- Build email writer agent

### Phase 5: Investor Management
- Add investors manually
- Find investors with AI
- Display research results

### Phase 6: Email Flow
- Generate personalized emails
- Approval queue UI
- Send emails via Gmail API

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error
- Check that your Supabase callback URL is exactly:
  `https://nbawsysodsqfjtytzcat.supabase.co/auth/v1/callback`
- Make sure it's added in Google Cloud Console

### "Access blocked: This app's request is invalid"
- Gmail scopes must be added in OAuth consent screen
- App must not be in "Testing" mode OR your email must be added as a test user

### Tables Don't Exist
- Run the SQL schema in Supabase SQL Editor
- Check for any errors in the query

### Can Sign In But No Gmail Access
- Provider token will be null if scopes weren't granted
- Sign out, verify scopes in Supabase, sign in again

## 📞 Need Help?

Check the debug info at the bottom of the dashboard page:
- It shows your user ID, email, and token status
- Screenshot it if you need to troubleshoot

---

**Current Status:** Phase 1 & 2 Complete ✅
**Your Task:** Configure Google OAuth in Supabase, then test sign-in
**Time Estimate:** 15-20 minutes

Once authentication works with Gmail access, we'll continue building the core features! 🚀
