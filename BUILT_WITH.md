# Built With

ReachRound is built using modern web technologies and AI services to deliver a fast, reliable, and intelligent investor outreach platform.

## Languages

- **TypeScript** - Primary language for both frontend and backend, providing type safety and better developer experience
- **JavaScript** - Runtime environment and some utility functions
- **SQL** - PostgreSQL database queries and schema definitions
- **HTML/CSS** - Markup and styling via JSX and Tailwind CSS

## Frameworks & Libraries

### Frontend
- **Next.js 14** - React framework with App Router for server-side rendering, routing, and API routes
- **React 18** - UI component library for building interactive user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI primitives
- **Lucide React** - Icon library for consistent, customizable icons
- **React Hook Form** - Form state management and validation
- **Zod** - TypeScript-first schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints for backend logic
- **Node.js** - JavaScript runtime for server-side execution

## Cloud Services & Platforms

### Hosting & Deployment
- **Vercel** - Platform for deploying Next.js applications with automatic CI/CD, edge functions, and serverless infrastructure

### Database & Authentication
- **Supabase** - Backend-as-a-Service providing:
  - **PostgreSQL** - Relational database for storing projects, investors, emails, and research data
  - **Supabase Auth** - User authentication and session management
  - **Supabase Storage** - File storage for pitch decks and assets
  - **Row Level Security (RLS)** - Database-level security for multi-tenant data isolation

### AI Services
- **Anthropic Claude API** - Powered by Claude 3.5 Sonnet for:
  - Multi-step investor research with web search
  - Intelligent investor discovery
  - Personalized email generation
  - Natural language understanding and generation

### Email Services
- **Gmail API** - Google's API for sending emails programmatically
- **Google OAuth 2.0** - Secure authentication flow for Gmail access
- **googleapis (Node.js client)** - Official Google APIs client library

## APIs & Integrations

- **Anthropic API** - Claude 3.5 Sonnet for AI-powered research and content generation
- **Gmail API** - For sending emails from user's Gmail account
  - Scopes: `gmail.send`, `gmail.readonly`
- **Google OAuth 2.0** - Authentication and authorization for Gmail access
- **Supabase REST API** - Database operations and authentication
- **Web Search** - Integrated via Claude's built-in search capabilities

## Development Tools

- **Git** - Version control
- **GitHub** - Code repository and collaboration
- **npm** - Package manager
- **ESLint** - Code linting for quality and consistency
- **Prettier** - Code formatting (via conventions)
- **TypeScript Compiler** - Type checking and compilation

## Key Dependencies

```json
{
  "next": "14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "@anthropic-ai/sdk": "^0.20.0",
  "googleapis": "^128.0.0",
  "zod": "^3.22.4",
  "react-hook-form": "^7.50.0",
  "sonner": "^1.4.0",
  "lucide-react": "^0.344.0",
  "tailwind-merge": "^2.2.0",
  "class-variance-authority": "^0.7.0"
}
```

## Architecture Patterns

- **Server Components** - Next.js 14 App Router with React Server Components for improved performance
- **API Routes** - Serverless functions for backend logic
- **Multi-Agent AI System** - Specialized AI agents for different tasks (research, finding, email writing)
- **OAuth 2.0 Flow** - Secure authorization for Gmail access with token refresh
- **Row Level Security** - Database-level security policies for data isolation
- **Server-Sent Events (SSE)** - Real-time streaming of AI research progress
- **Streaming Responses** - Progressive rendering of AI-generated content

## Security & Privacy

- **OAuth 2.0** - Industry-standard authorization protocol
- **Encrypted Token Storage** - Gmail tokens stored securely in Supabase
- **Row Level Security (RLS)** - PostgreSQL policies ensuring users can only access their own data
- **HTTPS/TLS** - All communications encrypted in transit
- **Environment Variables** - Sensitive credentials stored securely
- **CORS Configuration** - Proper cross-origin resource sharing policies

## Performance Optimizations

- **Server-Side Rendering (SSR)** - Fast initial page loads
- **Edge Functions** - Low-latency API responses via Vercel Edge Network
- **React Server Components** - Reduced JavaScript bundle size
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Next.js automatic image optimization
- **Database Indexing** - Optimized PostgreSQL queries with proper indexes

## Development Workflow

- **Git Flow** - Feature branches and pull requests
- **Vercel Previews** - Automatic preview deployments for every commit
- **Environment Variables** - Separate configs for development and production
- **Type Safety** - TypeScript throughout the entire codebase
- **Component-Driven** - Modular, reusable UI components

## Compliance & Standards

- **Google API Services User Data Policy** - Full compliance with Google's data handling requirements
- **GDPR Considerations** - Privacy-first design with user data control
- **OAuth 2.0 Security Best Practices** - Secure token handling and refresh flows
- **Web Accessibility** - Following WCAG guidelines with shadcn/ui components

---

**Total Technologies Used:** 25+ languages, frameworks, platforms, and services working together to create a seamless AI-powered investor outreach experience.
