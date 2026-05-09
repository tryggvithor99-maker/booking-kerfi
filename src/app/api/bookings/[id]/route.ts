import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

  const { id } = await params
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return Response.json({ error: 'Bókun fannst ekki' }, { status: 404 })

  return Response.json(booking)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return Response.json({ error: 'Bókun fannst ekki' }, { status: 404 })

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      name: body.name ?? booking.name,
      phone: body.phone ?? booking.phone,
      sessionType: body.sessionType ?? booking.sessionType,
      notes: body.notes !== undefined ? body.notes : booking.notes,
    },
  })

  return Response.json(updated)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return Response.json({ error: 'Ekki heimilt' }, { status: 401 })

  const { id } = await params
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return Response.json({ error: 'Bókun fannst ekki' }, { status: 404 })

  await prisma.booking.delete({ where: { id } })
  return Response.json({ success: true })
}
