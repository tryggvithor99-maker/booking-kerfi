import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import LoginForm from './LoginForm'

export default async function AdminLoginPage() {
  const isAdmin = await isAdminAuthenticated()
  if (isAdmin) redirect('/admin/yfirlit')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900">Admin innskráning</h1>
          <p className="text-gray-500 mt-1 text-sm">Stúdíó stjórnborð</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
