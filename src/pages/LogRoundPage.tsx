import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGolfers } from '@/hooks/useGolfers'
import { useCourses } from '@/hooks/useCourses'
import { useCreateRound } from '@/hooks/useRounds'
import { RoundHeaderForm } from '@/components/rounds/RoundHeaderForm'
import { HoleScoreEntry } from '@/components/rounds/HoleScoreEntry'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import type { RoundHeaderFormValues, HoleScoreRowValues } from '@/schemas/round'

export default function LogRoundPage() {
  const navigate = useNavigate()
  const { data: golfers, isLoading: golfersLoading, isError: golfersError } = useGolfers()
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses()
  const createRound = useCreateRound()

  const [step, setStep] = useState<1 | 2>(1)
  const [headerData, setHeaderData] = useState<RoundHeaderFormValues | null>(null)

  if (golfersLoading || coursesLoading) return <LoadingSpinner />
  if (golfersError || coursesError) return <ErrorMessage message="Failed to load golfers or courses." />

  function handleSaveOnly(values: RoundHeaderFormValues) {
    createRound.mutate(
      {
        ...values,
        total_putts: values.total_putts ?? null,
        greens_in_reg: values.greens_in_reg ?? null,
        notes: values.notes ?? null,
        holes: [],
      },
      { onSuccess: () => navigate('/rounds') },
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
      { onSuccess: () => navigate('/rounds') },
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Log Round</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rounds cannot be edited — delete and re-log to correct.
        </p>
      </div>

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
          loading={createRound.isPending}
        />
      )}

      {step === 2 && headerData && (
        <HoleScoreEntry
          holesPlayed={headerData.holes_played}
          onBack={() => setStep(1)}
          onSubmit={handleHolesSubmit}
          loading={createRound.isPending}
        />
      )}
    </div>
  )
}
