import { MonoValue } from '@/components/shared/MonoValue'
import { DirectionBadge } from '@/components/shared/DirectionBadge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LEVER_STYLES } from '@/design-system/lever-styles'
import { formatIsoTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/domain'
import { formatSequence, toLeverBucket } from '../utils/lever-distribution'

/** Rangée de chips (un par timestamp) colorés selon le levier recommandé. */
export function LeverTimeline({ recos, onOpen }: { recos: Recommendation[]; onOpen: (reco: Recommendation) => void }) {
  const first = recos[0]
  const last = recos[recos.length - 1]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-ink">Variation chronologique des leviers dans le temps →</h3>
        <span className="text-xs text-ink-mute">Survolez un intervalle pour inspecter la recommandation</span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1" aria-label="Chronologie des leviers recommandés">
        {recos.map((reco) => (
          <li key={reco.id}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => onOpen(reco)}
                    aria-label={`${formatIsoTime(reco.timestamp)} : ${reco.lever}`}
                    className={cn('block h-[22px] w-5 rounded-[4px] focus-visible:outline-2 focus-visible:outline-brand', LEVER_STYLES[toLeverBucket(reco.lever)].chip)}
                  />
                }
              />
              <TooltipContent className="flex-col items-start gap-1">
                <span className="flex items-center gap-2">
                  <MonoValue>{formatIsoTime(reco.timestamp)}</MonoValue>
                  <strong>{reco.lever}</strong>
                  <DirectionBadge direction={reco.direction} />
                </span>
                <span className="max-w-60 whitespace-normal">{reco.title}</span>
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>

      <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-xs text-ink-sub">
        <MonoValue>{first ? formatIsoTime(first.timestamp) : '—'}</MonoValue>
        <p className="text-center">{formatSequence(recos)}</p>
        <MonoValue>{last ? formatIsoTime(last.timestamp) : '—'}</MonoValue>
      </div>
    </div>
  )
}
