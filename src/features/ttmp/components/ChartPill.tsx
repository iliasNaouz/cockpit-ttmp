import { combustionTheme } from '@/design-system/chart-theme'
import { fonts } from '@/design-system/tokens'

export const PILL_HEIGHT = 15
const LABEL_STYLE = { fontFamily: fonts.sans, fontSize: 10, fill: combustionTheme.refLine } as const

interface ChartPillProps {
  x: number
  y: number
  width: number
  text: string
}

/** Petite pill blanche (texte 10px) servant d'étiquette aux lignes de référence. */
export function ChartPill({ x, y, width, text }: ChartPillProps) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={PILL_HEIGHT} rx={5} fill="var(--color-surface)" stroke="var(--color-line)" />
      <text x={x + width / 2} y={y + 10.5} textAnchor="middle" style={LABEL_STYLE}>
        {text}
      </text>
    </g>
  )
}
