import { z } from 'zod'

export const driveResultValues = [
  'fairway_hit',
  'missed_left',
  'missed_right',
  'missed_short',
] as const

export const roundHeaderSchema = z.object({
  golfer_id: z.number().int().positive('Select a golfer'),
  course_id: z.number().int().positive('Select a course'),
  date_played: z.string().min(1, 'Date is required'),
  holes_played: z.union([z.literal(9), z.literal(18)]),
  total_strokes: z.number().int().min(1, 'Min 1'),
  score_vs_par: z.number().int(),
  total_putts: z.number().int().min(0, 'Min 0').nullable().optional(),
  greens_in_reg: z.number().int().min(0, 'Min 0').nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const holeScoreRowSchema = z.object({
  par: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  strokes: z.number().int().min(1, 'Min 1'),
  putts: z.number().int().min(0, 'Min 0').nullable().optional(),
  gir: z.boolean().optional(),
  drive_result: z.enum(driveResultValues).nullable().optional(),
})

export const holeScoresSchema = z.object({
  holes: z.array(holeScoreRowSchema),
})

export type RoundHeaderFormValues = z.infer<typeof roundHeaderSchema>
export type HoleScoreRowValues = z.infer<typeof holeScoreRowSchema>
export type HoleScoresFormValues = z.infer<typeof holeScoresSchema>
