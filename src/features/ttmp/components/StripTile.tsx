import type { ReactNode } from 'react'
import { KPI_TONES, type KpiTone } from '@/components/shared/kpi-tones'
import { MonoValue } from '@/components/shared/MonoValue'
import { Skeleton } from '@/components/ui/skeleton'
import { formatSignedDelta } from '@/lib/format'
import { useCountUp } from '@/lib/use-count-up'
import { cn } from '@/lib/utils'

interface StripTileProps {
  label: string
  /** `undefined` pendant le chargement : squelette de même géométrie. */
  value: number | undefined
  digits: number
  unit: string
  tone: KpiTone
  /** Affiche le signe `+` / `-` (écarts). */
  signed?: boolean
  /** Ligne secondaire (11px). */
  secondary?: ReactNode
  /** Élément aligné à droite (sparkline, flèche, badge, barre…). */
  detail?: ReactNode
}

/** Tuile de la bande KPI : 68px, barre gauche de 3px, valeur mono animée, texte aligné à gauche. */
export function StripTile({ label, value, digits, unit, tone, signed = false, secondary, detail }: StripTileProps) {
  const animated = useCountUp(value ?? 0)
  const style = KPI_TONES[tone]

  if (value === undefined) return <Skeleton className="h-[68px] rounded-xl" />

  return (
    <div className={cn('flex h-[68px] items-center justify-between gap-2 rounded-xl border border-l-[3px] border-line bg-surface px-3.5 py-2', style.border)}>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-ink-mute">{label}</p>
        <p className="mt-0.5">
          <MonoValue className={cn('text-xl leading-tight font-bold', style.value)}>
            {signed ? formatSignedDelta(animated, digits) : animated.toFixed(digits)}
          </MonoValue>
          <span className="ml-1 text-[11px] text-ink-mute">{unit}</span>
        </p>
        {secondary && <div className="text-[11px] leading-none text-ink-mute">{secondary}</div>}
      </div>
      {detail && <div className="shrink-0">{detail}</div>}
    </div>
  )
}
