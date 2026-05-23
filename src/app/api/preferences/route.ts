import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Delete existing preferences and create new one
    await db.userPreference.deleteMany()
    const preference = await db.userPreference.create({
      data: {
        preferredSubjects: body.preferredSubjects || '',
        preferredCountries: body.preferredCountries || '',
        notificationEnabled: body.notificationEnabled ?? true,
        emailNotifications: body.emailNotifications ?? true,
      },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error saving preferences:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const preference = await db.userPreference.findFirst()
    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}
