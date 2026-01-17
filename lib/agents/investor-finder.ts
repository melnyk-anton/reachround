import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface InvestorMatch {
  name: string
  firm: string
  title: string
  linkedin_url?: string
  twitter_url?: string
  reasoning: string
  match_score: number
}

export interface InvestorFinderInput {
  projectName: string
  oneLiner: string
  industry?: string
  stage?: string
  targetGeography?: string
  additionalCriteria?: string
  count: number
}

export async function findInvestors(input: InvestorFinderInput): Promise<InvestorMatch[]> {
  const { projectName, oneLiner, industry, stage, targetGeography, additionalCriteria, count } = input

  const systemPrompt = `You are an expert investor research assistant. Your job is to find relevant investors for startups.

Given information about a startup, you will identify ${count} potential investors who would be a good match.

For each investor, provide:
- Full name
- Firm name
- Their title/role
- LinkedIn URL (if you can reasonably infer it exists)
- Twitter URL (if you can reasonably infer it exists)
- Detailed reasoning for why they're a good match
- Match score (1-10)

Focus on:
- Investors who have invested in similar companies
- Stage-appropriate investors (don't suggest Series A investors for pre-seed)
- Geographic alignment if specified
- Recent activity and current investment focus

Output your response as a JSON array with this structure:
[
  {
    "name": "Jane Smith",
    "firm": "Sequoia Capital",
    "title": "Partner",
    "linkedin_url": "https://linkedin.com/in/janesmith",
    "twitter_url": "https://twitter.com/janesmith",
    "reasoning": "Led investments in 3 similar fintech companies...",
    "match_score": 9
  }
]`

  const userPrompt = `Find ${count} investors for this startup:

**Company:** ${projectName}
**Description:** ${oneLiner}
${industry ? `**Industry:** ${industry}` : ''}
${stage ? `**Stage:** ${stage}` : ''}
${targetGeography ? `**Target Geography:** ${targetGeography}` : ''}
${additionalCriteria ? `**Additional Criteria:** ${additionalCriteria}` : ''}

Please identify ${count} investors who would be most likely to invest in this company. Focus on recent activity (2023-2025) and investors who are actively investing.

Return ONLY the JSON array, no additional text.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
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

    // Extract JSON from response (handle cases where Claude adds markdown)
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const investors = JSON.parse(jsonText) as InvestorMatch[]

    // Validate and limit to requested count
    return investors.slice(0, count)
  } catch (error) {
    console.error('Error finding investors:', error)
    throw new Error('Failed to find investors with AI')
  }
}
