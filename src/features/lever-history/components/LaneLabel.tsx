import { MonoValue } from '@/components/shared/MonoValue'
import { RECO_OUTCOME_STYLES } from '@/design-system/history-styles'
import type { LeverDef, RecoMatch } from '@/types/lever-history'

interface LaneLabelProps {
  def: LeverDef
  changeCount: number
  currentValue: number
  /** Issues des recos de ce levier, pour la mini-barre de suivi. */
  outcomes: RecoMatch['outcome'][]
  width: number
}

/** Colonne fixe à gauche d'un couloir : nom, code, valeur, nombre de changements, taux de suivi. */
export function LaneLabel({ def, changeCount, currentValue, outcomes, width }: LaneLabelProps) {
  const followed = outcomes.filter((o) => o === 'suivie' || o === 'partielle').length
  const rate = outcomes.length === 0 ? null : Math.round((followed / outcomes.length) * 100)

  return (
    <div className="flex shrink-0 flex-col justify-center gap-0.5 border-r border-line-soft px-3" style={{ width }}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold text-ink" title={def.label}>
          {def.label}
        </span>
        <span className="shrink-0 rounded bg-surface-muted px-1.5 text-[10px] text-ink-sub">{changeCount} chg</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <MonoValue className="text-[11px] text-ink-mute">{def.id}</MonoValue>
        <MonoValue className="text-[11px] font-semibold text-ink">
          {currentValue.toFixed(1)} {def.unit}
        </MonoValue>
      </div>
      {rate !== null && (
        <span className="mt-0.5 flex h-1 w-full overflow-hidden rounded-full bg-surface-muted" aria-label={`Taux de suivi ${rate}%`}>
          <span className={RECO_OUTCOME_STYLES.suivie.bar} style={{ width: `${rate}%` }} />
        </span>
      )}
    </div>
  )
}
