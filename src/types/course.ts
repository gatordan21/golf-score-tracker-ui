export interface Course {
  id: number
  name: string
  city: string
  state: string
  num_holes: number
  par: number | null
  slope_rating: number | null
  course_rating: number | null
  tees_played: string | null
}

export interface CourseCreate {
  name: string
  city: string
  state: string
  num_holes: number
  par?: number | null
  slope_rating?: number | null
  course_rating?: number | null
  tees_played?: string | null
}

export interface CourseHole {
  id: number
  course_id: number
  hole_number: number
  par: number
  distance_yards: number
}

export interface CourseHoleCreate {
  hole_number: number
  par: number
  distance_yards: number
}
