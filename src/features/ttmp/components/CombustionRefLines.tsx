import { combustionTheme } from '@/design-system/chart-theme'
import { LOAD_LINES, POWER_LINES } from '../config/combustion-geometry'
import { assignRows, placeHorizontalLabels, pillWidth } from '../utils/diagram-layout'
import type { DiagramGeometry } from '../utils/diagram-types'
import { ChartPill, PILL_HEIGHT } from './ChartPill'

const ROW_STEP = PILL_HEIGHT + 3

/** Lignes de puissance (pills à gauche, dans le tracé) et de charge (pills horizontales en haut, décalées si elles se touchent). */
export function CombustionRefLines({ geometry }: { geometry: DiagramGeometry }) {
  const { box, sx, sy, expanded } = geometry
  const stroke = combustionTheme.refLine

  const powers = [...POWER_LINES].sort((a, b) => b.value - a.value)
  const placements = placeHorizontalLabels(powers.map((line) => sy(line.value)), PILL_HEIGHT)

  const loads = LOAD_LINES.map((line) => {
    const text = expanded ? line.label : line.short
    return { line, text, width: pillWidth(text) }
  })
  const rows = assignRows(loads.map((load) => ({ center: sx(load.line.value), width: load.width })))

  return (
    <g>
      {powers.map((line, index) => {
        const text = expanded ? line.label : line.short
        const width = pillWidth(text)
        const y = sy(line.value)
        return (
          <g key={line.value}>
            <line x1={box.left} x2={box.right} y1={y} y2={y} stroke={stroke} strokeDasharray="4 4" />
            <ChartPill x={box.left + 4} y={placements[index] === 'above' ? y - PILL_HEIGHT - 2 : y + 2} width={width} text={text} />
          </g>
        )
      })}
      {loads.map(({ line, text, width }, index) => {
        const pillY = 3 + rows[index] * ROW_STEP
        const x = Math.min(Math.max(sx(line.value) - width / 2, box.left), box.right - width)
        return (
          <g key={line.value}>
            <line x1={sx(line.value)} x2={sx(line.value)} y1={pillY + PILL_HEIGHT} y2={box.bottom} stroke={stroke} strokeDasharray="4 4" />
            <ChartPill x={x} y={pillY} width={width} text={text} />
          </g>
        )
      })}
    </g>
  )
}
