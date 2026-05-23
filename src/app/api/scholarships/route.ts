import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const country = searchParams.get('country') || ''
    const subject = searchParams.get('subject') || ''
    const degree = searchParams.get('degree') || ''
    const status = searchParams.get('status') || ''
    const isTextile = searchParams.get('isTextile')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { university: { contains: search } },
        { subject: { contains: search } },
      ]
    }

    if (country) {
      where.country = { contains: country }
    }

    if (subject) {
      where.subject = { contains: subject }
    }

    if (degree) {
      where.degree = degree
    }

    if (status) {
      where.status = status
    }

    if (isTextile === 'true') {
      where.isTextile = true
    }

    const [scholarships, total] = await Promise.all([
      db.scholarship.findMany({
        where,
        orderBy: { deadlineDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.scholarship.count({ where }),
    ])

    // Get stats
    const stats = {
      total: await db.scholarship.count(),
      open: await db.scholarship.count({ where: { status: 'open' } }),
      closingSoon: await db.scholarship.count({ where: { status: 'closing_soon' } }),
      closed: await db.scholarship.count({ where: { status: 'closed' } }),
      textile: await db.scholarship.count({ where: { isTextile: true } }),
      countries: (await db.scholarship.findMany({ select: { country: true }, distinct: ['country'] })).map(s => s.country),
      subjects: (await db.scholarship.findMany({ select: { subject: true }, distinct: ['subject'] })).map(s => s.subject),
      degrees: (await db.scholarship.findMany({ select: { degree: true }, distinct: ['degree'] })).map(s => s.degree),
    }

    return NextResponse.json({
      scholarships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const scholarship = await db.scholarship.create({ data: body })
    return NextResponse.json(scholarship, { status: 201 })
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json({ error: 'Failed to create scholarship' }, { status: 500 })
  }
}
