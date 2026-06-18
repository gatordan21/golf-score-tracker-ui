import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roundHeaderSchema, type RoundHeaderFormValues } from '@/schemas/round'
import type { Golfer } from '@/types/golfer'
import type { Course } from '@/types/course'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RoundHeaderFormProps {
  golfers: Golfer[]
  courses: Course[]
  onSaveOnly: (values: RoundHeaderFormValues) => void
  onContinue: (values: RoundHeaderFormValues) => void
  loading?: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

export function RoundHeaderForm({
  golfers,
  courses,
  onSaveOnly,
  onContinue,
  loading = false,
}: RoundHeaderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoundHeaderFormValues>({
    resolver: zodResolver(roundHeaderSchema),
    defaultValues: {
      holes_played: 18,
      total_strokes: undefined,
      score_vs_par: undefined,
      total_putts: null,
      greens_in_reg: null,
      notes: '',
    },
  })

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Golfer</Label>
          <Controller
            control={control}
            name="golfer_id"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select golfer" />
                </SelectTrigger>
                <SelectContent>
                  {golfers.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.golfer_id?.message} />
        </div>

        <div className="space-y-2">
          <Label>Course</Label>
          <Controller
            control={control}
            name="course_id"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.course_id?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date Played</Label>
          <Input type="date" {...register('date_played')} />
          <FieldError message={errors.date_played?.message} />
        </div>

        <div className="space-y-2">
          <Label>Holes Played</Label>
          <Controller
            control={control}
            name="holes_played"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v) as 9 | 18)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Total Strokes</Label>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 92"
            {...register('total_strokes', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          />
          <FieldError message={errors.total_strokes?.message} />
        </div>

        <div className="space-y-2">
          <Label>Score vs Par</Label>
          <Input
            type="number"
            placeholder="e.g. +20"
            {...register('score_vs_par', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          />
          <FieldError message={errors.score_vs_par?.message} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        If you add hole scores in the next step, totals will be auto-computed.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Total Putts (optional)</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 34"
            {...register('total_putts', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <FieldError message={errors.total_putts?.message} />
        </div>

        <div className="space-y-2">
          <Label>Greens in Reg (optional)</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 8"
            {...register('greens_in_reg', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <FieldError message={errors.greens_in_reg?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea
          placeholder="Any notes about the round…"
          rows={3}
          {...register('notes', {
            setValueAs: (v) => (v === '' ? null : v),
          })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={loading}
          onClick={handleSubmit(onSaveOnly)}
        >
          {loading ? 'Saving…' : 'Save without hole scores'}
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={loading}
          onClick={handleSubmit(onContinue)}
        >
          Add hole scores →
        </Button>
      </div>
    </form>
  )
}
