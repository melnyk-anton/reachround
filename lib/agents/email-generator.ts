import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface EmailGenerationInput {
  investorName: string
  firm?: string
  projectName: string
  projectOneLiner: string
  founderName: string
  researchSummary?: string
  thesisAlignment?: string
  personalizationAngles?: string[]
  talkingPoints?: string[]
}

export interface GeneratedEmail {
  subject: string
  body: string
  tone: string
}

export async function generateEmail(
  input: EmailGenerationInput
): Promise<GeneratedEmail> {
  const {
    investorName,
    firm,
    projectName,
    projectOneLiner,
    founderName,
    researchSummary,
    thesisAlignment,
    personalizationAngles,
    talkingPoints,
  } = input

  const systemPrompt = `You are an expert cold email writer specializing in startup fundraising. Your job is to write personalized, compelling cold emails to investors.

Key principles:
- Keep it SHORT (under 150 words)
- Be specific and personal (reference their investments/thesis)
- Focus on traction and unique insight
- Make a clear ask
- Professional but conversational tone
- No generic flattery or buzzwords

Output your response as a JSON object:
{
  "subject": "Subject line (under 60 chars, specific and intriguing)",
  "body": "Email body (under 150 words, personalized)",
  "tone": "Brief description of the tone used"
}`

  let userPrompt = `Write a cold email to ${investorName}${firm ? ` at ${firm}` : ''} for ${projectName}.

**About ${projectName}:**
${projectOneLiner}

**Sender:** ${founderName}
`

  if (researchSummary) {
    userPrompt += `\n**Investor Background:**\n${researchSummary}\n`
  }

  if (thesisAlignment) {
    userPrompt += `\n**Why They're a Good Fit:**\n${thesisAlignment}\n`
  }

  if (personalizationAngles && personalizationAngles.length > 0) {
    userPrompt += `\n**Personalization Angles:**\n${personalizationAngles.map(a => `- ${a}`).join('\n')}\n`
  }

  if (talkingPoints && talkingPoints.length > 0) {
    userPrompt += `\n**Key Points to Highlight:**\n${talkingPoints.map(p => `- ${p}`).join('\n')}\n`
  }

  userPrompt += `\nWrite a compelling cold email that:
1. Opens with a personalized hook based on the investor's background
2. Briefly introduces ${projectName} with the most compelling metric or insight
3. Explains why this is relevant to ${investorName}'s investment thesis
4. Ends with a simple, low-pressure ask

Return ONLY the JSON object with subject and body. No additional text.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
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

    const result = JSON.parse(jsonText) as GeneratedEmail

    // Validate the result
    if (!result.subject || !result.body) {
      throw new Error('Invalid email generation result')
    }

    return result
  } catch (error) {
    console.error('Error generating email:', error)
    throw new Error('Failed to generate email with AI')
  }
}
