import { NextResponse } from 'next/server'

function getTursoClient() {
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const databaseUrl = process.env.DATABASE_URL
  if (!authToken || !databaseUrl) throw new Error('Database not configured')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@libsql/client')
  return createClient({ url: databaseUrl, authToken })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = getTursoClient()
    await client.execute('DELETE FROM UserPreference')
    const id = 'pref_' + Date.now()
    await client.execute({
      sql: "INSERT INTO UserPreference (id, preferredSubjects, preferredCountries, notificationEnabled, emailNotifications) VALUES (?, ?, ?, ?, ?)",
      args: [id, body.preferredSubjects || '', body.preferredCountries || '', body.notificationEnabled !== false ? 1 : 0, body.emailNotifications !== false ? 1 : 0]
    })
    client.close()
    return NextResponse.json({ id, ...body })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = getTursoClient()
    const result = await client.execute('SELECT * FROM UserPreference LIMIT 1')
    client.close()
    if (result.rows.length > 0) {
      const row = result.rows[0] as any
      return NextResponse.json({ id: row.id, preferredSubjects: row.preferredSubjects, preferredCountries: row.preferredCountries, notificationEnabled: Number(row.notificationEnabled) === 1, emailNotifications: Number(row.emailNotifications) === 1 })
    }
    return NextResponse.json(null)
  } catch (error) {
    return NextResponse.json(null)
  }
}
