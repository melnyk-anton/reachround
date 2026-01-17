# ReachRound - AI Investor Outreach Agent

**Status:** 🚧 In Development (MVP Phase)

Send highly personalized cold emails to investors with AI-powered deep research. Every email looks like the founder spent 30 minutes researching that specific investor.

## 🎯 Core Features

- **AI Investor Discovery**: Find relevant investors based on your startup
- **Deep Research**: Perplexity-style multi-step research on each investor
- **Personalized Emails**: AI writes unique emails using research insights
- **Gmail Integration**: Send from your actual Gmail account
- **Human Control**: Approve every email before sending

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Claude Agent SDK
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Claude 3.5 Sonnet via Anthropic SDK
- **Email**: Gmail OAuth API
- **Memory**: Mem0 (optional, for context persistence)

## 📋 Prerequisites

Before you begin, you'll need:

1. **Node.js 18+** and npm
2. **Anthropic API Key** (required) - Get from [console.anthropic.com](https://console.anthropic.com)
3. **Supabase Account** (required) - Get from [supabase.com](https://supabase.com)
4. **Google Cloud Project** (required for Gmail) - Set up at [console.cloud.google.com](https://console.cloud.google.com)
5. **Mem0 API Key** (optional for MVP) - Get from [mem0.ai](https://mem0.ai)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reachround
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. In the SQL Editor, run the schema from `supabase/schema.sql`

### 3. Set Up Google OAuth (Gmail)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Gmail API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/gmail/callback`
6. Add authorized redirect URI for production: `https://yourdomain.com/api/auth/gmail/callback`
7. Copy Client ID and Client Secret

Required OAuth Scopes:
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/userinfo.email`

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic (required)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google OAuth (required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback

# Mem0 (optional for MVP)
MEM0_API_KEY=your_mem0_api_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 User Flow (MVP)

1. **Sign Up / Login** - Create account with Supabase Auth
2. **Create Project** - Enter startup details (name, industry, stage, etc.)
3. **Connect Gmail** - OAuth flow to authorize email sending
4. **Find Investors** - AI discovers relevant investors OR add manually
5. **Research** - AI performs deep multi-step research on each investor
6. **Review Emails** - AI generates personalized emails based on research
7. **Approve & Send** - Review, edit if needed, and send from your Gmail

## 🏗️ Project Structure

```
reachround/
├── app/
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── auth/             # Auth components
│   ├── layout/           # Layout components (sidebar, header)
│   ├── projects/         # Project management components
│   ├── investors/        # Investor management components
│   ├── emails/           # Email components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase client utilities
│   ├── gmail/            # Gmail API integration
│   ├── agents/           # AI agents (Claude Agent SDK)
│   ├── mem0/             # Mem0 integration
│   └── utils.ts          # Utility functions
├── types/
│   ├── index.ts          # TypeScript types
│   └── supabase.ts       # Supabase generated types
├── supabase/
│   └── schema.sql        # Database schema
└── public/               # Static assets
```

## 🤖 AI Agents

### 1. Investor Finder Agent
- Searches for investors matching your startup
- Considers: industry, stage, geography, recent investments
- Returns: Name, firm, title, social links, match reasoning

### 2. Deep Research Agent
- Multi-step Perplexity-style research
- Searches for: bio, investments, thesis, social activity, content
- Returns: Structured research with talking points

### 3. Email Writer Agent
- Writes personalized cold emails
- Uses research insights for personalization
- Follows cold email best practices
- Optional: Add natural typos for human touch

## 🔐 Security Features

- Row Level Security (RLS) in Supabase
- User data isolation
- OAuth token encryption
- API route authentication
- Input validation with Zod

## 📦 Database Schema

See `supabase/schema.sql` for complete schema.

Main tables:
- `projects` - Startup information
- `investors` - Investor profiles and research
- `emails` - Generated emails and status
- `gmail_tokens` - OAuth tokens for Gmail
- `research_logs` - Research step tracking
- `email_versions` - Email regeneration history

## 🧪 Testing the App

### Quick Test Flow

1. Start dev server: `npm run dev`
2. Create account at `/signup`
3. Create a project with your startup info
4. Connect Gmail in settings
5. Add an investor manually (use your own email for testing)
6. Trigger research (AI will research the investor)
7. Generate email
8. Review and send (sends to the email you entered)
9. Check your inbox!

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Your app URL (http://localhost:3000 for dev) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | Yes | OAuth callback URL |
| `MEM0_API_KEY` | No | Mem0 API key (for context persistence) |

## 🚧 Development Status

### ✅ Completed (Phase 1)
- [x] Next.js 14 setup with TypeScript
- [x] Tailwind CSS configuration
- [x] shadcn/ui setup
- [x] Database schema design
- [x] TypeScript types
- [x] Folder structure
- [x] Environment configuration

### 🔄 In Progress
- [ ] Authentication (Supabase Auth)
- [ ] Dashboard layout
- [ ] Project CRUD
- [ ] Gmail OAuth integration
- [ ] AI Agents (Claude Agent SDK)
- [ ] Investor research flow
- [ ] Email generation
- [ ] Approval queue UI
- [ ] Send functionality

### 📅 Planned
- [ ] Mem0 integration
- [ ] Email tracking
- [ ] Advanced features (typos, regeneration)
- [ ] UI polish
- [ ] Mobile responsive
- [ ] Deployment

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - feel free to use for your hackathon projects!

## 💡 Tips for Hackathon Demo

1. **Pre-populate data**: Have a test project ready
2. **Use your own email**: Add yourself as investor to test sending
3. **Show research process**: Highlight the multi-step research
4. **Compare emails**: Show generic vs. AI-researched email
5. **Live send**: Actually send an email during demo

## 🆘 Troubleshooting

### "Supabase connection failed"
- Check your `.env.local` has correct Supabase URL and keys
- Verify schema was run in Supabase SQL editor

### "Gmail OAuth redirect error"
- Check redirect URI matches exactly in Google Cloud Console
- Ensure Gmail API is enabled

### "Anthropic API error"
- Verify API key is correct
- Check you have credits in your Anthropic account

### "Development server won't start"
- Delete `node_modules` and `.next`, then run `npm install`
- Check for port conflicts (default: 3000)

## 📧 Support

For issues or questions, open an issue on GitHub.

---

**Built with ❤️ for the hackathon**

*Making investor outreach less painful, one email at a time.*
