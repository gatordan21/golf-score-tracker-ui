import { apiFetch } from './client'
import type { Round, RoundCreate } from '@/types/round'

export interface RoundFilters {
  course_id?: number
  golfer_id?: number
  from_date?: string
  to_date?: string
}

export const roundsApi = {
  list: (filters?: RoundFilters) => {
    const params = new URLSearchParams()
    if (filters?.course_id) params.set('course_id', String(filters.course_id))
    if (filters?.golfer_id) params.set('golfer_id', String(filters.golfer_id))
    if (filters?.from_date) params.set('from_date', filters.from_date)
    if (filters?.to_date) params.set('to_date', filters.to_date)
    const qs = params.toString()
    return apiFetch<Round[]>(`/rounds${qs ? `?${qs}` : ''}`)
  },
  get: (id: number) => apiFetch<Round>(`/rounds/${id}`),
  create: (data: RoundCreate) =>
    apiFetch<Round>('/rounds', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/rounds/${id}`, { method: 'DELETE' }),
}
