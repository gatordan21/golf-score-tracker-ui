import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses'
import { roundsApi } from '@/api/rounds'
import type { Course } from '@/types/course'
import type { CourseFormValues } from '@/schemas/course'
import { CourseForm } from '@/components/courses/CourseForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatStat } from '@/lib/utils'

export default function CoursesPage() {
  const { data: courses, isLoading, isError } = useCourses()
  const createCourse = useCreateCourse()
  const deleteCourse = useDeleteCourse()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Course | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)

  const updateCourse = useUpdateCourse(editTarget?.id ?? 0)

  const { data: courseRounds } = useQuery({
    queryKey: ['rounds', { course_id: deleteTarget?.id }],
    queryFn: () => roundsApi.list({ course_id: deleteTarget!.id }),
    enabled: !!deleteTarget,
  })

  function handleCreate(values: CourseFormValues) {
    createCourse.mutate(values, { onSuccess: () => setAddOpen(false) })
  }

  function handleUpdate(values: CourseFormValues) {
    if (!editTarget) return
    updateCourse.mutate(values, { onSuccess: () => setEditTarget(null) })
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteCourse.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage message="Failed to load courses." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Button onClick={() => setAddOpen(true)}>Add Course</Button>
      </div>

      {!courses?.length ? (
        <EmptyState
          message="No courses yet."
          action={<Button onClick={() => setAddOpen(true)}>Add your first course</Button>}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Holes</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link to={`/courses/${c.id}`} className="font-medium hover:underline">
                    {c.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.city}, {c.state}
                </TableCell>
                <TableCell>{c.num_holes}</TableCell>
                <TableCell>{formatStat(c.par)}</TableCell>
                <TableCell>
                  {c.course_rating != null ? `${c.course_rating}` : '—'}
                  {c.slope_rating != null ? ` / ${c.slope_rating}` : ''}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setEditTarget(c)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(c)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
          </DialogHeader>
          <CourseForm onSubmit={handleCreate} loading={createCourse.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <CourseForm
              course={editTarget}
              onSubmit={handleUpdate}
              loading={updateCourse.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Course"
        message={`Delete "${deleteTarget?.name}"? This will also delete ${courseRounds ? `${courseRounds.length} round(s)` : 'all rounds'} played here and their hole scores.`}
        onConfirm={handleDelete}
        loading={deleteCourse.isPending}
      />
    </div>
  )
}
