import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coursesApi } from '@/api/courses'
import type { CourseCreate, CourseHoleCreate } from '@/types/course'

export function useCourses() {
  return useQuery({ queryKey: ['courses'], queryFn: coursesApi.list })
}

export function useCourse(id: number) {
  return useQuery({ queryKey: ['courses', id], queryFn: () => coursesApi.get(id) })
}

export function useCourseHoles(id: number) {
  return useQuery({ queryKey: ['courses', id, 'holes'], queryFn: () => coursesApi.getHoles(id) })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CourseCreate) => coursesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    onError: () => toast.error('Failed to create course'),
  })
}

export function useUpdateCourse(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CourseCreate) => coursesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      qc.invalidateQueries({ queryKey: ['courses', id] })
    },
    onError: () => toast.error('Failed to update course'),
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => coursesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    onError: () => toast.error('Failed to delete course'),
  })
}

export function useSetCourseHoles(courseId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (holes: CourseHoleCreate[]) => coursesApi.setHoles(courseId, holes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses', courseId, 'holes'] }),
    onError: () => toast.error('Failed to save hole layout'),
  })
}
