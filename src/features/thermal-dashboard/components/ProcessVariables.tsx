import { MonoValue } from '@/components/shared/MonoValue'
import { O2_TEXT } from '@/design-system/status-styles'
import { formatTh } from '@/lib/format'
import { getO2Status } from '@/lib/o2-status'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/domain'

interface TileProps {
  label: string
  value: string
  unit: string
  valueClassName?: string
  compact?: boolean
}

function Tile({ label, value, unit, valueClassName, compact = false }: TileProps) {
  return (
    <div className="rounded-xl border border-line bg-page px-4 py-3">
      <p className="text-[13px] text-ink-sub">{label}</p>
      <p className="mt-1">
        <MonoValue className={cn('font-bold text-ink', compact ? 'text-base' : 'text-[22px]', valueClassName)}>{value}</MonoValue>
        <span className="ml-1 text-xs text-ink-mute">{unit}</span>
      </p>
    </div>
  )
}

const fixed = (value: number | null, digits: number): string => (value === null ? '—' : value.toFixed(digits))

/** Les 9 variables process à l'instant de la recommandation. */
export function ProcessVariables({ reco }: { reco: Recommendation }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Tile label="Steam Actual" value={formatTh(reco.actualSteam)} unit="t/h" />
      <Tile label="Consigne" value={reco.consigne.toFixed(1)} unit="t/h" />
      <Tile
        label="Combustion O₂"
        value={fixed(reco.o2, 2)}
        unit="%"
        valueClassName={reco.o2 === null ? undefined : O2_TEXT[getO2Status(reco.o2)]}
      />
      <Tile label="Grille (Grate)" value={reco.grillePct.toFixed(2)} unit="%" />
      <Tile label="Poussoir (Feeder)" value={reco.poussoirPct.toFixed(2)} unit="%" />
      <Tile label="Predicted +15m" value={formatTh(reco.predictedSteam)} unit="t/h" />
      <Tile label="Air Primaire" value={fixed(reco.airPrimaireRpm, 1)} unit="tr/min" compact />
      <Tile label="Air Secondaire" value={fixed(reco.airSecondaireRpm, 1)} unit="tr/min" compact />
      <Tile label="Pression Z2 / Z3" value={`${fixed(reco.pressionZ2, 2)} / ${fixed(reco.pressionZ3, 2)}`} unit="mbar" compact />
    </div>
  )
}
