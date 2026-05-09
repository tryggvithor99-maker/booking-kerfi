'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatIcelandicDate, formatTime } from '@/lib/utils'
import type { BlockedTimeData } from '@/types'

interface Props {
  blocked: BlockedTimeData[]
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 10)

export default function BlockTimeClient({ blocked: initial }: Props) {
  const router = useRouter()
  const [blocked, setBlocked] = useState(initial)
  const [date, setDate] = useState('')
  const [startHour, setStartHour] = useState(10)
  const [endHour, setEndHour] = useState(11)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { setError('Veldu dag'); return }
    if (startHour >= endHour) { setError('Upphafstími verður að vera á undan lokatíma'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, startHour, endHour, reason }),
    })

    if (res.ok) {
      const newBlocked = await res.json()
      setBlocked((b) => [...b, newBlocked].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ))
      setDate('')
      setReason('')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Villa kom upp')
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Eyða lokuðum tíma?')) return
    await fetch(`/api/blocked/${id}`, { method: 'DELETE' })
    setBlocked((b) => b.filter((x) => x.id !== id))
    router.refresh()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Loka nýjum tíma</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dagur</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frá</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {HOURS.filter((h) => h < 22).map((h) => (
                  <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Til</label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {HOURS.filter((h) => h > startHour).map((h) => (
                  <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ástæða <span className="text-gray-400 font-normal">(valkvæmt)</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="T.d. Viðhald, einkaverkefni..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Vista...' : 'Loka tímanum'}
          </button>
        </form>
      </div>

      {blocked.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Lokaðir tímar</h2>
          <div className="space-y-2">
            {blocked.map((b) => (
              <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700 text-sm">
                    {formatIcelandicDate(new Date(b.startTime))}
                  </div>
                  <div className="text-sm text-red-600">
                    {formatTime(new Date(b.startTime))}–{formatTime(new Date(b.endTime))}
                    {b.reason && <span className="ml-2 text-gray-400">· {b.reason}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors ml-4"
                >
                  Eyða
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
