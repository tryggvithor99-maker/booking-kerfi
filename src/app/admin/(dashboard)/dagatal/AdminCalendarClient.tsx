'use client'

import { useState } from 'react'
import AdminCalendar from '@/components/AdminCalendar'
import type { BookingData, BlockedTimeData } from '@/types'

interface Props {
  bookings: BookingData[]
  blocked: BlockedTimeData[]
}

export default function AdminCalendarClient({ bookings, blocked }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <AdminCalendar
      bookings={bookings}
      blocked={blocked}
      selectedDate={selectedDate}
      onSelectDay={setSelectedDate}
    />
  )
}
