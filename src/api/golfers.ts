import { apiFetch } from './client'
import type { Golfer, GolferCreate } from '@/types/golfer'
import type { Round } from '@/types/round'
import type { SummaryStats } from '@/types/stats'

export const golfersApi = {
  list: () => apiFetch<Golfer[]>('/golfers'),
  get: (id: number) => apiFetch<Golfer>(`/golfers/${id}`),
  create: (data: GolferCreate) =>
    apiFetch<Golfer>('/golfers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: GolferCreate) =>
    apiFetch<Golfer>(`/golfers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/golfers/${id}`, { method: 'DELETE' }),
  getRounds: (id: number) => apiFetch<Round[]>(`/golfers/${id}/rounds`),
  getStats: (id: number) => apiFetch<SummaryStats>(`/golfers/${id}/stats`),
}
