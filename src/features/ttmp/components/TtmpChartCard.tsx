import { Maximize2 } from 'lucide-react'
import { useState } from 'react'
import { UnderlineTabs, type UnderlineTabOption } from '@/components/shared/UnderlineTabs'
import { CombustionDiagram } from './CombustionDiagram'
import { CombustionExpandedSheet } from './CombustionExpandedSheet'
import { LegendPopover } from './CombustionLegend'
import { DashCard } from './DashCard'
import { SteamStabilityChart } from './SteamStabilityChart'

type ChartTab = 'grille' | 'stabilite'

const TABS: UnderlineTabOption<ChartTab>[] = [
  { value: 'grille', label: 'Diagramme de grille' },
  { value: 'stabilite', label: 'Stabilité vapeur (1 h)' },
]

/** Carte graphique : occupe toute la hauteur restante de la colonne gauche. */
export function TtmpChartCard({ className }: { className?: string }) {
  const [tab, setTab] = useState<ChartTab>('grille')
  const [expanded, setExpanded] = useState(false)

  return (
    <DashCard
      className={className}
      scroll={false}
      title={<UnderlineTabs options={TABS} value={tab} onChange={setTab} ariaLabel="Graphiques de la ligne" compact dense />}
      actions={
        tab === 'grille' ? (
          <>
            <LegendPopover />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Agrandir le diagramme"
              className="flex size-7 items-center justify-center rounded-lg text-ink-mute hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Maximize2 className="size-4" aria-hidden />
            </button>
          </>
        ) : undefined
      }
      bodyClassName="flex flex-col p-3"
    >
      <div className="min-h-0 flex-1" role="tabpanel">
        {tab === 'grille' ? <CombustionDiagram /> : <SteamStabilityChart />}
      </div>
      <CombustionExpandedSheet open={expanded} onOpenChange={setExpanded} />
    </DashCard>
  )
}
