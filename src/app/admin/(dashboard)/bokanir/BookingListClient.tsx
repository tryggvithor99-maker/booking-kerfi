'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SESSION_TYPE_LABELS, formatIcelandicDate, formatTime } from '@/lib/utils'
import type { BookingData, SessionType } from '@/types'

interface Props {
  bookings: BookingData[]
}

export default function BookingListClient({ bookings: initial }: Props) {
  const router = useRouter()
  const [bookings, setBookings] = useState(initial)
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<BookingData>>({})
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Ertu viss um að þú viljir eyða þessari bókun?')) return
    setDeleting(id)
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    setBookings((b) => b.filter((x) => x.id !== id))
    setDeleting(null)
    router.refresh()
  }

  async function handleSave(id: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    if (res.ok) {
      const updated = await res.json()
      setBookings((b) => b.map((x) => (x.id === id ? { ...x, ...updated } : x)))
      setEditing(null)
      setEditData({})
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
        Engar komandi bókanir
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="bg-white rounded-xl shadow-sm p-4">
          {editing === b.id ? (
            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                value={editData.name ?? b.name}
                onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                placeholder="Nafn"
              />
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                value={editData.phone ?? b.phone}
                onChange={(e) => setEditData((d) => ({ ...d, phone: e.target.value }))}
                placeholder="Símanúmer"
              />
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                value={(editData.sessionType ?? b.sessionType) as string}
                onChange={(e) => setEditData((d) => ({ ...d, sessionType: e.target.value as SessionType }))}
              >
                {Object.entries(SESSION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                value={editData.notes ?? b.notes ?? ''}
                onChange={(e) => setEditData((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Athugasemdir"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(b.id)}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
                >
                  Vista
                </button>
                <button
                  onClick={() => { setEditing(null); setEditData({}) }}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm"
                >
                  Hætta við
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{b.name}</div>
                  <div className="text-sm text-gray-500">{b.phone}</div>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {SESSION_TYPE_LABELS[b.sessionType]}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {formatIcelandicDate(new Date(b.startTime))}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {formatTime(new Date(b.startTime))}–{formatTime(new Date(b.endTime))}
                <span className="ml-2 text-gray-400">({b.duration}t)</span>
              </div>
              {b.notes && (
                <div className="text-sm text-gray-500 italic mb-3">{b.notes}</div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(b.id); setEditData({}) }}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                >
                  Breyta
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deleting === b.id}
                  className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === b.id ? 'Eyði...' : 'Eyða'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
