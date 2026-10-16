import { Flame } from 'lucide-react'
import { DetailSheet } from '@/components/shared/DetailSheet'
import { CombustionDiagram } from './CombustionDiagram'
import { FullLegendList } from './CombustionLegend'

/** Vue agrandie du diagramme : domaine complet, labels longs, légende complète et tooltips. */
export function CombustionExpandedSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DetailSheet
      open={open}
      onOpenChange={onOpenChange}
      icon={Flame}
      title="Diagramme de combustion"
      subtitle="Puissance thermique (MW) en fonction du débit de déchets (t/h) — domaine complet"
      size="xl"
      flush
    >
      <div className="min-h-0 flex-1 px-6 pt-6">
        <CombustionDiagram expanded />
      </div>
      <div className="shrink-0 border-t border-line px-6 py-4">
        <FullLegendList />
      </div>
    </DetailSheet>
  )
}
