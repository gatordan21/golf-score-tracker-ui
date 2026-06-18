export interface Golfer {
  id: number
  username: string
  name: string
  state: string
  handicap: number | null
  trackman_id: string | null
}

export interface GolferCreate {
  username: string
  name: string
  state: string
  handicap?: number | null
  trackman_id?: string | null
}
