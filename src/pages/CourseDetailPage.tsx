import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCourse, useCourseHoles, useSetCourseHoles } from '@/hooks/useCourses'
import { HoleLayoutForm } from '@/components/courses/HoleLayoutForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { Button, buttonVariants } from '@/components/ui/button'
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

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)

  const { data: course, isLoading, isError } = useCourse(courseId)
  const { data: holes } = useCourseHoles(courseId)
  const setHoles = useSetCourseHoles(courseId)

  const [holeDialogOpen, setHoleDialogOpen] = useState(false)

  function handleSaveHoles(payload: { hole_number: number; par: number; distance_yards: number }[]) {
    setHoles.mutate(payload, { onSuccess: () => setHoleDialogOpen(false) })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !course) return <ErrorMessage message="Course not found." />

  const totalPar = holes?.reduce((sum, h) => sum + h.par, 0)
  const totalYards = holes?.reduce((sum, h) => sum + h.distance_yards, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{course.name}</h1>
          <p className="text-muted-foreground">
            {course.city}, {course.state} · {course.num_holes} holes
            {course.tees_played && ` · ${course.tees_played} tees`}
          </p>
        </div>
        <Link to="/courses" className={buttonVariants({ variant: 'outline' })}>
          ← Back
        </Link>
      </div>

      {/* Course info tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Par', value: formatStat(course.par) },
          { label: 'Course Rating', value: formatStat(course.course_rating) },
          { label: 'Slope Rating', value: formatStat(course.slope_rating) },
          { label: 'Tees', value: formatStat(course.tees_played) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Hole layout */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Hole Layout
          </h2>
          <Button size="sm" onClick={() => setHoleDialogOpen(true)}>
            {holes?.length ? 'Edit Layout' : 'Add Layout'}
          </Button>
        </div>

        {!holes?.length ? (
          <p className="text-sm text-muted-foreground">No hole layout added yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hole</TableHead>
                <TableHead>Par</TableHead>
                <TableHead>Distance (yds)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holes.map((h) => (
                <TableRow key={h.hole_number}>
                  <TableCell>{h.hole_number}</TableCell>
                  <TableCell>{h.par}</TableCell>
                  <TableCell>{h.distance_yards}</TableCell>
                </TableRow>
              ))}
              {holes.length > 0 && (
                <TableRow className="font-medium border-t-2">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalPar}</TableCell>
                  <TableCell>{totalYards?.toLocaleString()}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Hole layout dialog */}
      <Dialog open={holeDialogOpen} onOpenChange={setHoleDialogOpen}>
        <DialogContent className="max-w-md max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {holes?.length ? 'Replace Hole Layout' : 'Add Hole Layout'}
            </DialogTitle>
          </DialogHeader>
          {holes?.length ? (
            <p className="text-sm text-muted-foreground -mt-2">
              Submitting will replace all existing hole data for this course.
            </p>
          ) : null}
          <HoleLayoutForm
            numHoles={course.num_holes}
            existingHoles={holes}
            onSubmit={handleSaveHoles}
            loading={setHoles.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
