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
  ask: string
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
    ask,
    researchSummary,
    thesisAlignment,
    personalizationAngles,
    talkingPoints,
  } = input

  const systemPrompt = `You are an expert cold email writer specializing in fundraising outreach for startup founders. Your job is to write personalized, compelling emails to investors that get responses.

FUNDRAISING EMAIL PRINCIPLES:
- Length: 50-125 words max
- Personal hook must be ULTRA-SPECIFIC - reference exact article title, specific portfolio company, recent tweet, or conference talk
- Include 2-3 CONCRETE metrics (revenue, growth rate, paying customers, MRR)
- Be direct about fundraising - don't hide it, but don't make it the focus
- Ask for specific actionable feedback with a concrete next step

STRUCTURE (follow exactly):
1. ULTRA-SPECIFIC personal hook (1-2 sentences)
   - Bad: "Your thesis on AI"
   - Good: "Read your post on 'Why vertical AI will win' - especially the point about workflow integration"

2. Company + traction in ONE sentence
   - Must include: what you do + ONE compelling metric
   - Example: "Building AI investor matching - 200 signups, 40% week-over-week growth in first month"

3. Why them + funding context (1-2 sentences)
   - Connect their specific expertise/portfolio to your space
   - Mention what you're raising
   - Example: "Raising $500K pre-seed; given your work with [specific company], would love your take on our matching accuracy vs. traditional methods"

4. Concrete ask with action (1 sentence)
   - Bad: "Would value your perspective"
   - Good: "Do you have 15 minutes next week to share thoughts on our go-to-market?"

QUALITY CHECKS:
- Personal hook: Can ONLY be used for THIS investor? (If it works for 10+ investors, it's too generic)
- Traction: Are numbers specific and impressive? (No vague "signups" without context)
- Ask: Is there a clear next step with timeframe?
- Overall: Does it sound like you researched THEM specifically?

AVOID:
- Generic phrases: "your thesis on X", "your work in Y" (be MORE specific)
- Vague metrics: "200 signups" (Are they paid? Free? Active?)
- Weak asks: "would value your perspective" (On what? When? How?)
- Templates: Every email should feel custom-written for that investor

Output as JSON:
{
  "subject": "Subject line (specific, under 50 chars, with credibility signal)",
  "body": "Email body (50-125 words, passes ALL quality checks above)",
  "tone": "Brief tone description"
}`

  let userPrompt = `Write a fundraising cold email to ${investorName}${firm ? ` at ${firm}` : ''}.

**From:** ${founderName}

**What I'm building:** ${projectName}
${projectOneLiner}

**Fundraising context:**
${ask}
`

  if (researchSummary) {
    userPrompt += `\n**About ${investorName}:**\n${researchSummary}\n`
  }

  if (thesisAlignment) {
    userPrompt += `\n**Why They're Relevant:**\n${thesisAlignment}\n`
  }

  if (personalizationAngles && personalizationAngles.length > 0) {
    userPrompt += `\n**Personal Hooks (use ONE of these to open):**\n${personalizationAngles.map(a => `- ${a}`).join('\n')}\n`
  }

  if (talkingPoints && talkingPoints.length > 0) {
    userPrompt += `\n**Key Points to Potentially Include:**\n${talkingPoints.map(p => `- ${p}`).join('\n')}\n`
  }

  userPrompt += `\nWrite a fundraising email that passes ALL quality checks from the system prompt.

YOUR TASK:
1. Find the MOST SPECIFIC detail about ${investorName} from the research (exact article title, specific portfolio company name, recent tweet topic, etc.) and use it as your hook
2. Combine company intro + ONE impressive metric in a single sentence
3. Connect their specific work to why you're reaching out + mention the fundraising round
4. End with a concrete ask: specific topic + timeframe (e.g., "15 minutes next week")

QUALITY CHECKLIST (your email MUST pass all):
✓ Personal hook: Could this ONLY work for ${investorName}? (Not "your thesis on AI" - be MORE specific)
✓ Traction: Did you qualify the numbers? (Not just "200 signups" - paid? active? growing?)
✓ Connection: Did you name a specific portfolio company or article or investment?
✓ Ask: Is there a clear action with timeframe? (Not "would value thoughts" - when? on what exactly?)
✓ Natural flow: Does it read like you personally wrote it for them?

STRICT RULES:
- NO generic phrases like "your work in X" or "your thesis on Y" - reference SPECIFIC content
- NO vague metrics - always add context (growth rate, paid vs free, retention, etc.)
- NO weak asks - always include timeframe and specific topic
- NO apologizing or "hope this finds you well"
- Every sentence must add value - cut fluff ruthlessly

Target: 75-100 words (tight and punchy).

Return ONLY the JSON object. No additional text.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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
