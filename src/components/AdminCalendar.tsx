'use client'

import { useState } from 'react'
import { getDaysInMonth, isSameDay, SESSION_TYPE_LABELS, formatTime } from '@/lib/utils'
import type { BookingData, BlockedTimeData } from '@/types'

interface Props {
  bookings: BookingData[]
  blocked: BlockedTimeData[]
  onSelectDay: (date: Date) => void
  selectedDate: Date | null
}

const MONTHS = [
  'Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní',
  'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember',
]
const WEEKDAYS = ['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun']

export default function AdminCalendar({ bookings, blocked, onSelectDay, selectedDate }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const days = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function getBookingsForDay(day: Date) {
    return bookings.filter((b) => isSameDay(new Date(b.startTime), day))
  }

  function getBlockedForDay(day: Date) {
    return blocked.filter((b) => isSameDay(new Date(b.startTime), day))
  }

  const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : []
  const selectedDayBlocked = selectedDate ? getBlockedForDay(selectedDate) : []

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day)
            const dayBlocked = getBlockedForDay(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)
            const hasEvents = dayBookings.length > 0 || dayBlocked.length > 0

            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDay(day)}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all relative
                  ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-gray-700'}
                  ${isToday && !isSelected ? 'ring-2 ring-indigo-300 text-indigo-600' : ''}
                `}
              >
                {day.getDate()}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
                {hasEvents && isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {selectedDate.toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>

          {selectedDayBlocked.map((b) => (
            <div key={b.id} className="mb-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <div className="text-sm font-medium text-red-700">
                Lokaður {formatTime(new Date(b.startTime))}–{formatTime(new Date(b.endTime))}
              </div>
              {b.reason && <div className="text-xs text-red-500">{b.reason}</div>}
            </div>
          ))}

          {selectedDayBookings.map((b) => (
            <div key={b.id} className="mb-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-medium text-indigo-900">{b.name}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {SESSION_TYPE_LABELS[b.sessionType]}
                </span>
              </div>
              <div className="text-sm text-indigo-700">
                {formatTime(new Date(b.startTime))}–{formatTime(new Date(b.endTime))} · {b.phone}
              </div>
            </div>
          ))}

          {selectedDayBookings.length === 0 && selectedDayBlocked.length === 0 && (
            <p className="text-gray-400 text-sm">Engar bókanir þennan dag.</p>
          )}
        </div>
      )}
    </div>
  )
}
