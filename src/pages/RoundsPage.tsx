import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRounds, useDeleteRound } from '@/hooks/useRounds'
import { useGolfers } from '@/hooks/useGolfers'
import { useCourses } from '@/hooks/useCourses'
import type { RoundFilters } from '@/api/rounds'
import type { Round } from '@/types/round'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatScoreVsPar, formatStat } from '@/lib/utils'

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        score < 0 && 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
        score > 0 && 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
        score === 0 && 'bg-muted text-muted-foreground',
      )}
    >
      {formatScoreVsPar(score)}
    </span>
  )
}

function Scorecard({ round }: { round: Round }) {
  if (!round.hole_scores.length) {
    return <p className="text-sm text-muted-foreground px-4 pb-3">No hole scores recorded.</p>
  }

  const sorted = [...round.hole_scores].sort((a, b) => a.hole_number - b.hole_number)

  return (
    <div className="px-4 pb-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-2 py-1 text-left font-medium text-muted-foreground">Hole</th>
              <th className="px-2 py-1 text-center font-medium text-muted-foreground">Par</th>
              <th className="px-2 py-1 text-center font-medium text-muted-foreground">Strokes</th>
              <th className="px-2 py-1 text-center font-medium text-muted-foreground">Putts</th>
              <th className="px-2 py-1 text-center font-medium text-muted-foreground">GIR</th>
              <th className="px-2 py-1 text-center font-medium text-muted-foreground">Drive</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => {
              const diff = h.strokes - h.par
              return (
                <tr key={h.hole_number} className="border-t">
                  <td className="px-2 py-1 font-medium">{h.hole_number}</td>
                  <td className="px-2 py-1 text-center">{h.par}</td>
                  <td
                    className={cn(
                      'px-2 py-1 text-center font-semibold',
                      diff < 0 && 'text-green-600',
                      diff > 0 && 'text-red-600',
                    )}
                  >
                    {h.strokes}
                  </td>
                  <td className="px-2 py-1 text-center">{formatStat(h.putts)}</td>
                  <td className="px-2 py-1 text-center">
                    {h.gir == null ? '—' : h.gir ? '✓' : '✗'}
                  </td>
                  <td className="px-2 py-1 text-center capitalize">
                    {h.drive_result ? h.drive_result.replace(/_/g, ' ') : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RoundsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Golfer</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Holes</TableHead>
            <TableHead>Strokes</TableHead>
            <TableHead>Score</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-10" /></TableCell>
              <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-7 w-16 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function RoundsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<RoundFilters>({})
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Round | null>(null)

  const { data: rounds, isLoading, isError } = useRounds(filters)
  const { data: golfers } = useGolfers()
  const { data: courses } = useCourses()
  const deleteRound = useDeleteRound()

  function handleDelete() {
    if (!deleteTarget) return
    deleteRound.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  function golferName(id: number) {
    return golfers?.find((g) => g.id === id)?.name ?? `Golfer #${id}`
  }

  function courseName(id: number) {
    return courses?.find((c) => c.id === id)?.name ?? `Course #${id}`
  }

  if (isError) return <ErrorMessage message="Failed to load rounds." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rounds</h1>
        <Link to="/rounds/new" className={buttonVariants()}>
          Log Round
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-end rounded-lg border bg-card p-4">
        <div className="space-y-1 min-w-[160px]">
          <Label htmlFor="filter-golfer" className="text-xs">Golfer</Label>
          <Select
            value={filters.golfer_id ? String(filters.golfer_id) : ''}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, golfer_id: v ? Number(v) : undefined }))
            }
          >
            <SelectTrigger id="filter-golfer" className="w-full h-8 text-sm">
              <SelectValue placeholder="All golfers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All golfers</SelectItem>
              {golfers?.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-[160px]">
          <Label htmlFor="filter-course" className="text-xs">Course</Label>
          <Select
            value={filters.course_id ? String(filters.course_id) : ''}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, course_id: v ? Number(v) : undefined }))
            }
          >
            <SelectTrigger id="filter-course" className="w-full h-8 text-sm">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All courses</SelectItem>
              {courses?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-date" className="text-xs">Date</Label>
          <Input
            id="filter-date"
            type="date"
            className="h-8 text-sm w-36"
            value={filters.from_date ?? ''}
            onChange={(e) => {
              const d = e.target.value || undefined
              setFilters((f) => ({ ...f, from_date: d, to_date: d }))
            }}
          />
        </div>

        {Object.values(filters).some(Boolean) && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setFilters({})}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <RoundsTableSkeleton />
      ) : !rounds?.length ? (
        <EmptyState
          message="No rounds found."
          action={
            <Link to="/rounds/new" className={buttonVariants()}>
              Log your first round
            </Link>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Golfer</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Holes</TableHead>
                <TableHead>Strokes</TableHead>
                <TableHead>Score</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rounds.map((r) => (
                <>
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell
                      className="font-medium"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    >
                      {r.date_played}
                    </TableCell>
                    <TableCell onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {golferName(r.golfer_id)}
                    </TableCell>
                    <TableCell onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {courseName(r.course_id)}
                    </TableCell>
                    <TableCell onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {r.holes_played}
                    </TableCell>
                    <TableCell onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {r.total_strokes}
                    </TableCell>
                    <TableCell onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      <ScoreBadge score={r.score_vs_par} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Relog round from ${r.date_played}`}
                        onClick={() =>
                          navigate('/rounds/new', { state: { relogRound: r } })
                        }
                      >
                        Relog
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        aria-label={`Delete round from ${r.date_played}`}
                        onClick={() => setDeleteTarget(r)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedId === r.id && (
                    <TableRow key={`${r.id}-scorecard`}>
                      <TableCell colSpan={7} className="p-0 bg-muted/30">
                        <Scorecard round={r} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Round"
        message={`Delete round from ${deleteTarget?.date_played}? This will also delete all hole scores.`}
        onConfirm={handleDelete}
        loading={deleteRound.isPending}
      />
    </div>
  )
}
