import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'
import type { DiagramGeometry } from '../utils/diagram-types'

const TICK_STYLE = { ...chartTheme.axisTickSmall, fontSize: 10 }
const TITLE_STYLE = { ...chartTheme.axisTickSmall, fontSize: 10, fill: colors.inkBody }

/** Grille de fond, graduations (mono 11px) et titres d'axes abrégés « MW » / « t/h ». */
export function CombustionAxes({ geometry }: { geometry: DiagramGeometry }) {
  const { box, sx, sy, domain } = geometry

  return (
    <g>
      {domain.yTicks.map((tick) => (
        <g key={`y-${tick}`}>
          <line x1={box.left} x2={box.right} y1={sy(tick)} y2={sy(tick)} stroke={chartTheme.grid} />
          <text x={box.left - 6} y={sy(tick) + 4} textAnchor="end" style={TICK_STYLE}>
            {tick}
          </text>
        </g>
      ))}
      {domain.xTicks.map((tick) => (
        <g key={`x-${tick}`}>
          <line x1={sx(tick)} x2={sx(tick)} y1={box.top} y2={box.bottom} stroke={chartTheme.grid} />
          <text x={sx(tick)} y={box.bottom + 16} textAnchor="middle" style={TICK_STYLE}>
            {tick}
          </text>
        </g>
      ))}
      <rect x={box.left} y={box.top} width={box.right - box.left} height={box.bottom - box.top} fill="none" stroke={colors.line} />
      <text x={box.left - 6} y={box.top - 7} textAnchor="end" style={TITLE_STYLE}>
        MW
      </text>
      <text x={box.right} y={box.bottom + 26} textAnchor="end" style={TITLE_STYLE}>
        t/h
      </text>
    </g>
  )
}
