# ReachRound - AI Investor Outreach Platform

## Inspiration

The inspiration for ReachRound came from a frustrating reality that every startup founder faces: **cold outreach to investors is incredibly time-consuming**. Founders told us they spend 20-30 minutes researching each investor, reading their recent investments, scanning their Twitter feeds, and trying to find that perfect personalized hook for their cold email. With hundreds of potential investors to reach out to, this becomes a full-time job that takes away from actually building the product.

We asked ourselves: *What if AI could do the deep research and write personalized emails that don't feel AI-generated?* Not generic template emails, but truly personalized messages that reference specific investments, tweets, or podcast appearances. Messages that feel like you spent 30 minutes researching that investor—because the AI actually did.

## What it does

ReachRound is an AI-powered platform that helps startup founders send highly personalized cold emails to investors at scale. Here's how it works:

1. **Project Setup**: Founders create a project describing their startup, what they're building, their traction, and their funding ask.

2. **AI Investor Discovery**: Our AI agent can find relevant investors based on criteria like industry focus, stage preference, and geography. Or founders can manually add investors they want to reach out to.

3. **Deep Multi-Step Research**: This is where the magic happens. For each investor, our AI performs a comprehensive 7-step research process:
   - Background and biography
   - Recent investments (2024-2025)
   - Investment thesis and focus areas
   - Recent Twitter/social media activity
   - Podcast appearances and interviews
   - Blog posts and articles they've written
   - Their views on specific industry topics

4. **Personalized Email Generation**: Using all the research, the AI generates a cold email that's genuinely personalized—referencing specific recent investments, tweets, or stated opinions that align with the founder's startup.

5. **Human-in-the-Loop Approval**: Every email is reviewed and approved by the founder before sending. They can edit, provide feedback for regeneration, or skip investors.

6. **Gmail Integration**: Emails are sent directly from the founder's Gmail account (via OAuth), ensuring high deliverability and keeping the founder in control.

The result? Founders can reach 50+ investors in the time it used to take to reach 3.

## How we built it

**Tech Stack:**
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Next.js API routes for serverless functions
- **Database**: Supabase (PostgreSQL + Authentication + Storage)
- **AI**: Anthropic's Claude 3.5 Sonnet via the Anthropic SDK
- **Email**: Gmail API with OAuth 2.0 authentication
- **Deployment**: Vercel for hosting and continuous deployment

**Architecture:**

We built ReachRound using a **multi-agent AI architecture** where specialized AI agents handle different parts of the workflow:

1. **Investor Finder Agent**: Uses web search capabilities to discover relevant investors based on the startup's profile and criteria.

2. **Deep Research Agent**: The most sophisticated agent in our system. It performs multi-step research with streaming updates to provide real-time progress feedback to users. Each research step builds on previous findings, creating a comprehensive investor profile.

3. **Email Writer Agent**: Takes the research output and the project context to generate personalized cold emails that naturally weave in the research findings.

**Key Technical Decisions:**

- **Supabase for Everything**: We chose Supabase because it provides PostgreSQL, authentication, and file storage in one platform with excellent Row Level Security for data isolation.

- **OAuth Over SMTP**: Instead of using traditional SMTP for sending emails, we integrated with Gmail's API using OAuth. This means emails come directly from the founder's actual Gmail account, which dramatically improves deliverability and trust.

- **Streaming Research Updates**: We implemented Server-Sent Events (SSE) to stream research progress in real-time, so users can watch the AI work through each research step. This transparency builds trust and makes the waiting experience much better.

- **Human-in-the-Loop Design**: We deliberately chose not to automate sending. Every email requires human approval. This ensures quality control and gives founders confidence that nothing goes out without their review.

## Challenges we ran into

**1. Google OAuth Verification Requirements**

Getting Gmail API access approved by Google was more complex than expected. Google requires a comprehensive privacy policy, specific scope justifications, and security review for apps that access user Gmail data. We had to:
- Create a detailed privacy policy explaining exactly how we use Gmail data
- Provide written justifications for each Gmail API scope
- Add the privacy policy link prominently on our homepage
- Navigate Google's verification process for sensitive scopes

**2. Multi-Step AI Agent Orchestration**

Building an AI agent that performs 7 sequential research steps with web search was technically challenging. We had to:
- Design prompts that guided the agent through each research phase
- Handle cases where searches return no results or irrelevant information
- Implement proper error recovery when API calls fail mid-research
- Stream progress updates to the frontend in real-time without blocking

**3. Context Window Management**

With deep research generating large amounts of text (investor bios, article summaries, tweets, etc.), we quickly hit context window limits when generating emails. We solved this by:
- Implementing intelligent summarization of research findings
- Extracting only the most relevant "talking points" from research
- Using structured data formats to compress information
- Prioritizing recent and relevant information over older data

**4. Email Deliverability**

Cold emails often end up in spam. We addressed this by:
- Using Gmail OAuth instead of SMTP (emails from real Gmail accounts)
- Implementing natural-sounding email generation that avoids spam triggers
- Adding randomized delays between sends (2-5 seconds) to avoid rate limits
- Keeping emails concise and avoiding spam keywords

**5. Database Row Level Security (RLS)**

We hit several issues with Supabase RLS policies blocking legitimate queries. The challenge was ensuring that:
- Users can only access their own projects and investors
- Service role operations (like token refresh) bypass RLS appropriately
- Research data is properly associated with the correct user
- Join queries work correctly across tables with different RLS policies

We spent significant time debugging RLS policy interactions and eventually created a comprehensive set of policies that properly isolate user data while allowing necessary operations.

