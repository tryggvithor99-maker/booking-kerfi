interface Props {
  bookingsThisMonth: number
  totalHoursThisMonth: number
  upcomingBookings: number
  mostPopularType: string
}

export default function StatsPanel({
  bookingsThisMonth,
  totalHoursThisMonth,
  upcomingBookings,
  mostPopularType,
}: Props) {
  const stats = [
    { label: 'Bókanir í mánuðinum', value: bookingsThisMonth, icon: '📅' },
    { label: 'Heildartímar', value: `${totalHoursThisMonth}t`, icon: '⏱️' },
    { label: 'Komandi bókanir', value: upcomingBookings, icon: '🎯' },
    { label: 'Vinsælasta tegund', value: mostPopularType, icon: '🎵' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
