import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      include: { scholarship: true },
      orderBy: { createdAt: 'desc' },
    })

    const unreadCount = await db.notification.count({
      where: { isRead: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json()
    await db.notification.update({
      where: { id },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await db.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications:', error)
    return NextResponse.json({ error: 'Failed to mark all notifications' }, { status: 500 })
  }
}
