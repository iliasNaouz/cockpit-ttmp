import { CheckCircle2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { usePermission } from '@/auth/usePermission'
import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MILESTONE_STYLES } from '@/design-system/status-styles'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Milestone, Phase } from '@/types/project'

const COLUMNS = ['Jalon', 'Phase', 'Responsable', 'Échéance', 'Statut', 'Actions']

export function MilestonesTable({ milestones, phases }: { milestones: Milestone[]; phases: Phase[] }) {
  const { canWrite } = usePermission('projets')
  const phaseTitle = (id: number) => phases.find((phase) => phase.id === id)?.title ?? '—'

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-line hover:bg-transparent">
            {COLUMNS.map((column) => (
              <TableHead key={column} className="h-10 text-[11px] font-bold uppercase tracking-wider text-ink-sub">{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {milestones.map((milestone) => {
            const status = MILESTONE_STYLES[milestone.status]
            return (
              <TableRow key={milestone.id} className="h-[52px] border-line-soft hover:bg-page">
                <TableCell className="text-[13px] font-semibold text-ink">{milestone.title}</TableCell>
                <TableCell className="text-xs text-ink-sub">{phaseTitle(milestone.phaseId)}</TableCell>
                <TableCell className="text-[13px] text-ink-body">{milestone.owner}</TableCell>
                <TableCell><MonoValue className="text-[13px] text-ink-body">{formatDate(milestone.dueDate)}</MonoValue></TableCell>
                <TableCell>
                  <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap', status.pill)}>
                    {milestone.status === 'termine' && <CheckCircle2 className="size-3" aria-hidden />}
                    {status.label}
                  </span>
                </TableCell>
                <TableCell>
                  <ReadOnlyGuard canWrite={canWrite}>
                    <button
                      type="button"
                      disabled={!canWrite}
                      aria-label={`Modifier ${milestone.title}`}
                      onClick={() => toast.info("La modification d'un jalon n'est pas disponible dans cette démo.")}
                      className="rounded p-1 text-ink-mute hover:text-ink-label disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                  </ReadOnlyGuard>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
