import { KpiTile } from '@/components/shared/KpiTile'
import type { KpiTone } from '@/components/shared/kpi-tones'

export interface KpiItem {
  value: string
  unit?: string
  label: string
  tone: KpiTone
}

/** Grille de 4 tuiles KPI à bordure gauche colorée. */
export function ProjectKpis({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <KpiTile key={item.label} {...item} />
      ))}
    </div>
  )
}
