import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/api/stats'

export function useSummaryStats() {
  return useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: statsApi.getSummary,
  })
}

export function useCourseStats() {
  return useQuery({
    queryKey: ['stats', 'by-course'],
    queryFn: statsApi.getByCourse,
  })
}
