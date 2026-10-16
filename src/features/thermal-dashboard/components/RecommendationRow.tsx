import { Clock, Eye, Pencil, Trash2 } from 'lucide-react'
import { LeverPill } from '@/components/shared/LeverPill'
import { MonoValue } from '@/components/shared/MonoValue'
import { O2Pill } from '@/components/shared/O2Pill'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatIsoDate, formatIsoTime, formatSignedDelta, formatTh } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/domain'
import { deltaVsSetpoint, predictionDelta } from '../utils/log-filters'

interface RecommendationRowProps {
  reco: Recommendation
  canWrite: boolean
  selected: boolean
  onOpen: (reco: Recommendation, edit?: boolean) => void
  onDelete: (reco: Recommendation) => void
}

const ICON_BUTTON =
  'rounded p-1 text-ink-mute transition-colors hover:text-ink-label focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50'

export function RecommendationRow({ reco, canWrite, selected, onOpen, onDelete }: RecommendationRowProps) {
  const vsSetpoint = deltaVsSetpoint(reco.actualSteam)
  const delta = predictionDelta(reco.actualSteam, reco.predictedSteam)

  return (
    <TableRow
      onClick={() => onOpen(reco)}
      data-selected={selected || undefined}
      className={cn(
        'h-[58px] cursor-pointer border-line-soft hover:bg-page',
        selected && 'bg-brand-soft/50 hover:bg-brand-soft/50 [&>td:first-child]:shadow-[inset_2px_0_0_var(--color-brand)]',
      )}
    >
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-ink-mute" aria-hidden />
          <MonoValue className="text-[13px] font-semibold text-ink">{formatIsoTime(reco.timestamp)}</MonoValue>
        </div>
        <MonoValue className="ml-5 block text-[11px] text-ink-sub">{formatIsoDate(reco.timestamp)}</MonoValue>
      </TableCell>
      <TableCell>
        <MonoValue className="text-sm font-bold text-ink">{formatTh(reco.actualSteam)}</MonoValue>
        <span className="ml-1 text-[11px] text-ink-mute">t/h</span>
        {vsSetpoint !== null && (
          <MonoValue className={cn('block text-[11px]', vsSetpoint >= 0 ? 'text-success' : 'text-danger')}>
            {formatSignedDelta(vsSetpoint)} vs consigne
          </MonoValue>
        )}
      </TableCell>
      <TableCell>
        <MonoValue className="text-sm text-ink">{formatTh(reco.predictedSteam)}</MonoValue>
        <span className="ml-1 text-[11px] text-ink-mute">t/h</span>
        {delta !== null && <MonoValue className="block text-[11px] text-ink-mute">Δ {formatSignedDelta(delta)}</MonoValue>}
      </TableCell>
      <TableCell><O2Pill value={reco.o2} /></TableCell>
      <TableCell><LeverPill lever={reco.lever} direction={reco.direction} /></TableCell>
      <TableCell>
        <MonoValue className="block text-xs text-ink-body">Grille: <span className="text-lever-grille">{reco.grillePct.toFixed(1)}%</span></MonoValue>
        <MonoValue className="block text-xs text-ink-body">Poussoir: <span className="text-lever-grille">{reco.poussoirPct.toFixed(1)}%</span></MonoValue>
      </TableCell>
      <TableCell className="max-w-[320px]">
        <p className="truncate text-[13px] font-semibold text-ink">{reco.title}</p>
        <p className="truncate text-xs text-ink-sub">{reco.description}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <button type="button" className={ICON_BUTTON} aria-label={`Voir le détail de ${formatIsoTime(reco.timestamp)}`} onClick={(event) => { event.stopPropagation(); onOpen(reco) }}>
            <Eye className="size-4" aria-hidden />
          </button>
          <ReadOnlyGuard canWrite={canWrite}>
            <button type="button" className={ICON_BUTTON} disabled={!canWrite} aria-label="Modifier" onClick={(event) => { event.stopPropagation(); onOpen(reco, true) }}>
              <Pencil className="size-4" aria-hidden />
            </button>
          </ReadOnlyGuard>
          <ReadOnlyGuard canWrite={canWrite}>
            <button type="button" className={ICON_BUTTON} disabled={!canWrite} aria-label="Supprimer" onClick={(event) => { event.stopPropagation(); onDelete(reco) }}>
              <Trash2 className="size-4" aria-hidden />
            </button>
          </ReadOnlyGuard>
        </div>
      </TableCell>
    </TableRow>
  )
}
