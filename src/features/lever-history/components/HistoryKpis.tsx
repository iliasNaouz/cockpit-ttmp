import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { KPI_STATUS_STYLES } from '@/design-system/status-styles'
import { RECO_OUTCOME_STYLES, getFollowUpStatus } from '@/design-system/history-styles'
import { MonoValue } from '@/components/shared/MonoValue'
import { cn } from '@/lib/utils'
import type { HistorySummary, RecoOutcome } from '@/types/lever-history'

const OUTCOME_ORDER: RecoOutcome[] = ['suivie', 'partielle', 'contraire', 'ignoree']

type KpiFilter = 'all' | 'initiatives' | 'ignorees'

interface HistoryKpisProps {
  summary: HistorySummary
  active: KpiFilter
  onFilter: (filter: KpiFilter) => void
}

interface TileProps {
  label: string
  value: string
  detail?: React.ReactNode
  valueClass?: string
  barClass?: string
  active?: boolean
  onClick?: () => void
}

function Tile({ label, value, detail, valueClass = 'text-ink', barClass = 'border-l-line', active, onClick }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[76px] flex-col justify-center rounded-xl border border-l-[3px] bg-surface px-4 text-left transition-colors',
        barClass,
        active ? 'ring-2 ring-brand/40' : 'hover:border-brand/40',
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">{label}</span>
      <span className="mt-0.5">
        <MonoValue className={cn('text-xl font-bold', valueClass)}>{value}</MonoValue>
      </span>
      {detail && <span className="mt-0.5 text-[11px] text-ink-sub">{detail}</span>}
    </button>
  )
}

/** Mini-barre empilée des issues de recommandations. */
function OutcomeBar({ outcomes, total }: { outcomes: HistorySummary['outcomes']; total: number }) {
  if (total === 0) return null
  return (
    <span className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full" aria-hidden>
      {OUTCOME_ORDER.map((outcome) => {
        const pct = (outcomes[outcome] / total) * 100
        return pct > 0 ? <span key={outcome} className={RECO_OUTCOME_STYLES[outcome].bar} style={{ width: `${pct}%` }} /> : null
      })}
    </span>
  )
}

/** Bande des 5 KPI ; un clic filtre la vue (initiatives, recos ignorées). */
export function HistoryKpis({ summary, active, onFilter }: HistoryKpisProps) {
  const followStatus = getFollowUpStatus(summary.followRate)
  const toggle = (filter: KpiFilter) => onFilter(active === filter ? 'all' : filter)

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 md:grid-cols-5" aria-label="Indicateurs">
      <Tile label="Changements" value={String(summary.changeCount)} detail={`dont ${summary.operatorChangeCount} opérateur`} />
      <Tile
        label="Recos émises"
        value={String(summary.recoCount)}
        detail={<OutcomeBar outcomes={summary.outcomes} total={summary.recoCount} />}
        active={active === 'ignorees'}
        onClick={() => toggle('ignorees')}
      />
      <Tile
        label="Taux de suivi"
        value={`${summary.followRate}%`}
        valueClass={KPI_STATUS_STYLES[followStatus].value}
        barClass={KPI_STATUS_STYLES[followStatus].bar}
        detail={
          <span className="flex items-center gap-1">
            {summary.followRate >= 50 ? <ArrowUpRight className="size-3 text-success" aria-hidden /> : <ArrowDownRight className="size-3 text-danger" aria-hidden />}
            vs période précédente
          </span>
        }
      />
      <Tile
        label="Initiatives"
        value={String(summary.initiativeCount)}
        valueClass="text-initiative-text"
        barClass="border-l-initiative"
        active={active === 'initiatives'}
        onClick={() => toggle('initiatives')}
      />
      <Tile label="Délai moyen" value={`${summary.avgDelayMin} min`} detail="reco → changement" />
    </div>
  )
}

export type { KpiFilter }
