import { cn } from '@/lib/utils'

export interface LegendItem {
  label: string
  /** Référence de couleur `var(--…)`. */
  color: string
  variant?: 'solid' | 'dashed' | 'dot' | 'bar'
}

function Swatch({ color, variant = 'solid' }: Pick<LegendItem, 'color' | 'variant'>) {
  if (variant === 'dot') {
    return <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
  }
  if (variant === 'bar') {
    return <span className="h-3 w-3 rounded-sm opacity-40" style={{ backgroundColor: color }} aria-hidden />
  }
  return (
    <span
      className="w-3 border-t-[3px]"
      style={{ borderColor: color, borderTopStyle: variant === 'dashed' ? 'dashed' : 'solid' }}
      aria-hidden
    />
  )
}

/** Légende personnalisée : petit trait coloré 12×3px + label 13px. */
export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-soft pt-3', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-[13px] text-ink-body">
          <Swatch color={item.color} variant={item.variant} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
