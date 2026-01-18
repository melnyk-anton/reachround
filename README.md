# ReachRound - AI Investor Outreach Platform

ReachRound uses AI to help startup founders send highly personalized cold emails to investors. Every email is powered by deep research and looks like you spent 30 minutes researching that specific investor.

## 🚀 Live Demo

**Website:** [https://reachround.vercel.app](https://reachround.vercel.app)

## ✨ Features

- **AI-Powered Investor Research**: Deep multi-step research on investors including recent investments, thesis, social activity, and more
- **Personalized Email Generation**: AI generates highly personalized cold emails based on investor research
- **Gmail Integration**: Send emails directly from your Gmail account with OAuth authentication
- **Campaign Management**: Organize your outreach into campaigns with specific asks
- **Email Approval Workflow**: Review, edit, and approve every email before sending

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Anthropic Claude 3.5 Sonnet
- **Email**: Gmail API with OAuth 2.0
- **Deployment**: Vercel

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key
- Google Cloud Console project with Gmail API enabled

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_URL` - Your application URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 How It Works

1. **Create a Project**: Define your startup, what you're building, and your funding ask
2. **Start a Campaign**: Create campaigns for specific fundraising rounds or purposes
3. **Find Investors**: Use AI to discover relevant investors or add them manually
4. **AI Research**: The AI performs deep multi-step research on each investor
5. **Generate Emails**: AI writes personalized emails based on the research
6. **Review & Send**: Review, edit, and approve emails before sending via Gmail

## 🔒 Privacy & Security

- Gmail OAuth tokens are encrypted and stored securely
- Users maintain full control - every email requires explicit approval
- Compliant with Google API Services User Data Policy
- See [Privacy Policy](https://reachround.vercel.app/privacy) for details

## 📄 License

This project is for demonstration and hackathon purposes.

## 🤝 Contact

For questions or feedback about ReachRound, please reach out via the GitHub repository.
