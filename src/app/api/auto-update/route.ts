import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Auto-update scholarship statuses and generate notifications
export async function POST() {
  try {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const allScholarships = await db.scholarship.findMany()
    let updatedCount = 0
    let newNotifications = 0

    for (const scholarship of allScholarships) {
      const deadline = new Date(scholarship.deadlineDate)
      const openDate = new Date(scholarship.openDate)
      let newStatus = scholarship.status

      // Auto-determine status based on dates
      if (deadline < now) {
        newStatus = 'closed'
      } else if (deadline <= sevenDaysFromNow) {
        newStatus = 'closing_soon'
      } else if (openDate <= now && deadline > sevenDaysFromNow) {
        newStatus = 'open'
      } else if (openDate > now) {
        newStatus = 'open'
      }

      // Update status if changed
      if (newStatus !== scholarship.status) {
        await db.scholarship.update({
          where: { id: scholarship.id },
          data: { status: newStatus },
        })
        updatedCount++
      }

      // Create notifications for closing_soon scholarships
      if (newStatus === 'closing_soon') {
        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        const existingNotification = await db.notification.findFirst({
          where: {
            scholarshipId: scholarship.id,
            type: 'deadline_approaching',
          },
        })

        if (!existingNotification) {
          await db.notification.create({
            data: {
              scholarshipId: scholarship.id,
              type: 'deadline_approaching',
              message: `⚠️ "${scholarship.title}" at ${scholarship.university} - Only ${daysRemaining} days left! Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. Apply now!`,
              isRead: false,
            },
          })
          newNotifications++
        }
      }

      // Create notification for newly opened scholarships
      if (newStatus === 'open' && scholarship.status === 'closed') {
        const existingNotification = await db.notification.findFirst({
          where: {
            scholarshipId: scholarship.id,
            type: 'application_open',
          },
        })

        if (!existingNotification) {
          await db.notification.create({
            data: {
              scholarshipId: scholarship.id,
              type: 'application_open',
              message: `🆕 "${scholarship.title}" at ${scholarship.university} is now accepting applications! Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
              isRead: false,
            },
          })
          newNotifications++
        }
      }
    }

    // Clean up very old notifications (read, older than 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    await db.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: thirtyDaysAgo },
      },
    })

    const stats = {
      total: await db.scholarship.count(),
      open: await db.scholarship.count({ where: { status: 'open' } }),
      closingSoon: await db.scholarship.count({ where: { status: 'closing_soon' } }),
      closed: await db.scholarship.count({ where: { status: 'closed' } }),
      unreadNotifications: await db.notification.count({ where: { isRead: false } }),
    }

    return NextResponse.json({
      success: true,
      message: `Auto-update completed: ${updatedCount} scholarships updated, ${newNotifications} new notifications`,
      updatedCount,
      newNotifications,
      stats,
      lastUpdated: now.toISOString(),
    })
  } catch (error) {
    console.error('Auto-update error:', error)
    return NextResponse.json({ error: 'Auto-update failed' }, { status: 500 })
  }
}

// Get last update status
export async function GET() {
  try {
    const stats = {
      total: await db.scholarship.count(),
      open: await db.scholarship.count({ where: { status: 'open' } }),
      closingSoon: await db.scholarship.count({ where: { status: 'closing_soon' } }),
      closed: await db.scholarship.count({ where: { status: 'closed' } }),
      unreadNotifications: await db.notification.count({ where: { isRead: false } }),
    }

    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const needsUpdate = await db.scholarship.count({
      where: {
        OR: [
          { status: 'open', deadlineDate: { lt: now } },
          { status: 'open', deadlineDate: { lt: sevenDaysFromNow } },
          { status: 'closing_soon', deadlineDate: { lt: now } },
        ],
      },
    })

    return NextResponse.json({
      stats,
      needsUpdate,
      message: needsUpdate > 0 ? `${needsUpdate} scholarships need status update` : 'All scholarships are up to date',
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
