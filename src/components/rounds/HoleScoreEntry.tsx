import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { holeScoresSchema, type HoleScoresFormValues, type HoleScoreRowValues } from '@/schemas/round'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface HoleScoreEntryProps {
  holesPlayed: 9 | 18
  onBack: () => void
  onSubmit: (holes: HoleScoreRowValues[], totalStrokes: number, scoreVsPar: number) => void
  loading?: boolean
}

function makeDefaultHoles(count: number): HoleScoreRowValues[] {
  return Array.from({ length: count }, () => ({
    par: 4 as const,
    strokes: '' as unknown as number,
    putts: null,
    gir: false,
    drive_result: null,
  }))
}

function HoleRow({
  index,
  control,
  register,
}: {
  index: number
  control: ReturnType<typeof useForm<HoleScoresFormValues>>['control']
  register: ReturnType<typeof useForm<HoleScoresFormValues>>['register']
}) {
  const par = useWatch({ control, name: `holes.${index}.par` })

  return (
    <div className="grid grid-cols-[2rem_3.5rem_3.5rem_3.5rem_2.5rem_6rem] gap-2 items-center">
      {/* Hole number */}
      <span className="text-sm text-center text-muted-foreground">{index + 1}</span>

      {/* Par */}
      <Controller
        control={control}
        name={`holes.${index}.par`}
        render={({ field }) => (
          <Select
            value={String(field.value)}
            onValueChange={(v) => field.onChange(Number(v) as 3 | 4 | 5)}
          >
            <SelectTrigger className="w-full h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      {/* Strokes */}
      <Input
        type="number"
        min="1"
        className="h-8 text-sm"
        {...register(`holes.${index}.strokes`, {
          setValueAs: (v) => (v === '' ? undefined : Number(v)),
        })}
      />

      {/* Putts */}
      <Input
        type="number"
        min="0"
        className="h-8 text-sm"
        {...register(`holes.${index}.putts`, {
          setValueAs: (v) => (v === '' ? null : Number(v)),
        })}
      />

      {/* GIR checkbox */}
      <div className="flex justify-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input accent-primary"
          {...register(`holes.${index}.gir`)}
        />
      </div>

      {/* Drive result — hidden on par 3 */}
      {par === 3 ? (
        <span className="text-xs text-muted-foreground text-center">—</span>
      ) : (
        <Controller
          control={control}
          name={`holes.${index}.drive_result`}
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onValueChange={(v) => field.onChange(v || null)}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Drive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fairway_hit">Fairway</SelectItem>
                <SelectItem value="missed_left">Miss L</SelectItem>
                <SelectItem value="missed_right">Miss R</SelectItem>
                <SelectItem value="missed_short">Short</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      )}
    </div>
  )
}

export function HoleScoreEntry({ holesPlayed, onBack, onSubmit, loading = false }: HoleScoreEntryProps) {
  const { control, register, handleSubmit } = useForm<HoleScoresFormValues>({
    resolver: zodResolver(holeScoresSchema),
    defaultValues: { holes: makeDefaultHoles(holesPlayed) },
  })

  const { fields } = useFieldArray({ control, name: 'holes' })

  function handleFormSubmit(values: HoleScoresFormValues) {
    const totalStrokes = values.holes.reduce((sum, h) => sum + (h.strokes || 0), 0)
    const scoreVsPar = values.holes.reduce((sum, h) => sum + (h.strokes || 0) - h.par, 0)
    onSubmit(values.holes, totalStrokes, scoreVsPar)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-[2rem_3.5rem_3.5rem_3.5rem_2.5rem_6rem] gap-2 text-xs font-medium text-muted-foreground mb-1">
        <span className="text-center">#</span>
        <span>Par</span>
        <span>Strokes</span>
        <span>Putts</span>
        <span className="text-center">GIR</span>
        <span>Drive</span>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {fields.map((field, index) => (
          <HoleRow key={field.id} index={index} control={control} register={register} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          ← Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Saving…' : 'Submit Round'}
        </Button>
      </div>
    </form>
  )
}
