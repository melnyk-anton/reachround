# Setting Up Google OAuth with Supabase for Gmail Access

This guide will help you configure Google OAuth through Supabase, which will allow users to sign in with Google AND grant Gmail permissions in one flow.

## Why This Approach?

Instead of setting up Google OAuth separately, we use **Supabase's Google provider** which:
- ✅ Handles user authentication (Sign in with Google)
- ✅ Manages OAuth tokens automatically
- ✅ Requests Gmail permissions during login
- ✅ Refreshes tokens automatically
- ✅ No need for separate OAuth credentials in your app

## Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name it "ReachRound" (or your app name)
4. Click "Create"

### Step 2: Enable Gmail API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Gmail API"
3. Click "Gmail API" → Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Click "Create"

**Fill out the form:**
- **App name**: ReachRound
- **User support email**: Your email
- **Developer contact email**: Your email
- Click "Save and Continue"

**Scopes (IMPORTANT):**
1. Click "Add or Remove Scopes"
2. Filter for these scopes and add them:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
3. Click "Update" → "Save and Continue"

**Test users:**
- Add your email and any test users
- Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose **Web application**
4. Name it "ReachRound Web"

**Authorized JavaScript origins:**
- Add: `http://localhost:3000`
- Add: `https://yourdomain.com` (for production)

**Authorized redirect URIs:**
- Add: `https://YOUR_SUPABASE_PROJECT_URL/auth/v1/callback`
  - Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase URL
  - Example: `https://nbawsysodsqfjtytzcat.supabase.co/auth/v1/callback`

5. Click "Create"
6. **Copy the Client ID and Client Secret** - you'll need these next!

### Step 5: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle it ON

**Fill in the form:**
- **Client ID**: Paste from Google Cloud Console
- **Client Secret**: Paste from Google Cloud Console
- **Authorized Client IDs**: Leave empty (not needed for web)

**Additional Scopes (CRITICAL):**
In the "Scopes" field, add:
```
https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly
```

6. Click "Save"

### Step 6: Update Redirect URLs (Optional for Production)

In **Authentication** → **URL Configuration**:
- **Site URL**: `http://localhost:3000` (dev) or `https://yourdomain.com` (prod)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

## Testing the Setup

Once configured, users will:
1. Click "Sign in with Google" in your app
2. See Google's consent screen
3. Grant permissions for:
   - Email address
   - Profile info
   - Send emails (Gmail)
   - Read emails (Gmail)
4. Get redirected back to your app, fully authenticated

## How It Works in the App

### User Authentication Flow

```typescript
// User clicks "Sign in with Google"
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
    redirectTo: `${window.location.origin}/auth/callback`,
  }
})
```

### Accessing Gmail Tokens

```typescript
// After authentication, get the user's session
const { data: { session } } = await supabase.auth.getSession()

// session.provider_token contains the Google access token
// session.provider_refresh_token contains the refresh token

// Use these tokens with the Gmail API
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
```

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Make sure you added the Gmail scopes in OAuth consent screen
- Ensure redirect URI matches exactly in Google Console

### "redirect_uri_mismatch"
- Check that Supabase callback URL is added in Google Console
- Format: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### "insufficient_scope"
- Verify Gmail scopes are added in Supabase Google provider settings
- Re-authenticate after adding scopes

### Users don't see Gmail permission request
- Gmail scopes must be added in BOTH:
  1. Google Cloud Console OAuth consent screen
  2. Supabase Google provider settings

## Security Notes

- OAuth tokens are stored securely by Supabase
- Tokens are automatically refreshed
- We only request the minimal scopes needed (send + read)
- Users can revoke access anytime from their Google Account settings

## Next Steps

Once configured:
1. Users can sign in with Google
2. App automatically gets Gmail access
3. No additional OAuth flow needed
4. Send emails using the provider token from Supabase session

---

**Ready to implement this in code!** 🚀
