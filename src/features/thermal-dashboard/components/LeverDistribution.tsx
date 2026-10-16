import { BarChart3, Clock } from 'lucide-react'
import { useMemo } from 'react'
import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { LEVER_STYLES } from '@/design-system/lever-styles'
import type { Recommendation } from '@/types/domain'
import { useRecommendations } from '../hooks/useThermalData'
import { computeLeverDistribution } from '../utils/lever-distribution'
import { LeverCard } from './LeverCard'
import { LeverTimeline } from './LeverTimeline'

export function LeverDistribution({ onOpen }: { onOpen: (reco: Recommendation) => void }) {
  const { data } = useRecommendations()
  const recos = useMemo(() => data ?? [], [data])
  const distribution = useMemo(() => computeLeverDistribution(recos), [recos])
  const timeouts = recos.filter((reco) => reco.lever === 'Timeout Error')

  if (!data) return <Card className="p-5"><Skeleton className="h-96 w-full" /></Card>

  return (
    <Card className="p-5">
      <SectionHeader
        icon={BarChart3}
        title="Variation & Répartition des Leviers Recommandés (% des Recos)"
        subtitle="Part de chaque levier dans les décisions de l'agent sur la fenêtre courante."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2.5 py-1 font-mono text-xs text-ink-body">
            <Clock className="size-3.5" aria-hidden />
            Total: {recos.length} recos
          </span>
        }
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-sub">
        <span>Part globale des leviers d'action :</span>
        <span>100% du catalogue de recommandations</span>
      </div>
      <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-surface-muted" role="img" aria-label="Répartition des leviers">
        {distribution.filter((entry) => entry.count > 0).map((entry) => (
          <div key={entry.lever} className={LEVER_STYLES[entry.lever].bar} style={{ width: `${entry.pct}%` }} title={`${entry.lever} ${entry.pct.toFixed(0)}%`} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {distribution.map((entry) => (
          <li key={entry.lever} className="flex items-center gap-2 text-[13px] text-ink-body">
            <span className={`size-2 rounded-full ${LEVER_STYLES[entry.lever].dot}`} aria-hidden />
            {entry.lever}
            <MonoValue className="font-bold">{entry.pct.toFixed(0)}%</MonoValue>
          </li>
        ))}
      </ul>

      {/* 6 leviers + la carte « Timeout Error » (déjà comptée dans « Non défini »). */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {distribution.map((entry) => (
          <LeverCard key={entry.lever} lever={entry.lever} direction={entry.direction} count={entry.count} total={recos.length} description={entry.description} />
        ))}
        <LeverCard lever="Timeout Error" direction="Hold" count={timeouts.length} total={recos.length} description={timeouts[0]?.description ?? ''} />
      </div>

      <Separator className="my-5" />
      <LeverTimeline recos={recos} onOpen={onOpen} />
    </Card>
  )
}
