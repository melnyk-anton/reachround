import Anthropic from '@anthropic-ai/sdk'
import type { InvestorResearch } from './deep-research'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface EmailGenerationInput {
  projectContext: {
    name: string
    oneLiner: string
    industry?: string
    stage?: string
  }
  investorResearch: InvestorResearch
  fundingAsk?: string
  additionalContext?: string
}

export interface GeneratedEmail {
  subject: string
  body: string
}

export async function generateEmail(
  input: EmailGenerationInput
): Promise<GeneratedEmail> {
  const { projectContext, investorResearch, fundingAsk, additionalContext } = input

  const systemPrompt = `You are an expert cold email writer for startup founders reaching out to investors.

Your goal is to write highly personalized, compelling cold emails that:
1. Reference specific, recent information about the investor
2. Make a clear connection between the investor's interests and the startup
3. Are concise (150-200 words max)
4. Feel authentic and human, not templated
5. Have a clear, low-friction ask

Cold email best practices:
- Start with a personalized hook referencing their recent activity
- Briefly explain what the company does (1-2 sentences)
- Make the connection explicit - why are you reaching out to THEM specifically
- Keep it conversational and humble
- End with a simple ask (usually 15-20 min call)
- NO hype language, NO corporate speak
- Make it sound like a founder genuinely researched them

Subject line best practices:
- Short (5-8 words)
- Can reference their recent activity or investment
- Not salesy or generic
- Piques curiosity

Output format:
{
  "subject": "Your subject line here",
  "body": "Hi [First Name],\\n\\nEmail body here...\\n\\nBest,\\n[Founder Name]"
}

IMPORTANT:
- Use the investor's FIRST NAME only in the greeting
- Leave [Founder Name] as a placeholder - don't make up a name
- Make sure to reference at least 2-3 specific things from the research
- Sound like a human, not a robot`

  const userPrompt = `Write a personalized cold email for this scenario:

**The Startup:**
- Company: ${projectContext.name}
- Description: ${projectContext.oneLiner}
${projectContext.industry ? `- Industry: ${projectContext.industry}` : ''}
${projectContext.stage ? `- Stage: ${projectContext.stage}` : ''}
${fundingAsk ? `- Raising: ${fundingAsk}` : ''}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

**The Investor:**
- Name: ${investorResearch.investor_name}
- Firm: ${investorResearch.firm}
- Background: ${investorResearch.background}

**Recent Research:**
${investorResearch.recent_investments?.slice(0, 3).map(inv =>
  `- Invested in ${inv.company} (${inv.stage}, ${inv.date}): ${inv.description}`
).join('\n') || 'No recent investments found'}

**Recent Activity:**
${investorResearch.recent_activity?.slice(0, 3).map(act =>
  `- ${act.type}: ${act.content} (${act.date})`
).join('\n') || 'No recent activity found'}

**Key Talking Points:**
${investorResearch.talking_points?.map(point => `- ${point.hook} (${point.source})`).join('\n') || 'No talking points'}

**Why They're a Good Fit:**
${investorResearch.why_good_fit}

Write a cold email that:
1. References at least 2 specific things from the research above
2. Clearly explains what ${projectContext.name} does
3. Makes the connection between their interests and this startup
4. Asks for a 15-20 minute call
5. Feels authentic and researched, not templated

Return ONLY the JSON object with subject and body.`

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

    const email = JSON.parse(jsonText) as GeneratedEmail

    return email
  } catch (error) {
    console.error('Error generating email:', error)
    throw new Error('Failed to generate email with AI')
  }
}

export async function regenerateEmail(
  input: EmailGenerationInput & { feedback: string; previousEmail: GeneratedEmail }
): Promise<GeneratedEmail> {
  const { feedback, previousEmail, ...baseInput } = input

  const systemPrompt = `You are an expert cold email writer for startup founders reaching out to investors.

The founder has given feedback on a previous draft. Incorporate their feedback while maintaining cold email best practices.

Output format:
{
  "subject": "Your subject line here",
  "body": "Hi [First Name],\\n\\nEmail body here...\\n\\nBest,\\n[Founder Name]"
}`

  const userPrompt = `The founder wants to revise this email:

**Previous Email:**
Subject: ${previousEmail.subject}
Body: ${previousEmail.body}

**Founder's Feedback:**
${feedback}

**Context (for reference):**
Company: ${baseInput.projectContext.name}
Investor: ${baseInput.investorResearch.investor_name} at ${baseInput.investorResearch.firm}

Please revise the email based on the feedback while keeping it personalized and effective.

Return ONLY the JSON object with the new subject and body.`

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

    let jsonText = content.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    return JSON.parse(jsonText) as GeneratedEmail
  } catch (error) {
    console.error('Error regenerating email:', error)
    throw new Error('Failed to regenerate email with AI')
  }
}
