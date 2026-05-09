import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

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

  const blocked = await prisma.blockedTime.findMany({
    where,
    orderBy: { startTime: 'asc' },
  })

  return Response.json(blocked)
}

export async function POST(request: NextRequest) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

  const body = await request.json()
  const { date, startHour, endHour, reason } = body

  if (!date || startHour === undefined || endHour === undefined) {
    return Response.json({ error: 'Vantar upplýsingar' }, { status: 400 })
  }

  if (startHour >= endHour) {
    return Response.json({ error: 'Upphafstími verður að vera á undan lokatíma' }, { status: 400 })
  }

  const blockDate = new Date(date)
  const startTime = new Date(blockDate)
  startTime.setHours(startHour, 0, 0, 0)
  const endTime = new Date(blockDate)
  endTime.setHours(endHour, 0, 0, 0)

  const blocked = await prisma.blockedTime.create({
    data: {
      startTime,
      endTime,
      reason: reason?.trim() || null,
    },
  })

  return Response.json(blocked, { status: 201 })
}
