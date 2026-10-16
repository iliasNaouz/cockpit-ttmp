import { useId, useMemo, useState, type MouseEvent } from 'react'
import { useElementSize } from '@/lib/use-element-size'
import { COMPACT_DOMAIN, FULL_DOMAIN } from '../config/combustion-geometry'
import { useTtmpStatus } from '../hooks/useTtmpData'
import { linearScale } from '../utils/combustion-scale'
import { COMPACT_BELOW_WIDTH } from '../utils/diagram-layout'
import { MARGINS, Y_TICK_GUTTER, type DiagramGeometry, type HoverFactory, type TooltipState } from '../utils/diagram-types'
import { CombustionAxes } from './CombustionAxes'
import { CombustionLayers } from './CombustionLayers'
import { CombustionRefLines } from './CombustionRefLines'

/** Repli quand la taille n'est pas mesurable (tests jsdom). */
const FALLBACK = { width: 640, height: 300 }
const MIN_WIDTH = 160

interface CombustionDiagramProps {
  /** Vue agrandie : domaine complet et labels longs. */
  expanded?: boolean
}

/**
 * Diagramme de combustion dessiné à la taille réelle de son conteneur (aucun viewBox ni mise à l'échelle) :
 * les textes gardent leur taille quelle que soit la carte.
 */
export function CombustionDiagram({ expanded = false }: CombustionDiagramProps) {
  const clipId = `plot-clip-${useId().replace(/:/g, '')}`
  const [ref, measured] = useElementSize<HTMLDivElement>()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const { data: status } = useTtmpStatus()

  const size = measured.width > 0 && measured.height > 0 ? measured : FALLBACK
  const domain = expanded ? FULL_DOMAIN : COMPACT_DOMAIN
  const compact = !expanded && size.width < COMPACT_BELOW_WIDTH

  const geometry = useMemo<DiagramGeometry>(() => {
    const box = {
      left: MARGINS.left + Y_TICK_GUTTER,
      right: size.width - MARGINS.right,
      top: MARGINS.top,
      bottom: size.height - MARGINS.bottom,
    }
    return {
      box,
      domain,
      expanded,
      compact,
      sx: linearScale(domain.x, [box.left, box.right]),
      sy: linearScale(domain.y, [box.bottom, box.top]),
    }
  }, [size.width, size.height, domain, expanded, compact])

  const hover: HoverFactory = (title, detail) => ({
    onMouseMove: (event: MouseEvent<SVGElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      setTooltip({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top + 12, title, detail })
    },
    onMouseLeave: () => setTooltip(null),
  })

  const current = status ? { x: status.wasteFlow, y: status.thermalPower } : null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={ref} className="relative min-h-[160px] flex-1">
        {size.width >= MIN_WIDTH && (
          <svg
            width={size.width}
            height={size.height}
            className="absolute inset-0 block"
            role="img"
            aria-label="Diagramme de combustion : puissance thermique en fonction du débit de déchets"
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={geometry.box.left} y={geometry.box.top} width={geometry.box.right - geometry.box.left} height={geometry.box.bottom - geometry.box.top} />
              </clipPath>
            </defs>
            <CombustionAxes geometry={geometry} />
            <CombustionLayers geometry={geometry} hover={hover} clipId={clipId} current={current} />
            <CombustionRefLines geometry={geometry} />
          </svg>
        )}
        {tooltip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 max-w-60 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-card"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-semibold text-ink">{tooltip.title}</p>
            {tooltip.detail && <p className="mt-0.5 font-mono text-ink-sub">{tooltip.detail}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
