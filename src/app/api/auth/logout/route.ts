import { cookies } from 'next/headers'
import { getLogoutCookieOptions } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  const opts = getLogoutCookieOptions()
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    maxAge: opts.maxAge,
    path: opts.path,
  })
  return Response.json({ success: true })
}
