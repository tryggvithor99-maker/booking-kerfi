import { prisma } from '@/lib/prisma'
import BlockTimeClient from './BlockTimeClient'

export const dynamic = 'force-dynamic'

export default async function BlokkPage() {
  const now = new Date()
  const blocked = await prisma.blockedTime.findMany({
    where: { startTime: { gte: now } },
    orderBy: { startTime: 'asc' },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Loka tíma</h1>
      <BlockTimeClient blocked={JSON.parse(JSON.stringify(blocked))} />
    </div>
  )
}
