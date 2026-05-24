import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { message, scholarshipContext, chatHistory } = await request.json()

    const zai = await ZAI.create()

    const systemPrompt = `You are ScholarAI, an advanced AI Assistant specializing in helping students find scholarships worldwide, with deep expertise in textile-related subjects and wet process engineering. You have extensive knowledge about:

- International scholarships (Erasmus Mundus, DAAD, Chevening, MEXT, Fulbright, CSC, IsDB, Commonwealth, Eiffel, Gates Cambridge, Rhodes, VLIR-UOS, Swedish Institute, Australia Awards, Korean Government, Turkish Government, and many more)
- Textile engineering, textile design, smart textiles, textile chemistry, and sustainable fashion programs
- Wet Process Engineering: dyeing & finishing, textile wet processing, color chemistry, textile chemical processing, polymer science, fiber science, textile printing, sustainable textile processing, textile finishing, environmental textile engineering, nanotechnology in textiles, green chemistry in textiles, denim processing, textile biotechnology
- Application processes, requirements, deadlines, and tips for successful applications
- University programs and career prospects in textile-related fields
- Scholarship comparisons and personalized recommendations

${scholarshipContext ? `Here is the current scholarship data in the system (${scholarshipContext.split('\n').length} scholarships):\n${scholarshipContext}` : 'No scholarship data currently available in the system.'}

Your capabilities:
1. **Scholarship Search & Comparison**: Help students find and compare scholarships based on country, subject, degree level, deadline, and funding amount.
2. **Personalized Recommendations**: Based on the student's background, interests, and goals, suggest the most suitable scholarships.
3. **Application Guidance**: Provide detailed advice on application essays, recommendation letters, interviews, and preparation strategies.
4. **Subject Expertise**: Deep knowledge of wet process engineering and textile subjects - explain career paths, research opportunities, and industry trends.
5. **Web Search**: When asked about scholarships or programs NOT in the database, you can search the web for up-to-date information.
6. **Multi-turn Conversation**: Remember the context of our conversation and provide coherent, follow-up responses.

Guidelines:
- Always respond in the same language the user uses.
- When discussing scholarships from the database, reference specific details like university, country, deadline, and funding.
- When comparing scholarships, create clear structured comparisons.
- If a scholarship is not in the database, mention that and offer to search the web for more information.
- Provide actionable advice with specific steps.
- Be encouraging but realistic about scholarship competitiveness.
- Format responses with clear sections, bullet points, and emphasis where helpful.
- If the user asks about deadlines, always emphasize urgency for closing_soon scholarships.`

    // Build messages array with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add chat history (last 10 messages)
    if (chatHistory && Array.isArray(chatHistory)) {
      const historySlice = chatHistory.slice(-10)
      for (const msg of historySlice) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message })

    // Determine if web search is needed
    const needsWebSearch = shouldSearchWeb(message, scholarshipContext)

    let webSearchContext = ''
    if (needsWebSearch) {
      try {
        const searchQuery = extractSearchQuery(message)
        const searchResult = await zai.functions.invoke('web_search', {
          query: searchQuery,
        })
        if (searchResult && typeof searchResult === 'object') {
          const results = (searchResult as any).results || (searchResult as any).data || searchResult
          webSearchContext = typeof results === 'string' 
            ? results 
            : JSON.stringify(results, null, 2).slice(0, 3000)
        }
      } catch (searchError) {
        console.error('Web search error:', searchError)
        // Continue without web search results
      }
    }

    // If we have web search results, add them to the user message context
    if (webSearchContext) {
      messages[messages.length - 1] = {
        role: 'user',
        content: `${message}\n\n[Web Search Results - use these to supplement your knowledge if relevant]:\n${webSearchContext}`
      }
    }

    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}

/**
 * Determine if the user's question likely asks about scholarships/programs
 * not in the database, requiring a web search.
 */
function shouldSearchWeb(message: string, scholarshipContext?: string): boolean {
  const lowerMsg = message.toLowerCase()
  
  // Keywords that suggest the user wants external/specific info
  const webSearchIndicators = [
    'latest', 'new', 'recent', '2027', '2028', 'update', 'current',
    'find me', 'search for', 'look for', 'are there any',
    'other than', 'besides', 'apart from', 'outside',
    'not in', 'more options', 'alternatives',
    'specifically in', 'available in',
    'any scholarships in', 'scholarships for',
    'what scholarships', 'which scholarships',
  ]
  
  const hasWebIndicator = webSearchIndicators.some(indicator => lowerMsg.includes(indicator))
  
  // Check if the user is asking about a country/subject that may not be in our database
  const countriesNotInDb = [
    'qatar', 'uae', 'dubai', 'abu dhabi', 'saudi', 'arabia', 'riyadh',
    'malaysia', 'austria', 'poland', 'greece', 'denmark', 'norway',
    'ireland', 'spain', 'hungary', 'thailand', 'singapore',
    'brazil', 'argentina', 'mexico', 'colombia', 'chile',
    'portugal', 'czech', 'romania', 'croatia', 'serbia',
    'vietnam', 'indonesia', 'philippines', 'pakistan', 'nigeria',
    'kenya', 'egypt', 'morocco', 'jordan', 'lebanon',
  ]
  
  const mentionsNewCountry = countriesNotInDb.some(country => lowerMsg.includes(country))
  
  // If user explicitly asks to search or mentions new countries
  if (hasWebIndicator || mentionsNewCountry) return true
  
  // If the context is small and user asks broad questions
  if (!scholarshipContext || scholarshipContext.length < 100) {
    const broadQuestions = ['what scholarships', 'recommend', 'suggest', 'best scholarships', 'help me find']
    return broadQuestions.some(q => lowerMsg.includes(q))
  }
  
  return false
}

/**
 * Extract a focused search query from the user's message
 */
function extractSearchQuery(message: string): string {
  // Add context for better search results
  return `scholarship ${message} textile engineering wet process 2026 2027 international`
}
