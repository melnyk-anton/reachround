import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ResearchStep {
  step: number
  title: string
  content: string
  timestamp: string
}

export interface InvestorResearch {
  investor_name: string
  firm: string
  background: string
  recent_investments: Array<{
    company: string
    date: string
    stage: string
    description: string
    relevance?: string
  }>
  investment_thesis: string
  recent_activity: Array<{
    type: 'tweet' | 'linkedin' | 'podcast' | 'blog' | 'interview'
    content: string
    date: string
    source_url: string
    relevance?: string
  }>
  talking_points: Array<{
    hook: string
    reasoning: string
    source: string
  }>
  why_good_fit: string
  match_score: number
}

export interface DeepResearchInput {
  investorName: string
  firm?: string
  projectContext: {
    name: string
    oneLiner: string
    industry?: string
    stage?: string
  }
  onProgress?: (step: ResearchStep) => void
}

export async function performDeepResearch(
  input: DeepResearchInput
): Promise<InvestorResearch> {
  const { investorName, firm, projectContext, onProgress } = input

  const systemPrompt = `You are an expert investor research analyst. Your job is to perform deep research on venture capital investors to help founders craft personalized outreach.

You will conduct multi-step research on an investor and provide actionable insights for personalized cold emails.

Your research should cover:
1. Background and bio
2. Recent investments (2023-2025)
3. Investment thesis and focus areas
4. Recent social media activity (especially Twitter)
5. Podcast appearances or interviews
6. Articles they've written or been featured in
7. Specific opinions on the founder's industry

For each research area, provide specific, actionable information that could be referenced in a cold email.

Output your final research as JSON with this structure:
{
  "investor_name": "Jane Smith",
  "firm": "Sequoia Capital",
  "background": "Former founder of... Partner at Sequoia since...",
  "recent_investments": [
    {
      "company": "Stripe",
      "date": "2024-03-15",
      "stage": "Series C",
      "description": "Led $450M Series C round",
      "relevance": "Similar fintech space"
    }
  ],
  "investment_thesis": "Focuses on...",
  "recent_activity": [
    {
      "type": "tweet",
      "content": "Summary of tweet about AI...",
      "date": "2024-12-15",
      "source_url": "https://twitter.com/...",
      "relevance": "Relevant to this startup"
    }
  ],
  "talking_points": [
    {
      "hook": "Recently tweeted about AI in fintech",
      "reasoning": "Shows active interest in the space",
      "source": "Twitter, Dec 15 2024"
    }
  ],
  "why_good_fit": "Aligns with founder's company because...",
  "match_score": 9
}`

  const steps: ResearchStep[] = []
  let stepNumber = 0

  const addStep = (title: string, content: string) => {
    stepNumber++
    const step: ResearchStep = {
      step: stepNumber,
      title,
      content,
      timestamp: new Date().toISOString(),
    }
    steps.push(step)
    if (onProgress) {
      onProgress(step)
    }
  }

  try {
    // Step 1: Background research
    addStep('Background Research', `Researching ${investorName}${firm ? ` at ${firm}` : ''}...`)

    // Step 2: Recent investments
    addStep('Recent Investments', 'Analyzing investment portfolio and recent deals...')

    // Step 3: Investment thesis
    addStep('Investment Thesis', 'Understanding focus areas and investment criteria...')

    // Step 4: Social activity
    addStep('Recent Activity', 'Checking Twitter, podcasts, and articles...')

    // Step 5: Generating insights
    addStep('Generating Insights', 'Creating personalized talking points...')

    // Now perform the actual research with Claude
    const userPrompt = `Perform deep research on this investor for a personalized cold email:

**Investor:** ${investorName}
${firm ? `**Firm:** ${firm}` : ''}

**Context - The startup reaching out:**
- Company: ${projectContext.name}
- Description: ${projectContext.oneLiner}
${projectContext.industry ? `- Industry: ${projectContext.industry}` : ''}
${projectContext.stage ? `- Stage: ${projectContext.stage}` : ''}

Research this investor thoroughly and provide:
1. Their background and current role
2. Recent investments (especially 2023-2025)
3. Their investment thesis and what they look for
4. Recent tweets, podcasts, or articles (if any)
5. Specific talking points that would make a cold email personalized
6. Why they're a good fit for ${projectContext.name}

Focus on finding specific, recent, and actionable information that can be referenced in a cold email.

Return ONLY the JSON object, no additional text.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const research = JSON.parse(jsonText) as InvestorResearch

    addStep('Research Complete', `Found ${research.talking_points?.length || 0} talking points`)

    return research
  } catch (error) {
    console.error('Error performing deep research:', error)
    throw new Error('Failed to complete investor research')
  }
}
