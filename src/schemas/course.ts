import { z } from 'zod'

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'Must be a 2-letter code').max(2, 'Must be a 2-letter code'),
  num_holes: z.union([z.literal(9), z.literal(18)]),
  par: z.number().int().positive('Must be positive').nullable().optional(),
  slope_rating: z.number().min(55, 'Min 55').max(155, 'Max 155').nullable().optional(),
  course_rating: z.number().positive('Must be positive').nullable().optional(),
  tees_played: z.string().nullable().optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export const holeRowSchema = z.object({
  par: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  distance_yards: z.number().int().positive('Must be positive'),
})

export const holeLayoutSchema = z.object({
  holes: z.array(holeRowSchema),
})

export type HoleLayoutFormValues = z.infer<typeof holeLayoutSchema>
