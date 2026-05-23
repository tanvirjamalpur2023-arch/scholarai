import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const { message, scholarshipContext } = await request.json()

    const zai = await ZAI.create()

    const systemPrompt = `You are a Scholarship AI Assistant specializing in helping students find scholarships worldwide, particularly in textile-related subjects. You have extensive knowledge about:
- International scholarships (Erasmus Mundus, DAAD, Chevening, MEXT, Fulbright, etc.)
- Textile engineering, textile design, smart textiles, textile chemistry, and sustainable fashion programs
- Application processes, requirements, and deadlines
- University programs in textile-related fields

${scholarshipContext ? `Here is the current scholarship data in the system:\n${scholarshipContext}` : ''}

Always respond in a helpful, encouraging tone. When discussing scholarships, include specific details about:
1. Eligibility requirements
2. Application deadlines
3. Benefits and coverage
4. Tips for successful applications

If asked about textile-related subjects, provide detailed information about career prospects, research opportunities, and industry trends. Write your response in the same language the user uses.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
