import { cn } from '@/lib/utils'
import { KPI_TONES, type KpiTone } from './kpi-tones'

interface KpiTileProps {
  value: string
  unit?: string
  label: string
  tone?: KpiTone
  className?: string
}

/** Tuile KPI : valeur mono, unité, label uppercase, bordure gauche colorée de 3px. */
export function KpiTile({ value, unit, label, tone = 'brand', className }: KpiTileProps) {
  const style = KPI_TONES[tone]
  return (
    <div
      className={cn(
        'rounded-lg border border-l-[3px] border-line bg-surface py-5 text-center',
        style.border,
        className,
      )}
    >
      <div>
        <span className={cn('font-mono text-[26px] font-bold', style.value)}>{value}</span>
        {unit && <span className="ml-1 text-xs text-ink-mute">{unit}</span>}
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-mute">{label}</p>
    </div>
  )
}
