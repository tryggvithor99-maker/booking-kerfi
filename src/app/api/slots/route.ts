import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAvailableSlots } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')
  const durationStr = searchParams.get('duration') || '1'

  if (!dateStr) {
    return Response.json({ error: 'Dagsetning vantar' }, { status: 400 })
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return Response.json({ error: 'Ógild dagsetning' }, { status: 400 })
  }

  const duration = parseInt(durationStr)
  if (isNaN(duration) || duration < 1 || duration > 4) {
    return Response.json({ error: 'Lengd verður að vera 1-4 klukkutímar' }, { status: 400 })
  }

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: { startTime: { gte: dayStart, lte: dayEnd } },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedTime.findMany({
      where: { startTime: { gte: dayStart, lte: dayEnd } },
      select: { startTime: true, endTime: true },
    }),
  ])

  const occupied = [
    ...bookings.map((b) => ({ startTime: new Date(b.startTime), endTime: new Date(b.endTime) })),
    ...blocked.map((b) => ({ startTime: new Date(b.startTime), endTime: new Date(b.endTime) })),
  ]

  const slots = getAvailableSlots(date, occupied, duration)
  return Response.json(slots)
}
