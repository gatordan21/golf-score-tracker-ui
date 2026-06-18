import { apiFetch } from './client'
import type { Course, CourseCreate, CourseHole, CourseHoleCreate } from '@/types/course'

export const coursesApi = {
  list: () => apiFetch<Course[]>('/courses'),
  get: (id: number) => apiFetch<Course>(`/courses/${id}`),
  create: (data: CourseCreate) =>
    apiFetch<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: CourseCreate) =>
    apiFetch<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/courses/${id}`, { method: 'DELETE' }),
  getHoles: (id: number) => apiFetch<CourseHole[]>(`/courses/${id}/holes`),
  setHoles: (id: number, holes: CourseHoleCreate[]) =>
    apiFetch<CourseHole[]>(`/courses/${id}/holes`, {
      method: 'POST',
      body: JSON.stringify(holes),
    }),
}
