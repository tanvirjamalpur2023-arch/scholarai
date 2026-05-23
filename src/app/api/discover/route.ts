import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

// Discover new scholarships from the web using AI
export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    const searchQuery = query || 'international scholarship wet process engineering textile dyeing finishing 2026 2027 masters PhD'

    // Step 1: Search the web for scholarships
    const zai = await ZAI.create()
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: 10,
    })

    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No search results found. Try a different search query.',
        discovered: 0,
      })
    }

    // Step 2: Use AI to extract scholarship information from search results
    const searchContext = searchResults.map((r: { url: string; name: string; snippet: string }) =>
      `URL: ${r.url}\nTitle: ${r.name}\nSnippet: ${r.snippet}`
    ).join('\n\n')

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a scholarship data extraction expert. Based on the web search results below, extract scholarship information in valid JSON format.

Return a JSON array of scholarship objects. Each object must have these exact fields:
- title: string (scholarship name)
- description: string (detailed description, at least 50 words)
- university: string (university name)
- country: string (country where university is located)
- subject: string (subject/field of study - must be one of these: Wet Process Engineering, Dyeing & Finishing Engineering, Textile Chemistry, Color Chemistry, Textile Wet Processing, Textile Chemical Processing, Polymer Science & Engineering, Fiber Science & Technology, Textile Printing Technology, Sustainable Textile Processing, Textile Finishing Technology, Environmental Textile Engineering, Textile Auxiliaries & Chemicals, Nanotechnology in Textiles, Smart Textile Finishing, Water Treatment in Textile Industry, Green Chemistry in Textiles, Denim Processing Technology, Textile Process Engineering, Coloration Technology, Advanced Materials in Textiles, Textile Engineering, Textile Design, Smart Textiles, Textile Sustainability, Textile Technology, Textile Manufacturing, Fashion & Textile Business, Textile Biotechnology, Textile Materials Science, Textile Management, Textile Science)
- degree: string (Master's, PhD, or Postdoc)
- amount: string (scholarship amount/coverage)
- applicationUrl: string (application website URL from search results)
- openDate: string (YYYY-MM-DD format, estimated if not exact)
- deadlineDate: string (YYYY-MM-DD format, estimated if not exact)
- requirements: string (comma-separated requirements)
- benefits: string (comma-separated benefits)

Only include scholarships that are clearly for international students. Do NOT include scholarships you are unsure about.
Return ONLY the JSON array, no other text.`
        },
        {
          role: 'user',
          content: `Extract scholarships from these search results:\n\n${searchContext}`
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
    })

    const responseText = completion.choices[0]?.message?.content || '[]'

    // Parse the AI response
    let discoveredScholarships = []
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        discoveredScholarships = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json({
        success: false,
        message: 'Could not parse scholarship data from search results.',
        rawResults: searchResults.length,
        discovered: 0,
      })
    }

    // Step 3: Save new scholarships to database (avoid duplicates)
    let savedCount = 0
    const newScholarships = []

    for (const s of discoveredScholarships) {
      if (!s.title || !s.university || !s.subject) continue

      // Check if similar scholarship already exists
      const existing = await db.scholarship.findFirst({
        where: {
          title: { contains: s.title.substring(0, 30) },
          university: { contains: s.university },
        },
      })

      if (!existing) {
        const now = new Date()
        const openDate = s.openDate ? new Date(s.openDate) : now
        const deadlineDate = s.deadlineDate ? new Date(s.deadlineDate) : new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

        // Determine status based on dates
        let status = 'open'
        const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        if (deadlineDate < now) status = 'closed'
        else if (deadlineDate <= sevenDays) status = 'closing_soon'

        const created = await db.scholarship.create({
          data: {
            title: s.title,
            description: s.description || `Scholarship for international students at ${s.university}`,
            university: s.university,
            country: s.country || 'Unknown',
            subject: s.subject,
            degree: s.degree || "Master's",
            amount: s.amount || 'Varies',
            applicationUrl: s.applicationUrl || '#',
            openDate,
            deadlineDate,
            status,
            isTextile: true,
            requirements: s.requirements || '',
            benefits: s.benefits || '',
          },
        })

        // Create notification for new scholarship
        await db.notification.create({
          data: {
            scholarshipId: created.id,
            type: 'new_scholarship',
            message: `🆕 New scholarship discovered: "${s.title}" at ${s.university}, ${s.country} | ${s.subject} | ${s.degree} | Deadline: ${deadlineDate.toLocaleDateString()}`,
            isRead: false,
          },
        })

        newScholarships.push(created)
        savedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${searchResults.length} results, extracted ${discoveredScholarships.length} scholarships, saved ${savedCount} new ones`,
      rawResults: searchResults.length,
      extracted: discoveredScholarships.length,
      discovered: savedCount,
      newScholarships: newScholarships.map(s => ({
        id: s.id,
        title: s.title,
        university: s.university,
        country: s.country,
        subject: s.subject,
        degree: s.degree,
        deadlineDate: s.deadlineDate,
        status: s.status,
      })),
    })
  } catch (error) {
    console.error('Discover error:', error)
    return NextResponse.json({ error: 'Failed to discover scholarships' }, { status: 500 })
  }
}
