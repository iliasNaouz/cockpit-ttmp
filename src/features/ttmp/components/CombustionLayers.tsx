import { combustionTheme } from '@/design-system/chart-theme'
import { colors, fonts } from '@/design-system/tokens'
import {
  ANNUAL_PCI,
  ANNUAL_POINT,
  NOMINAL_POLYGON,
  OVERLOAD_POLYGON,
  PCI_LEVELS,
  pciPower,
  type Point,
} from '../config/combustion-geometry'
import { toSvgPoints } from '../utils/combustion-scale'
import { getPciLabelPoint, pillWidth, placeCurrentLabel } from '../utils/diagram-layout'
import type { DiagramGeometry, HoverFactory } from '../utils/diagram-types'

const LABEL_HALO = { paintOrder: 'stroke', stroke: 'var(--color-surface)', strokeWidth: 3 } as const
const fmt = (point: Point): string => `${point.x.toFixed(1)} t/h · ${point.y.toFixed(1)} MW`

interface CombustionLayersProps {
  geometry: DiagramGeometry
  hover: HoverFactory
  clipId: string
  /** Point de fonctionnement actuel du site sélectionné. */
  current: Point | null
}

/** Zones, droites PCI libellées, sommets A–G, point moyen annuel et point actuel. */
export function CombustionLayers({ geometry, hover, clipId, current }: CombustionLayersProps) {
  const { sx, sy, domain, compact } = geometry
  const [xMin, xMax] = domain.x
  const yMax = domain.y[1]

  return (
    <g>
      <g clipPath={`url(#${clipId})`}>
        <polygon points={toSvgPoints(OVERLOAD_POLYGON, sx, sy)} fill={combustionTheme.overloadFill} stroke={combustionTheme.overloadStroke} strokeWidth={1.5} {...hover('Zone de surcharge')} />
        <polygon points={toSvgPoints(NOMINAL_POLYGON, sx, sy)} fill={combustionTheme.nominalFill} stroke={combustionTheme.nominalStroke} strokeWidth={2.5} strokeLinejoin="round" {...hover('Fonctionnement nominal')} />
        {PCI_LEVELS.map(({ pci }) => {
          const line = { x1: sx(xMin), y1: sy(pciPower(pci, xMin)), x2: sx(xMax), y2: sy(pciPower(pci, xMax)) }
          return (
            <g key={pci}>
              <line {...line} stroke={combustionTheme.pci[pci]} strokeWidth={1.5} />
              {/* Zone de survol élargie, invisible. */}
              <line {...line} stroke="transparent" strokeWidth={10} {...hover(`PCI ${pci} kcal/kg`)} />
            </g>
          )
        })}
      </g>

      {!compact && PCI_LEVELS.map(({ pci }) => {
        const label = getPciLabelPoint(pci, xMax, yMax)
        return (
          <text
            key={pci}
            x={sx(label.x) - 3}
            y={sy(label.y) + (label.exitsTop ? 0 : -4)}
            textAnchor="end"
            style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, fill: combustionTheme.pci[pci], ...LABEL_HALO }}
          >
            {pci}
          </text>
        )
      })}

      {!compact && NOMINAL_POLYGON.map((vertex) => (
        <g key={vertex.id}>
          <circle cx={sx(vertex.x)} cy={sy(vertex.y)} r={7} fill={colors.surface} stroke={combustionTheme.nominalStroke} strokeWidth={1.5} />
          <text x={sx(vertex.x)} y={sy(vertex.y) + 3.5} textAnchor="middle" style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 700, fill: colors.success }}>
            {vertex.id}
          </text>
        </g>
      ))}

      <circle
        cx={sx(ANNUAL_POINT.x)}
        cy={sy(ANNUAL_POINT.y)}
        r={5}
        fill={combustionTheme.annualPoint}
        stroke={colors.surface}
        strokeWidth={2}
        {...hover(`Point moyen annuel — PCI ${ANNUAL_PCI} kcal/kg`, fmt(ANNUAL_POINT))}
      />

      {current && <CurrentPoint current={current} geometry={geometry} hover={hover} />}
    </g>
  )
}

const CURRENT_TEXT = 'Actuel'

function CurrentPoint({ current, geometry, hover }: { current: Point; geometry: DiagramGeometry; hover: HoverFactory }) {
  const { sx, sy, box } = geometry
  const cx = sx(current.x)
  const cy = sy(current.y)
  const width = pillWidth(CURRENT_TEXT)
  const label = placeCurrentLabel(cx, cy, width, box)

  return (
    <g {...hover('Point de fonctionnement actuel', fmt(current))}>
      <line {...label.stub} stroke={colors.brand} strokeWidth={1} />
      <polygon
        points={`${cx},${cy - 6} ${cx + 6},${cy} ${cx},${cy + 6} ${cx - 6},${cy}`}
        fill={colors.brand}
        stroke={colors.surface}
        strokeWidth={1.5}
      />
      <rect x={label.x} y={label.y} width={width} height={15} rx={5} fill={colors.brand} />
      <text x={label.x + width / 2} y={label.y + 10.5} textAnchor="middle" style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 700, fill: colors.onBrand }}>
        {CURRENT_TEXT}
      </text>
    </g>
  )
}
