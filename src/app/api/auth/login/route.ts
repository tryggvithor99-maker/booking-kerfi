import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getAdminCookieOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  const correct = password === process.env.ADMIN_PASSWORD

  if (!correct) {
    return Response.json({ error: 'Rangt lykilorð' }, { status: 401 })
  }

  const cookieStore = await cookies()
  const opts = getAdminCookieOptions()
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    maxAge: opts.maxAge,
    path: opts.path,
  })

  return Response.json({ success: true })
}
