'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin/yfirlit', label: 'Yfirlit' },
  { href: '/admin/dagatal', label: 'Dagatal' },
  { href: '/admin/bokanir', label: 'Bókanir' },
  { href: '/admin/blokk', label: 'Loka tíma' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Útskrá
        </button>
      </div>
    </nav>
  )
}
