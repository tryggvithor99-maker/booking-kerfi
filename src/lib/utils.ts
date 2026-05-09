const OPEN_HOUR = 10
const CLOSE_HOUR = 22

export interface TimeSlot {
  hour: number
  label: string
  available: boolean
}

export interface OccupiedPeriod {
  startTime: Date
  endTime: Date
}

export function getAvailableSlots(
  date: Date,
  occupied: OccupiedPeriod[],
  durationHours: number = 1
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()

  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    if (hour + durationHours > CLOSE_HOUR) break

    const slotStart = new Date(date)
    slotStart.setHours(hour, 0, 0, 0)
    const slotEnd = new Date(date)
    slotEnd.setHours(hour + durationHours, 0, 0, 0)

    const isPast = slotStart <= now

    const overlaps = occupied.some(
      (o) => slotStart < o.endTime && slotEnd > o.startTime
    )

    slots.push({
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      available: !isPast && !overlaps,
    })
  }

  return slots
}

export function isSlotAvailable(
  date: Date,
  startHour: number,
  durationHours: number,
  occupied: OccupiedPeriod[]
): boolean {
  const now = new Date()
  const slotStart = new Date(date)
  slotStart.setHours(startHour, 0, 0, 0)
  const slotEnd = new Date(date)
  slotEnd.setHours(startHour + durationHours, 0, 0, 0)

  if (slotStart <= now) return false
  if (startHour < OPEN_HOUR || startHour + durationHours > CLOSE_HOUR) return false

  return !occupied.some(
    (o) => slotStart < o.endTime && slotEnd > o.startTime
  )
}

export function formatIcelandicDate(date: Date): string {
  return new Intl.DateTimeFormat('is-IS', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('is-IS', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const SESSION_TYPE_LABELS: Record<string, string> = {
  RECORDING: 'Upptaka',
  MIXING: 'Mixing',
  MASTERING: 'Mastering',
  OTHER: 'Annað',
}

export const DURATION_OPTIONS = [1, 2, 3, 4] as const
export type DurationHours = typeof DURATION_OPTIONS[number]
