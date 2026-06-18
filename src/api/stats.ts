import { apiFetch } from './client'
import type { SummaryStats, CourseStats, DrivingStats } from '@/types/stats'

export const statsApi = {
  getSummary: () => apiFetch<SummaryStats>('/stats/summary'),
  getByCourse: () => apiFetch<CourseStats[]>('/stats/by-course'),
  getDriving: () => apiFetch<DrivingStats>('/stats/driving'),
}
