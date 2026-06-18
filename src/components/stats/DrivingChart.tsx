import type { DrivingStats } from '@/types/stats'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const COLORS = ['#22c55e', '#ef4444', '#f97316', '#6366f1']

interface DrivingChartProps {
  driving: DrivingStats
}

interface DriveDataPoint {
  name: string
  count: number
  pct: number
}

export function DrivingChart({ driving }: DrivingChartProps) {
  const { total_drives, fairway_hit, missed_left, missed_right, missed_short } = driving

  if (total_drives === 0) {
    return <p className="text-sm text-muted-foreground">No driving data yet.</p>
  }

  const data: DriveDataPoint[] = [
    { name: 'Fairway', count: fairway_hit, pct: Math.round((fairway_hit / total_drives) * 100) },
    { name: 'Miss Left', count: missed_left, pct: Math.round((missed_left / total_drives) * 100) },
    { name: 'Miss Right', count: missed_right, pct: Math.round((missed_right / total_drives) * 100) },
    { name: 'Short', count: missed_short, pct: Math.round((missed_short / total_drives) * 100) },
  ]

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">{total_drives} drives tracked</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            formatter={(value, _name, props) => [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              `${value ?? 0}% (${(props as any).payload.count})`,
              'Drives',
            ]}
          />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
