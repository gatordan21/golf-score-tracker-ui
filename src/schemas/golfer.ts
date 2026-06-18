import { z } from 'zod'

export const golferSchema = z.object({
  username: z.string().min(3, 'Must be at least 3 characters'),
  name: z.string().min(1, 'Name is required'),
  state: z.string().min(2, 'Must be a 2-letter code').max(2, 'Must be a 2-letter code'),
  handicap: z.number().min(-10, 'Min −10').max(54, 'Max 54').nullable().optional(),
  trackman_id: z.string().nullable().optional(),
})

export type GolferFormValues = z.infer<typeof golferSchema>
