import { NextResponse } from 'next/server'

function getTursoClient() {
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const databaseUrl = process.env.DATABASE_URL
  if (!authToken || !databaseUrl) throw new Error('Database not configured')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@libsql/client')
  return createClient({ url: databaseUrl, authToken })
}

export async function GET() {
  try {
    const client = getTursoClient()
    const result = await client.execute(`
      SELECT n.*, s.title as scholarshipTitle, s.university, s.country, s.subject, s.deadlineDate
      FROM Notification n
      LEFT JOIN Scholarship s ON n.scholarshipId = s.id
      ORDER BY n.createdAt DESC
    `)

    const unreadResult = await client.execute("SELECT COUNT(*) as count FROM Notification WHERE isRead = 0")

    const notifications = result.rows.map((row: any) => ({
      id: row.id,
      scholarshipId: row.scholarshipId,
      type: row.type,
      message: row.message,
      isRead: Number(row.isRead) === 1,
      createdAt: row.createdAt,
      scholarship: row.scholarshipTitle ? {
        id: row.scholarshipId,
        title: row.scholarshipTitle,
        university: row.university,
        country: row.country,
        subject: row.subject,
        deadlineDate: row.deadlineDate,
      } : null,
    }))

    const unreadCount = Number(unreadResult.rows[0]?.count || 0)
    client.close()

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json()
    const client = getTursoClient()
    await client.execute({ sql: "UPDATE Notification SET isRead = 1 WHERE id = ?", args: [id] })
    client.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const client = getTursoClient()
    await client.execute("UPDATE Notification SET isRead = 1 WHERE isRead = 0")
    client.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
