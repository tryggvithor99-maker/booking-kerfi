import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const TOKEN_VALUE = process.env.ADMIN_TOKEN_SECRET || 'booking-studio-secret-token'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)
  return token?.value === TOKEN_VALUE
}

export function getAdminCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: TOKEN_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24,
    path: '/',
  }
}

export function getLogoutCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}
