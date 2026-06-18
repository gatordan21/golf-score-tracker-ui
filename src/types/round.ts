export type DriveResult = 'fairway_hit' | 'missed_left' | 'missed_right' | 'missed_short'

export interface HoleScore {
  id: number
  round_id: number
  hole_number: number
  par: number
  strokes: number
  putts: number | null
  gir: boolean | null
  drive_result: DriveResult | null
}

export interface HoleScoreCreate {
  hole_number: number
  par: number
  strokes: number
  putts?: number | null
  gir?: boolean | null
  drive_result?: DriveResult | null
}

export interface Round {
  id: number
  course_id: number
  golfer_id: number
  date_played: string
  holes_played: number
  total_strokes: number
  score_vs_par: number
  total_putts: number | null
  greens_in_reg: number | null
  notes: string | null
  hole_scores: HoleScore[]
}

export interface RoundCreate {
  course_id: number
  golfer_id: number
  date_played: string
  holes_played: number
  total_strokes: number
  score_vs_par: number
  total_putts?: number | null
  greens_in_reg?: number | null
  notes?: string | null
  holes?: HoleScoreCreate[]
}
