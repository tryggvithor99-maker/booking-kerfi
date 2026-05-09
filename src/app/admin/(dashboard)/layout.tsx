import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import AdminNav from '../AdminNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
