import { prisma } from '@/lib/prisma'
import StatsPanel from '@/components/StatsPanel'
import { SESSION_TYPE_LABELS, formatIcelandicDate, formatTime } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function YfirlitPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const [monthBookings, upcomingBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { startTime: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.booking.findMany({
      where: { startTime: { gte: now } },
      orderBy: { startTime: 'asc' },
      take: 5,
    }),
  ])

  const totalHours = monthBookings.reduce((sum, b) => sum + b.duration, 0)

  const typeCounts = monthBookings.reduce((acc, b) => {
    acc[b.sessionType] = (acc[b.sessionType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostPopular = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]
  const mostPopularLabel = mostPopular
    ? SESSION_TYPE_LABELS[mostPopular[0]] || mostPopular[0]
    : 'Engar'

  const allUpcoming = await prisma.booking.count({
    where: { startTime: { gte: now } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Yfirlit</h1>

      <StatsPanel
        bookingsThisMonth={monthBookings.length}
        totalHoursThisMonth={totalHours}
        upcomingBookings={allUpcoming}
        mostPopularType={mostPopularLabel}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Næstu bókanir</h2>
          <Link href="/admin/bokanir" className="text-sm text-indigo-600 hover:underline">
            Sjá allar →
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400">
            Engar komandi bókanir
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{b.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatIcelandicDate(new Date(b.startTime))} ·{' '}
                    {formatTime(new Date(b.startTime))}–{formatTime(new Date(b.endTime))}
                  </div>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {SESSION_TYPE_LABELS[b.sessionType]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
