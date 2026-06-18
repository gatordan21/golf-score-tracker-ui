import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGolfers, useCreateGolfer, useUpdateGolfer, useDeleteGolfer } from '@/hooks/useGolfers'
import type { Golfer } from '@/types/golfer'
import type { GolferFormValues } from '@/schemas/golfer'
import { GolferForm } from '@/components/golfers/GolferForm'
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

export default function GolfersPage() {
  const { data: golfers, isLoading, isError } = useGolfers()
  const createGolfer = useCreateGolfer()
  const deleteGolfer = useDeleteGolfer()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Golfer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Golfer | null>(null)

  const updateGolfer = useUpdateGolfer(editTarget?.id ?? 0)

  function handleCreate(values: GolferFormValues) {
    createGolfer.mutate(values, { onSuccess: () => setAddOpen(false) })
  }

  function handleUpdate(values: GolferFormValues) {
    if (!editTarget) return
    updateGolfer.mutate(values, { onSuccess: () => setEditTarget(null) })
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteGolfer.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage message="Failed to load golfers." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Golfers</h1>
        <Button onClick={() => setAddOpen(true)}>Add Golfer</Button>
      </div>

      {!golfers?.length ? (
        <EmptyState
          message="No golfers yet."
          action={<Button onClick={() => setAddOpen(true)}>Add your first golfer</Button>}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Handicap</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {golfers.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Link to={`/golfers/${g.id}`} className="font-medium hover:underline">
                    {g.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{g.username}</TableCell>
                <TableCell>{g.state}</TableCell>
                <TableCell>{formatStat(g.handicap)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setEditTarget(g)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(g)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Golfer</DialogTitle>
          </DialogHeader>
          <GolferForm onSubmit={handleCreate} loading={createGolfer.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Golfer</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <GolferForm
              golfer={editTarget}
              onSubmit={handleUpdate}
              loading={updateGolfer.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Golfer"
        message={`Delete "${deleteTarget?.name}"? This will also delete all of their rounds and hole scores.`}
        onConfirm={handleDelete}
        loading={deleteGolfer.isPending}
      />
    </div>
  )
}
