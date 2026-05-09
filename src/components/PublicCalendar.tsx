'use client'

import { useState } from 'react'
import { getDaysInMonth, isSameDay } from '@/lib/utils'

interface Props {
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

const WEEKDAYS = ['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun']
const MONTHS = [
  'Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní',
  'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember',
]

export default function PublicCalendar({ onSelectDate, selectedDate }: Props) {
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

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
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
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, today)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isPast && onSelectDate(day)}
              disabled={isPast}
              className={`
                aspect-square rounded-xl text-sm font-medium transition-all
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 cursor-pointer'}
                ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-indigo-300 text-indigo-600' : ''}
                ${!isPast && !isSelected ? 'text-gray-700' : ''}
              `}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