## Accomplishments that we're proud of

**1. The Research Quality is Genuinely Impressive**

The multi-step research agent produces results that match or exceed what a human would find in 20-30 minutes of manual research. It finds recent investments, specific tweets, podcast quotes—things that make the emails feel truly personalized.

**2. Real-Time Streaming Research UI**

Watching the AI work through each research step in real-time is mesmerizing. Users can see exactly what the AI is searching for, what it found, and how it's building the investor profile. This transparency turns waiting into an engaging experience.

**3. End-to-End Working Product**

In a short timeframe, we built a complete, production-ready application that handles:
- User authentication and project management
- AI-powered investor discovery and research
- Email generation with feedback loops
- Gmail OAuth integration and sending
- A polished, responsive UI with excellent UX

Everything works together seamlessly, and we deployed it to production with proper security, privacy policies, and OAuth verification.

**4. Privacy-First Design**

We're proud that we built ReachRound with privacy and user control at the core:
- All Gmail tokens are encrypted and stored securely
- Users must explicitly approve every single email
- We only request the minimum Gmail scopes needed
- Complete compliance with Google's API Services User Data Policy
- Clear privacy policy and data handling practices

**5. The Emails Don't Sound AI-Generated**

This was critical. We iterated extensively on the email generation prompts to produce emails that sound natural, human, and genuinely personalized. They reference specific, recent facts about the investor without being creepy or over-the-top.

## What we learned

**Technical Learnings:**

1. **Multi-Agent AI Systems**: We learned how to architect complex AI workflows with multiple specialized agents that hand off context between steps. The key is clear agent responsibilities and structured data formats for inter-agent communication.

2. **Streaming AI Responses**: Implementing Server-Sent Events for streaming research updates taught us about progressive enhancement and how to build UIs that gracefully handle real-time data streams.

3. **OAuth is Hard But Worth It**: Gmail OAuth added significant complexity, but the payoff in deliverability and user trust is enormous. We learned the intricacies of OAuth 2.0 flows, token refresh logic, and Google's verification requirements.

4. **Row Level Security at Scale**: We gained deep knowledge of PostgreSQL RLS and how to design policies that properly isolate multi-tenant data while allowing complex queries and joins.

5. **Production-Ready AI Apps**: Shipping an AI app to production involves challenges beyond the AI itself—rate limiting, error recovery, cost management, context window optimization, and user trust/transparency.

**Product Learnings:**

1. **Human-in-the-Loop is Essential**: For sensitive operations like sending cold emails, users need to feel in control. Automation without oversight creates anxiety, not value.

2. **Show Your Work**: Users trust AI more when they can see how it reached its conclusions. Showing research steps and sources builds confidence in the generated emails.

3. **Real-Time Feedback Matters**: Streaming progress updates transformed "waiting for AI" from frustrating to engaging. Users love watching the agent work.

4. **Personalization Quality > Quantity**: It's better to send 10 highly personalized emails than 100 generic ones. Our research depth makes each email count.

## What's next for ReachRound

**Short-Term (Next 2-4 weeks):**

1. **Email Tracking & Analytics**
   - Track open rates, reply rates, and click-through rates
   - Show which personalization angles work best
   - A/B testing for subject lines and email styles

2. **Memory & Learning**
   - Integrate Mem0 for persistent memory across campaigns
   - Learn from approved vs. rejected emails to improve future generations
   - Remember user's writing style preferences

3. **Campaign Management**
   - Organize outreach into campaigns (Seed Round, Series A, etc.)
   - Track which investors belong to which campaigns
   - Schedule sends across multiple days

4. **Reply Detection & Follow-ups**
   - Detect when investors reply
   - Suggest personalized follow-up messages
   - Track conversation threads

**Medium-Term (1-3 months):**

1. **Multi-Channel Outreach**
   - LinkedIn connection requests with personalized notes
   - Twitter DMs for investors active on social media
   - Integrated CRM for tracking all touchpoints

2. **Team Collaboration**
   - Multiple team members working on the same project
   - Comment threads on investor profiles
   - Approval workflows (one person writes, another approves)

3. **Advanced Research Sources**
   - Integration with Crunchbase, PitchBook, and other investor databases
   - YouTube transcript analysis for podcast appearances
   - LinkedIn activity monitoring

4. **Smart Investor Matching**
   - ML model to predict investor fit based on historical data
   - Recommend optimal send times based on investor behavior
   - Prioritize investors most likely to respond

**Long-Term Vision:**

We envision ReachRound becoming the **operating system for fundraising**. Beyond cold outreach, we want to:

- **Investor Relationship Management**: Track all interactions, meetings, and follow-ups with investors over time, even across multiple fundraising rounds.

- **Warm Intro Optimization**: Analyze your network to find the best warm intro paths to target investors, then draft intro request messages.

- **Pitch Deck Intelligence**: AI that reviews your pitch deck and suggests improvements based on what has worked for similar startups.

- **Fundraising Analytics**: Aggregate anonymized data to show founders what's working in the market—response rates by industry, optimal email lengths, best subject line patterns, etc.

- **Investor Network Effects**: As more founders use ReachRound, we can provide better intel on investors—average response times, likelihood to respond, what they really care about beyond their stated thesis.

Our ultimate goal is to **level the playing field for founders**. Fundraising shouldn't be about who has the best network or who can spend the most time on manual outreach. It should be about who's building the best company. ReachRound makes top-tier, personalized investor outreach accessible to every founder.

---

*Built with ❤️ for founders who want to spend more time building and less time on cold outreach.*
