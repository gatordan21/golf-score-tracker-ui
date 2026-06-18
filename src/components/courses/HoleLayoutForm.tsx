import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { holeLayoutSchema, type HoleLayoutFormValues } from '@/schemas/course'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CourseHole } from '@/types/course'

interface HoleLayoutFormProps {
  numHoles: number
  existingHoles?: CourseHole[]
  onSubmit: (holes: { hole_number: number; par: number; distance_yards: number }[]) => void
  loading?: boolean
}

function makeDefaults(numHoles: number, existingHoles?: CourseHole[]) {
  return Array.from({ length: numHoles }, (_, i) => ({
    par: (existingHoles?.[i]?.par ?? 4) as 3 | 4 | 5,
    distance_yards: existingHoles?.[i]?.distance_yards ?? ('' as unknown as number),
  }))
}

export function HoleLayoutForm({ numHoles, existingHoles, onSubmit, loading = false }: HoleLayoutFormProps) {
  const { control, handleSubmit, reset, register } = useForm<HoleLayoutFormValues>({
    resolver: zodResolver(holeLayoutSchema),
    defaultValues: { holes: makeDefaults(numHoles, existingHoles) },
  })

  const { fields } = useFieldArray({ control, name: 'holes' })

  useEffect(() => {
    reset({ holes: makeDefaults(numHoles, existingHoles) })
  }, [numHoles])

  function handleFormSubmit(values: HoleLayoutFormValues) {
    const payload = values.holes.map((h, i) => ({
      hole_number: i + 1,
      par: h.par,
      distance_yards: h.distance_yards,
    }))
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground px-1">
        <span>Hole</span>
        <span>Par</span>
        <span>Distance (yds)</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-2 items-start">
            <div className="flex h-9 items-center px-3 rounded-md border bg-muted text-sm">
              {index + 1}
            </div>
            <Controller
              control={control}
              name={`holes.${index}.par`}
              render={({ field: f }) => (
                <Select
                  onValueChange={(v) => f.onChange(Number(v) as 3 | 4 | 5)}
                  defaultValue={String(f.value)}
                >
                  <SelectTrigger>
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
            <Input
              type="number"
              min="1"
              placeholder="400"
              {...register(`holes.${index}.distance_yards`, {
                setValueAs: (v) => (v === '' ? '' : Number(v)),
              })}
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving…' : existingHoles?.length ? 'Replace Hole Layout' : 'Save Hole Layout'}
      </Button>
    </form>
  )
}
