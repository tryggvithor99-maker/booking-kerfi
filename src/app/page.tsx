'use client'

import { useState } from 'react'
import PublicCalendar from '@/components/PublicCalendar'
import TimeSlotPicker from '@/components/TimeSlotPicker'
import BookingForm from '@/components/BookingForm'
import { formatIcelandicDate } from '@/lib/utils'

type Step = 'calendar' | 'slots' | 'form'

export default function HomePage() {
  const [step, setStep] = useState<Step>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [duration, setDuration] = useState(1)

  function handleSelectDate(date: Date) {
    setSelectedDate(date)
    setSelectedHour(null)
    setStep('slots')
  }

  function handleSelectHour(hour: number) {
    setSelectedHour(hour)
    setStep('form')
  }

  function handleBackToCalendar() {
    setStep('calendar')
    setSelectedHour(null)
  }

  function handleBackToSlots() {
    setStep('slots')
    setSelectedHour(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎵</div>
          <h1 className="text-3xl font-bold text-gray-900">Stúdíó Booking</h1>
          <p className="text-gray-500 mt-2">Veldu dag og tíma sem hentar þér</p>
        </div>

        {step === 'calendar' && (
          <PublicCalendar
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate}
          />
        )}

        {step === 'slots' && selectedDate && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleBackToCalendar}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                ← Til baka
              </button>
              <span className="text-gray-500 text-sm">
                {formatIcelandicDate(selectedDate)}
              </span>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <TimeSlotPicker
                date={selectedDate}
                selectedHour={selectedHour}
                duration={duration}
                onSelectHour={handleSelectHour}
                onChangeDuration={(d) => {
                  setDuration(d)
                  setSelectedHour(null)
                }}
              />
            </div>
          </div>
        )}

        {step === 'form' && selectedDate && selectedHour !== null && (
          <BookingForm
            date={selectedDate}
            startHour={selectedHour}
            duration={duration}
            onBack={handleBackToSlots}
          />
        )}
      </div>
    </div>
  )
}
