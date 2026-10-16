import { chartTheme } from '@/design-system/chart-theme'
import { colors } from '@/design-system/tokens'

interface Box {
  x: number
  y: number
  width: number
}

function isBox(value: unknown): value is Box {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value && 'width' in value
}

const HEIGHT = 20
const CHAR_WIDTH = 6.6

/** Pill « Consigne 40.0 t/h » rendue dans le graphique, en haut à droite de la ligne de consigne. */
export function SetpointLabel({ viewBox, text }: { viewBox?: unknown; text: string }) {
  if (!isBox(viewBox)) return null
  const width = text.length * CHAR_WIDTH + 16
  const x = viewBox.x + viewBox.width - width - 6
  const y = viewBox.y - HEIGHT - 4

  return (
    <g>
      <rect x={x} y={y} width={width} height={HEIGHT} rx={6} fill={colors.surface} stroke={colors.line} />
      <text
        x={x + width / 2}
        y={y + HEIGHT / 2 + 4}
        textAnchor="middle"
        style={{ ...chartTheme.axisTickSmall, fill: colors.inkSub }}
      >
        {text}
      </text>
    </g>
  )
}
