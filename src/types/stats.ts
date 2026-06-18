export interface DrivingStats {
  total_drives: number
  fairway_hit: number
  missed_left: number
  missed_right: number
  missed_short: number
}

export interface SummaryStats {
  rounds_played: number
  avg_strokes: number | null
  avg_score_vs_par: number | null
  best_score_vs_par: number | null
  best_round_date: string | null
  avg_putts_per_round: number | null
  avg_gir_per_round: number | null
  driving: DrivingStats | null
}

export interface CourseStats {
  course_id: number
  course_name: string
  rounds_played: number
  best_score_vs_par: number
  avg_score_vs_par: number
  avg_strokes: number
}
