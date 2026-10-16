import { Gauge } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { LeverPill } from '@/components/shared/LeverPill'
import { MonoValue } from '@/components/shared/MonoValue'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTh } from '@/lib/format'
import type { Recommendation } from '@/types/domain'
import { useRecommendations } from '../hooks/useThermalData'

export function LatestRecoCard({ onOpen }: { onOpen: (reco: Recommendation) => void }) {
  const { data } = useRecommendations()
  const latest = data?.[data.length - 1]

  return (
    <Card
      className="cursor-pointer p-5 transition-colors hover:border-brand/30"
      role="button"
      tabIndex={0}
      aria-label="Ouvrir la dernière recommandation"
      onClick={() => latest && onOpen(latest)}
      onKeyDown={(event) => { if (latest && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpen(latest) } }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Latest Recommendation</h2>
        <Gauge className="size-5 text-predicted" aria-hidden />
      </div>
      {latest ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <LeverPill lever={latest.lever} direction={latest.direction} />
            <span className="text-sm text-ink-body">{latest.direction}</span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm text-ink-sub">
            <span>
              Tag: <MonoValue className="font-semibold text-ink">{latest.tag}</MonoValue>
            </span>
            <span>
              15m Pred: <MonoValue className="font-bold text-ink">{formatTh(latest.predictedSteam)} t/h</MonoValue>
            </span>
          </div>
        </>
      ) : (
        <Skeleton className="mt-3 h-20 w-full" />
      )}
    </Card>
  )
}
