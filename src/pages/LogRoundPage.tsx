import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGolfers } from '@/hooks/useGolfers'
import { useCourses } from '@/hooks/useCourses'
import { useCreateRound, useDeleteRound } from '@/hooks/useRounds'
import { RoundHeaderForm } from '@/components/rounds/RoundHeaderForm'
import { HoleScoreEntry } from '@/components/rounds/HoleScoreEntry'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import type { RoundHeaderFormValues, HoleScoreRowValues } from '@/schemas/round'
import type { Round } from '@/types/round'

function toHeaderValues(round: Round): Partial<RoundHeaderFormValues> {
  return {
    golfer_id: round.golfer_id,
    course_id: round.course_id,
    date_played: round.date_played,
    holes_played: round.holes_played as 9 | 18,
    total_strokes: round.total_strokes,
    score_vs_par: round.score_vs_par,
    total_putts: round.total_putts,
    greens_in_reg: round.greens_in_reg,
    notes: round.notes ?? '',
  }
}

function toHoleValues(round: Round): HoleScoreRowValues[] {
  return [...round.hole_scores]
    .sort((a, b) => a.hole_number - b.hole_number)
    .map((h) => ({
      par: h.par as 3 | 4 | 5,
      strokes: h.strokes,
      putts: h.putts ?? null,
      gir: h.gir ?? false,
      drive_result: h.drive_result ?? null,
    }))
}

export default function LogRoundPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const relogRound = (location.state as { relogRound?: Round } | null)?.relogRound

  const { data: golfers, isLoading: golfersLoading, isError: golfersError } = useGolfers()
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses()
  const createRound = useCreateRound()
  const deleteRound = useDeleteRound()

  const [step, setStep] = useState<1 | 2>(1)
  const [headerData, setHeaderData] = useState<RoundHeaderFormValues | null>(null)

  if (golfersLoading || coursesLoading) return <LoadingSpinner />
  if (golfersError || coursesError) return <ErrorMessage message="Failed to load golfers or courses." />

  function afterCreate() {
    if (relogRound) {
      deleteRound.mutate(relogRound.id, { onSuccess: () => navigate('/rounds') })
    } else {
      navigate('/rounds')
    }
  }

  function handleSaveOnly(values: RoundHeaderFormValues) {
    createRound.mutate(
      {
        ...values,
        total_putts: values.total_putts ?? null,
        greens_in_reg: values.greens_in_reg ?? null,
        notes: values.notes ?? null,
        holes: [],
      },
      { onSuccess: afterCreate },
    )
  }

  function handleContinue(values: RoundHeaderFormValues) {
    setHeaderData(values)
    setStep(2)
  }

  function handleHolesSubmit(
    holes: HoleScoreRowValues[],
    totalStrokes: number,
    scoreVsPar: number,
  ) {
    if (!headerData) return
    createRound.mutate(
      {
        ...headerData,
        total_strokes: totalStrokes,
        score_vs_par: scoreVsPar,
        total_putts: headerData.total_putts ?? null,
        greens_in_reg: headerData.greens_in_reg ?? null,
        notes: headerData.notes ?? null,
        holes: holes.map((h, i) => ({
          hole_number: i + 1,
          par: h.par,
          strokes: h.strokes,
          putts: h.putts ?? null,
          gir: h.gir ?? null,
          drive_result: h.drive_result ?? null,
        })),
      },
      { onSuccess: afterCreate },
    )
  }

  const initialHoles =
    relogRound?.hole_scores.length ? toHoleValues(relogRound) : undefined

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {relogRound ? 'Relog Round' : 'Log Round'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rounds cannot be edited — delete and re-log to correct.
        </p>
      </div>

      {relogRound && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <strong>Relogging</strong> — save to create a corrected copy and remove the original
          round from {relogRound.date_played}. If saving fails, your original data is preserved.
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className={step === 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
          1. Round Details
        </span>
        <span className="text-muted-foreground">→</span>
        <span className={step === 2 ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
          2. Hole Scores
        </span>
      </div>

      {step === 1 && (
        <RoundHeaderForm
          golfers={golfers ?? []}
          courses={courses ?? []}
          onSaveOnly={handleSaveOnly}
          onContinue={handleContinue}
          loading={createRound.isPending || deleteRound.isPending}
          initialValues={relogRound ? toHeaderValues(relogRound) : undefined}
        />
      )}

      {step === 2 && headerData && (
        <HoleScoreEntry
          holesPlayed={headerData.holes_played}
          onBack={() => setStep(1)}
          onSubmit={handleHolesSubmit}
          loading={createRound.isPending || deleteRound.isPending}
          initialHoles={initialHoles}
        />
      )}
    </div>
  )
}
