import { chartTheme } from '@/design-system/chart-theme'

export interface ChartTooltipRow {
  label: string
  value: string
  /** Référence de couleur `var(--…)` du repère. */
  color?: string
}

interface ChartTooltipProps {
  title: string
  rows: ChartTooltipRow[]
}

/** Infobulle de graphique : carte blanche, valeurs en mono. */
export function ChartTooltip({ title, rows }: ChartTooltipProps) {
  return (
    <div className={chartTheme.tooltip.wrapper}>
      <p className="mb-1.5 font-mono font-semibold text-ink">{title}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-ink-sub">
              {row.color && (
                <span className="size-2 rounded-full" style={{ backgroundColor: row.color }} aria-hidden />
              )}
              {row.label}
            </span>
            <span className={chartTheme.tooltip.value}>{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
