'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SESSION_TYPE_LABELS, formatIcelandicDate } from '@/lib/utils'
import type { SessionType } from '@/types'

interface Props {
  date: Date
  startHour: number
  duration: number
  onBack: () => void
}

const SESSION_TYPES: SessionType[] = ['RECORDING', 'MIXING', 'MASTERING', 'OTHER']

export default function BookingForm({ date, startHour, duration, onBack }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sessionType, setSessionType] = useState<SessionType>('RECORDING')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const endHour = startHour + duration

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError('Vinsamlegast fylltu út nafn og símanúmer.')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        sessionType,
        date: date.toISOString().split('T')[0],
        startHour,
        duration,
        notes,
      }),
    })

    if (res.ok) {
      const booking = await res.json()
      router.push(`/stadfesting?name=${encodeURIComponent(name)}&id=${booking.id}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Villa kom upp. Reyndu aftur.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
        <p className="text-sm text-indigo-600 font-medium">Valinn tími</p>
        <p className="text-lg font-semibold text-indigo-900">
          {formatIcelandicDate(date)}
        </p>
        <p className="text-indigo-700">
          {startHour.toString().padStart(2, '0')}:00 – {endHour.toString().padStart(2, '0')}:00
          <span className="ml-2 text-sm">({duration} {duration === 1 ? 'klukkutími' : 'klukkutímar'})</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nafn *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fullt nafn"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Símanúmer *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="000-0000"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tegund session *</label>
          <div className="grid grid-cols-2 gap-2">
            {SESSION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSessionType(type)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  sessionType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {SESSION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Athugasemdir <span className="text-gray-400 font-normal">(valkvæmt)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="T.d. hvaða tæki þú þarft, fjöldi músíkanta..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Til baka
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Bý til bókun...' : 'Bóka tíma'}
          </button>
        </div>
      </form>
    </div>
  )
}
