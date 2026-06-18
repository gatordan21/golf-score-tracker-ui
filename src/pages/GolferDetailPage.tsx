import { useParams, Link } from 'react-router-dom'
import { useGolfer, useGolferStats, useGolferRounds } from '@/hooks/useGolfers'
import { DrivingChart } from '@/components/stats/DrivingChart'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { EmptyState } from '@/components/shared/EmptyState'
import { buttonVariants } from '@/components/ui/button'
import { formatStat, formatScoreVsPar, cn } from '@/lib/utils'

export default function GolferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const golferId = Number(id)

  const { data: golfer, isLoading, isError } = useGolfer(golferId)
  const { data: stats } = useGolferStats(golferId)
  const { data: rounds } = useGolferRounds(golferId)

  if (isLoading) return <LoadingSpinner />
  if (isError || !golfer) return <ErrorMessage message="Golfer not found." />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{golfer.name}</h1>
          <p className="text-muted-foreground">
            @{golfer.username} · {golfer.state}
            {golfer.handicap != null && ` · HCP ${golfer.handicap}`}
          </p>
        </div>
        <Link to="/golfers" className={buttonVariants({ variant: 'outline' })}>
          ← Back
        </Link>
      </div>

      {/* Stats tiles */}
      {stats && stats.rounds_played > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Rounds', value: formatStat(stats.rounds_played) },
              { label: 'Avg Strokes', value: formatStat(stats.avg_strokes?.toFixed(1)) },
              { label: 'Avg Score vs Par', value: formatStat(stats.avg_score_vs_par?.toFixed(1)) },
              { label: 'Best Score', value: formatScoreVsPar(stats.best_score_vs_par) },
              { label: 'Best Round Date', value: formatStat(stats.best_round_date) },
              { label: 'Avg Putts', value: formatStat(stats.avg_putts_per_round?.toFixed(1)) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border bg-card p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {stats.driving && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Driving Accuracy
              </h3>
              <div className="rounded-lg border bg-card p-4 max-w-lg">
                <DrivingChart driving={stats.driving} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Round history */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Round History
        </h2>
        {!rounds?.length ? (
          <EmptyState
            message="No rounds logged yet."
            action={
              <Link to="/rounds/new" className={buttonVariants()}>Log a round</Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {rounds.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{r.date_played}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.holes_played} holes · {r.total_strokes} strokes
                  </p>
                </div>
                <span
                  className={cn(
                    'text-lg font-semibold',
                    r.score_vs_par < 0 && 'text-green-600',
                    r.score_vs_par > 0 && 'text-red-600',
                  )}
                >
                  {formatScoreVsPar(r.score_vs_par)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
