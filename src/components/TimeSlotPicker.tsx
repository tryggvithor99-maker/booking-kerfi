'use client'

import { useEffect, useState } from 'react'
import type { TimeSlot } from '@/lib/utils'
import { DURATION_OPTIONS } from '@/lib/utils'

interface Props {
  date: Date
  selectedHour: number | null
  duration: number
  onSelectHour: (hour: number) => void
  onChangeDuration: (duration: number) => void
}

export default function TimeSlotPicker({
  date,
  selectedHour,
  duration,
  onSelectHour,
  onChangeDuration,
}: Props) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const dateStr = date.toISOString().split('T')[0]
    fetch(`/api/slots?date=${dateStr}&duration=${duration}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [date, duration])

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Lengd bókunar</label>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((h) => (
            <button
              key={h}
              onClick={() => onChangeDuration(h)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                duration === h
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {h}t
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">Veldu tíma</label>
      {loading ? (
        <div className="text-gray-400 text-sm py-4">Hleður tíma...</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.hour}
              onClick={() => slot.available && onSelectHour(slot.hour)}
              disabled={!slot.available}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                !slot.available
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : selectedHour === slot.hour
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {slot.label}
            </button>
          ))}
          {slots.length === 0 && (
            <div className="col-span-3 text-gray-400 text-sm py-4">
              Engir lausir tímar þennan dag.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
