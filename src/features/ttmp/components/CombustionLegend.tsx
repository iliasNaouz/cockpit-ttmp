import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { combustionTheme } from '@/design-system/chart-theme'
import { PCI_LEVELS } from '../config/combustion-geometry'

type Variant = 'dot' | 'bar' | 'line' | 'diamond'
interface Item {
  label: string
  color: string
  variant: Variant
}

const OVERLOAD: Item = { label: 'Zone de surcharge', color: combustionTheme.overloadStroke, variant: 'bar' }
const NOMINAL: Item = { label: 'Fonctionnement nominal', color: combustionTheme.nominalStroke, variant: 'bar' }
const CURRENT: Item = { label: 'Actuel', color: 'var(--color-brand)', variant: 'diamond' }
const ANNUAL: Item = { label: 'Point moyen annuel', color: combustionTheme.annualPoint, variant: 'dot' }

const FULL_LEGEND: Item[] = [
  OVERLOAD,
  NOMINAL,
  ...PCI_LEVELS.map(({ pci, label }) => ({ label, color: combustionTheme.pci[pci], variant: 'line' as const })),
  ANNUAL,
  { ...CURRENT, label: 'Point de fonctionnement actuel' },
]

function Swatch({ item }: { item: Item }): ReactNode {
  if (item.variant === 'diamond') return <span className="size-2 rotate-45" style={{ backgroundColor: item.color }} aria-hidden />
  if (item.variant === 'dot') return <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
  if (item.variant === 'bar') return <span className="h-2.5 w-4 rounded-sm border" style={{ borderColor: item.color, backgroundColor: item.color, opacity: 0.5 }} aria-hidden />
  return <span className="w-4 border-t-2" style={{ borderColor: item.color }} aria-hidden />
}

/** Légende complète sur 2 colonnes (popover et vue agrandie). */
export function FullLegendList() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-ink-body">
      {FULL_LEGEND.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <Swatch item={item} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/** Bouton Info : ouvre la légende complète sur 2 colonnes. */
export function LegendPopover() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Afficher la légende complète"
        className="flex size-7 items-center justify-center rounded-lg text-ink-mute hover:bg-surface-muted hover:text-ink-body focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Info className="size-4" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px]">
        <h3 className="text-xs font-bold text-ink">Légende du diagramme</h3>
        <FullLegendList />
      </PopoverContent>
    </Popover>
  )
}
