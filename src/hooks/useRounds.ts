import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { roundsApi } from '@/api/rounds'
import type { RoundFilters } from '@/api/rounds'
import type { RoundCreate } from '@/types/round'

export function useRounds(filters?: RoundFilters) {
  return useQuery({
    queryKey: ['rounds', filters ?? {}],
    queryFn: () => roundsApi.list(filters),
  })
}

export function useRound(id: number) {
  return useQuery({
    queryKey: ['rounds', id],
    queryFn: () => roundsApi.get(id),
  })
}

export function useCreateRound() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RoundCreate) => roundsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rounds'] }),
    onError: () => toast.error('Failed to save round'),
  })
}

export function useDeleteRound() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roundsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rounds'] }),
    onError: () => toast.error('Failed to delete round'),
  })
}
