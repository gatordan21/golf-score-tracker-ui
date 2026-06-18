import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseFormValues } from '@/schemas/course'
import type { Course } from '@/types/course'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CourseFormProps {
  course?: Course
  onSubmit: (values: CourseFormValues) => void
  loading?: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

export function CourseForm({ course, onSubmit, loading = false }: CourseFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name ?? '',
      city: course?.city ?? '',
      state: course?.state ?? '',
      num_holes: (course?.num_holes ?? 18) as 9 | 18,
      par: course?.par ?? null,
      slope_rating: course?.slope_rating ?? null,
      course_rating: course?.course_rating ?? null,
      tees_played: course?.tees_played ?? '',
    },
  })

  function handleFormSubmit(values: CourseFormValues) {
    onSubmit({ ...values, state: values.state.toUpperCase() })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Course Name</Label>
        <Input placeholder="Augusta National" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input placeholder="Augusta" {...register('city')} />
          <FieldError message={errors.city?.message} />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input placeholder="GA" maxLength={2} {...register('state')} />
          <FieldError message={errors.state?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Holes</Label>
          <Controller
            control={control}
            name="num_holes"
            render={({ field }) => (
              <Select
                onValueChange={(v) => field.onChange(Number(v) as 9 | 18)}
                defaultValue={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.num_holes?.message} />
        </div>
        <div className="space-y-2">
          <Label>Par (optional)</Label>
          <Input
            type="number"
            placeholder="72"
            {...register('par', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <FieldError message={errors.par?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Slope Rating (optional)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="113"
            {...register('slope_rating', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <FieldError message={errors.slope_rating?.message} />
        </div>
        <div className="space-y-2">
          <Label>Course Rating (optional)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="72.4"
            {...register('course_rating', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <FieldError message={errors.course_rating?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tees Played (optional)</Label>
        <Input
          placeholder="White"
          {...register('tees_played', {
            setValueAs: (v) => (v === '' ? null : v),
          })}
        />
        <FieldError message={errors.tees_played?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving…' : course ? 'Update Course' : 'Add Course'}
      </Button>
    </form>
  )
}
