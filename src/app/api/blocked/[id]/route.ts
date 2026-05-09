import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

  const { id } = await params
  const blocked = await prisma.blockedTime.findUnique({ where: { id } })
  if (!blocked) return Response.json({ error: 'Lokaður tími fannst ekki' }, { status: 404 })

  await prisma.blockedTime.delete({ where: { id } })
  return Response.json({ success: true })
}
