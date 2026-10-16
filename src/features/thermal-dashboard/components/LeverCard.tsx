import { DirectionBadge } from '@/components/shared/DirectionBadge'
import { MonoValue } from '@/components/shared/MonoValue'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { LEVER_STYLES } from '@/design-system/lever-styles'
import type { Direction, RecommendedLever } from '@/types/domain'

interface LeverCardProps {
  lever: RecommendedLever
  direction: Direction
  count: number
  total: number
  description: string
}

/** Petite carte de levier : nom, direction dominante, part en %, barre et description. */
export function LeverCard({ lever, direction, count, total, description }: LeverCardProps) {
  const pct = total === 0 ? 0 : (count / total) * 100

  return (
    <article className="min-w-0 rounded-lg border border-line bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <h3 className="text-sm font-bold text-ink">{lever}</h3>
          <DirectionBadge direction={direction} />
        </div>
        <MonoValue className="text-xl font-bold text-brand">{pct.toFixed(1)}%</MonoValue>
      </div>
      <p className="mt-1 text-[11px] text-ink-sub">
        <MonoValue>{count}</MonoValue> sur <MonoValue>{total}</MonoValue> décisions
      </p>
      <div className="mt-2">
        <ProgressBar value={pct} barClassName={LEVER_STYLES[lever].bar} label={`Part de ${lever}`} />
      </div>
      <p className="mt-2 truncate text-[11.5px] italic text-ink-sub" title={description}>
        {description || '—'}
      </p>
    </article>
  )
}
