import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/api/stats'
import { Badge } from '@/components/ui/badge'
import { formatStat, formatScoreVsPar } from '@/lib/utils'
import type { SummaryStats } from '@/types/stats'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SummaryGrid({ stats }: { stats: SummaryStats }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatTile label="Rounds Played" value={String(stats.rounds_played)} />
      <StatTile label="Avg Strokes" value={formatStat(stats.avg_strokes)} />
      <StatTile label="Avg Score vs Par" value={formatScoreVsPar(stats.avg_score_vs_par)} />
      <StatTile label="Best Score vs Par" value={formatScoreVsPar(stats.best_score_vs_par)} />
      <StatTile label="Best Round Date" value={formatStat(stats.best_round_date)} />
      <StatTile label="Avg Putts / Round" value={formatStat(stats.avg_putts_per_round)} />
    </div>
  )
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: statsApi.getSummary,
    retry: false,
  })

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Golf Tracker</h1>
        {isLoading && (
          <Badge variant="secondary">Connecting…</Badge>
        )}
        {!isLoading && isError && (
          <Badge variant="destructive">API offline</Badge>
        )}
        {!isLoading && !isError && (
          <Badge variant="default">Connected</Badge>
        )}
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        A personal golf stats tracker backed by FastAPI.
      </p>

      {data && data.rounds_played === 0 && (
        <p className="mt-6 text-muted-foreground">
          No rounds logged yet. Head to <strong>Rounds</strong> to log your first round.
        </p>
      )}

      {data && data.rounds_played > 0 && <SummaryGrid stats={data} />}
    </div>
  )
}
