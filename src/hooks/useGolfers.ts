import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { golfersApi } from '@/api/golfers'
import type { GolferCreate } from '@/types/golfer'

export function useGolfers() {
  return useQuery({ queryKey: ['golfers'], queryFn: golfersApi.list })
}

export function useGolfer(id: number) {
  return useQuery({ queryKey: ['golfers', id], queryFn: () => golfersApi.get(id) })
}

export function useGolferRounds(id: number) {
  return useQuery({ queryKey: ['golfers', id, 'rounds'], queryFn: () => golfersApi.getRounds(id) })
}

export function useGolferStats(id: number) {
  return useQuery({ queryKey: ['golfers', id, 'stats'], queryFn: () => golfersApi.getStats(id) })
}

export function useCreateGolfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GolferCreate) => golfersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['golfers'] }),
    onError: () => toast.error('Failed to create golfer'),
  })
}

export function useUpdateGolfer(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GolferCreate) => golfersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['golfers'] })
      qc.invalidateQueries({ queryKey: ['golfers', id] })
    },
    onError: () => toast.error('Failed to update golfer'),
  })
}

export function useDeleteGolfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => golfersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['golfers'] }),
    onError: () => toast.error('Failed to delete golfer'),
  })
}
