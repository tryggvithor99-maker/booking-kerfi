import { prisma } from '@/lib/prisma'
import BookingListClient from './BookingListClient'

export const dynamic = 'force-dynamic'

export default async function BokanirPage() {
  const now = new Date()
  const bookings = await prisma.booking.findMany({
    where: { startTime: { gte: now } },
    orderBy: { startTime: 'asc' },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Komandi bókanir</h1>
      <BookingListClient bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  )
}
