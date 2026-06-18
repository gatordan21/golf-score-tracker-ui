import { useState } from 'react'
import { useSummaryStats, useCourseStats } from '@/hooks/useStats'
import { DrivingChart } from '@/components/stats/DrivingChart'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatStat, formatScoreVsPar } from '@/lib/utils'
import type { CourseStats } from '@/types/stats'

type SortKey = keyof Pick<
  CourseStats,
  'course_name' | 'rounds_played' | 'best_score_vs_par' | 'avg_score_vs_par' | 'avg_strokes'
>
type SortDir = 'asc' | 'desc'

function SortableHead({
  label,
  field,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string
  field: SortKey
  sortKey: SortKey
  sortDir: SortDir
  onSort: (f: SortKey) => void
}) {
  const active = sortKey === field
  return (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      {label}
      {active && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </TableHead>
  )
}

function fmtAvg(v: number): string {
  if (v === 0) return 'E'
  return v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)
}

export default function StatsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('avg_score_vs_par')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useSummaryStats()
  const { data: courseStats, isLoading: courseLoading } = useCourseStats()

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedCourses = courseStats
    ? [...courseStats].sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp =
          typeof av === 'string'
            ? (av as string).localeCompare(bv as string)
            : (av as number) - (bv as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
    : []

  if (summaryError) return <ErrorMessage message="Failed to load stats." />

  if (summaryLoading || courseLoading) {
    return (
      <div className="space-y-10">
        <h1 className="text-2xl font-semibold">Stats Dashboard</h1>
        <section>
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-7 w-16" />
              </div>
            ))}
          </div>
        </section>
        <section>
          <Skeleton className="h-4 w-20 mb-3" />
          <div className="rounded-md border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  const noData = !summary || summary.rounds_played === 0

  const summaryTiles = summary
    ? [
        { label: 'Rounds Played', value: String(summary.rounds_played) },
        { label: 'Avg Strokes', value: formatStat(summary.avg_strokes?.toFixed(1)) },
        {
          label: 'Avg Score vs Par',
          value: summary.avg_score_vs_par != null
            ? fmtAvg(summary.avg_score_vs_par)
            : '—',
        },
        {
          label: 'Best Score',
          value: summary.best_score_vs_par != null
            ? formatScoreVsPar(summary.best_score_vs_par)
            : '—',
        },
        { label: 'Best Round Date', value: formatStat(summary.best_round_date) },
        { label: 'Avg Putts', value: formatStat(summary.avg_putts_per_round?.toFixed(1)) },
        { label: 'Avg GIR', value: formatStat(summary.avg_gir_per_round?.toFixed(1)) },
      ]
    : []

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Stats Dashboard</h1>

      {noData ? (
        <EmptyState
          message="No rounds logged yet — stats will appear once you log your first round."
          action={
            <Link to="/rounds/new" className={buttonVariants()}>
              Log a round
            </Link>
          }
        />
      ) : (
        <>
          {/* Summary tiles */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Summary
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {summaryTiles.map(({ label, value }) => (
                <div key={label} className="rounded-lg border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* By-course table */}
          {sortedCourses.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                By Course
              </h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHead label="Course" field="course_name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                      <SortableHead label="Rounds" field="rounds_played" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                      <SortableHead label="Avg Strokes" field="avg_strokes" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                      <SortableHead label="Avg Score vs Par" field="avg_score_vs_par" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                      <SortableHead label="Best Score" field="best_score_vs_par" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCourses.map((cs) => (
                      <TableRow key={cs.course_id}>
                        <TableCell className="font-medium">{cs.course_name}</TableCell>
                        <TableCell>{cs.rounds_played}</TableCell>
                        <TableCell>{cs.avg_strokes.toFixed(1)}</TableCell>
                        <TableCell>{fmtAvg(cs.avg_score_vs_par)}</TableCell>
                        <TableCell>{formatScoreVsPar(cs.best_score_vs_par)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          {/* Driving accuracy chart */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Driving Accuracy
            </h2>
            {summary?.driving ? (
              <div className="rounded-lg border bg-card p-4 max-w-lg">
                <DrivingChart driving={summary.driving} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No driving data yet — add hole scores with drive results to track accuracy.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
