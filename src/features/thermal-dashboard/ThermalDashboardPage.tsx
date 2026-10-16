import { useState } from 'react'
import type { Recommendation } from '@/types/domain'
import { AgentHealthCard } from './components/AgentHealthCard'
import { LatestRecoCard } from './components/LatestRecoCard'
import { LeverDistribution } from './components/LeverDistribution'
import { LogFilters } from './components/LogFilters'
import { RecoDetailSheet } from './components/RecoDetailSheet'
import { RecommendationsTable } from './components/RecommendationsTable'
import { TelemetryChart } from './components/TelemetryChart'
import { useLogFilters } from './hooks/useLogFilters'
import { useRecoSelection } from './hooks/useRecoSelection'
import { useRecommendations } from './hooks/useThermalData'

const NO_RECOS: Recommendation[] = []

export function ThermalDashboardPage() {
  const { data } = useRecommendations()
  const recos = data ?? NO_RECOS
  const { filters, setFilter, filtered } = useLogFilters(recos)
  const { selected, select, clear } = useRecoSelection(recos)
  const [startInEdit, setStartInEdit] = useState(false)

  const open = (reco: Recommendation, edit = false) => {
    setStartInEdit(edit)
    select(reco)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <LatestRecoCard onOpen={open} />
        <AgentHealthCard />
      </div>
      <TelemetryChart />
      <LeverDistribution onOpen={open} />
      <LogFilters filters={filters} onChange={setFilter} shown={filtered.length} total={recos.length} />
      <RecommendationsTable recos={filtered} selectedId={selected?.id} onOpen={open} />
      <RecoDetailSheet
        reco={selected}
        navigable={filtered}
        allRecos={recos}
        startInEdit={startInEdit}
        onSelect={(reco) => select(reco, { replace: true })}
        onClose={clear}
      />
    </div>
  )
}
