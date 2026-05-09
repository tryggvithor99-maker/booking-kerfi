export type SessionType = 'RECORDING' | 'MIXING' | 'MASTERING' | 'OTHER'

export interface BookingData {
  id: string
  name: string
  phone: string
  sessionType: SessionType
  startTime: string
  endTime: string
  duration: number
  notes: string | null
  createdAt: string
}

export interface BlockedTimeData {
  id: string
  startTime: string
  endTime: string
  reason: string | null
  createdAt: string
}

export interface CreateBookingInput {
  name: string
  phone: string
  sessionType: SessionType
  date: string
  startHour: number
  duration: number
  notes?: string
}

export interface CreateBlockedTimeInput {
  date: string
  startHour: number
  endHour: number
  reason?: string
}
