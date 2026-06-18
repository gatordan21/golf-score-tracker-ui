import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { golferSchema, type GolferFormValues } from '@/schemas/golfer'
import type { Golfer } from '@/types/golfer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface GolferFormProps {
  golfer?: Golfer
  onSubmit: (values: GolferFormValues) => void
  loading?: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

export function GolferForm({ golfer, onSubmit, loading = false }: GolferFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GolferFormValues>({
    resolver: zodResolver(golferSchema),
    defaultValues: {
      username: golfer?.username ?? '',
      name: golfer?.name ?? '',
      state: golfer?.state ?? '',
      handicap: golfer?.handicap ?? null,
      trackman_id: golfer?.trackman_id ?? '',
    },
  })

  function handleFormSubmit(values: GolferFormValues) {
    onSubmit({ ...values, state: values.state.toUpperCase() })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Username</Label>
        <Input placeholder="jsmith" {...register('username')} />
        <FieldError message={errors.username?.message} />
      </div>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input placeholder="John Smith" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label>State</Label>
        <Input placeholder="TX" maxLength={2} {...register('state')} />
        <FieldError message={errors.state?.message} />
      </div>

      <div className="space-y-2">
        <Label>Handicap (optional)</Label>
        <Input
          type="number"
          step="0.1"
          min="-10"
          max="54"
          placeholder="e.g. 12.4"
          {...register('handicap', {
            setValueAs: (v) => (v === '' ? null : Number(v)),
          })}
        />
        <FieldError message={errors.handicap?.message} />
      </div>

      <div className="space-y-2">
        <Label>Trackman ID (optional)</Label>
        <Input
          placeholder="TM-12345"
          {...register('trackman_id', {
            setValueAs: (v) => (v === '' ? null : v),
          })}
        />
        <FieldError message={errors.trackman_id?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving…' : golfer ? 'Update Golfer' : 'Add Golfer'}
      </Button>
    </form>
  )
}
