import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface InvestorResearchInput {
  investorName: string
  firm?: string
  title?: string
  linkedinUrl?: string
  twitterUrl?: string
  projectName: string
  projectOneLiner: string
  industry?: string
  stage?: string
}

export interface InvestorResearchResult {
  summary: string
  email: string | null
  investment_focus: string[]
  recent_investments: string[]
  thesis_alignment: string
  personalization_angles: string[]
  recommended_talking_points: string[]
  confidence_score: number
}

export async function researchInvestor(
  input: InvestorResearchInput
): Promise<InvestorResearchResult> {
  const {
    investorName,
    firm,
    title,
    linkedinUrl,
    twitterUrl,
    projectName,
    projectOneLiner,
    industry,
    stage,
  } = input

  const systemPrompt = `You are an expert investor research analyst. Your job is to analyze an investor and determine how to best approach them for a startup fundraising opportunity.

Given information about an investor and a startup, you will:
1. Find the investor's email address (if publicly available)
2. Summarize the investor's background and investment focus
3. Identify their key investment areas and thesis
4. Find recent investments they've made
5. Analyze how the startup aligns with their investment thesis
6. Suggest personalization angles for outreach
7. Provide talking points that would resonate

Output your response as a JSON object with this structure:
{
  "summary": "Brief 2-3 sentence summary of the investor",
  "email": "investor@example.com or null if not found",
  "investment_focus": ["Area 1", "Area 2", "Area 3"],
  "recent_investments": ["Company 1", "Company 2", "Company 3"],
  "thesis_alignment": "Explanation of how the startup aligns with investor's thesis",
  "personalization_angles": ["Angle 1", "Angle 2", "Angle 3"],
  "recommended_talking_points": ["Point 1", "Point 2", "Point 3"],
  "confidence_score": 8
}

IMPORTANT: Try to find the investor's email address from:
- Their LinkedIn profile
- Their firm's website (often listed on team pages)
- Their Twitter/X bio
- Public contact information
- Professional directories

If you cannot find a publicly available email, set "email" to null.

The confidence_score should be 1-10 based on how good a fit this investor is for the startup.`

  const userPrompt = `Research this investor for a potential investment opportunity:

**Investor:**
- Name: ${investorName}
${firm ? `- Firm: ${firm}` : ''}
${title ? `- Title: ${title}` : ''}
${linkedinUrl ? `- LinkedIn: ${linkedinUrl}` : ''}
${twitterUrl ? `- Twitter: ${twitterUrl}` : ''}

**Startup to Pitch:**
- Name: ${projectName}
- Description: ${projectOneLiner}
${industry ? `- Industry: ${industry}` : ''}
${stage ? `- Stage: ${stage}` : ''}

CRITICAL: First, try to find the investor's email address. Check:
1. Their firm's website team page
2. Their LinkedIn profile contact section
3. Their Twitter/X bio
4. Any public contact information

Then analyze the investor and provide research insights. Focus on publicly available information about their investment thesis, portfolio, and interests.

Return ONLY the JSON object, no additional text.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
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

    const result = JSON.parse(jsonText) as InvestorResearchResult

    // Validate the result has required fields
    if (
      !result.summary ||
      !result.investment_focus ||
      !result.thesis_alignment ||
      !result.confidence_score
    ) {
      throw new Error('Invalid research result format')
    }

    return result
  } catch (error) {
    console.error('Error researching investor:', error)
    throw new Error('Failed to research investor with AI')
  }
}
