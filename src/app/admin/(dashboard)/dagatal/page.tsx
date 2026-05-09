import { prisma } from '@/lib/prisma'
import AdminCalendarClient from './AdminCalendarClient'

export const dynamic = 'force-dynamic'

export default async function DagatalPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59)

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: { startTime: { gte: monthStart, lte: monthEnd } },
      orderBy: { startTime: 'asc' },
    }),
    prisma.blockedTime.findMany({
      where: { startTime: { gte: monthStart, lte: monthEnd } },
      orderBy: { startTime: 'asc' },
    }),
  ])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dagatal</h1>
      <AdminCalendarClient
        bookings={JSON.parse(JSON.stringify(bookings))}
        blocked={JSON.parse(JSON.stringify(blocked))}
      />
    </div>
  )
}
