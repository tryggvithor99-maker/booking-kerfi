import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'
import { isSlotAvailable } from '@/lib/utils'
import type { CreateBookingInput } from '@/types'

export async function GET(request: NextRequest) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) {
    return Response.json({ error: 'Ekki heimilt' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const monthStr = searchParams.get('month')
  const yearStr = searchParams.get('year')

  let where = {}
  if (monthStr && yearStr) {
    const month = parseInt(monthStr)
    const year = parseInt(yearStr)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)
    where = { startTime: { gte: start, lte: end } }
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startTime: 'asc' },
  })

  return Response.json(bookings)
}

export async function POST(request: NextRequest) {
  const body: CreateBookingInput = await request.json()
  const { name, phone, sessionType, date, startHour, duration, notes } = body

  if (!name || !phone || !sessionType || !date || startHour === undefined || !duration) {
    return Response.json({ error: 'Vantar upplýsingar' }, { status: 400 })
  }

  if (!['RECORDING', 'MIXING', 'MASTERING', 'OTHER'].includes(sessionType)) {
    return Response.json({ error: 'Ógild tegund session' }, { status: 400 })
  }

  if (duration < 1 || duration > 4) {
    return Response.json({ error: 'Lengd verður að vera 1-4 klukkutímar' }, { status: 400 })
  }

  const bookingDate = new Date(date)
  if (isNaN(bookingDate.getTime())) {
    return Response.json({ error: 'Ógild dagsetning' }, { status: 400 })
  }

  const dayStart = new Date(bookingDate)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(bookingDate)
  dayEnd.setHours(23, 59, 59, 999)

  const [existingBookings, blocked] = await Promise.all([
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
    ...existingBookings.map((b) => ({ startTime: new Date(b.startTime), endTime: new Date(b.endTime) })),
    ...blocked.map((b) => ({ startTime: new Date(b.startTime), endTime: new Date(b.endTime) })),
  ]

  const available = isSlotAvailable(bookingDate, startHour, duration, occupied)
  if (!available) {
    return Response.json({ error: 'Þessi tími er ekki laus' }, { status: 409 })
  }

  const startTime = new Date(bookingDate)
  startTime.setHours(startHour, 0, 0, 0)
  const endTime = new Date(bookingDate)
  endTime.setHours(startHour + duration, 0, 0, 0)

  const booking = await prisma.booking.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      sessionType,
      startTime,
      endTime,
      duration,
      notes: notes?.trim() || null,
    },
  })

  return Response.json(booking, { status: 201 })
}
