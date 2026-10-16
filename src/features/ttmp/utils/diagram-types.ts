import type { MouseEvent } from 'react'
import type { DiagramDomain } from '../config/combustion-geometry'
import type { Scale } from './combustion-scale'

export interface PlotBox {
  left: number
  right: number
  top: number
  bottom: number
}

export interface DiagramGeometry {
  box: PlotBox
  sx: Scale
  sy: Scale
  domain: DiagramDomain
  /** Vue agrandie : labels longs. */
  expanded: boolean
  /** Petite carte : valeurs PCI et lettres A–G masquées (visibles au survol / en vue agrandie). */
  compact: boolean
}

export interface TooltipState {
  x: number
  y: number
  title: string
  detail?: string
}

/** Props de survol à étaler sur un élément SVG pour afficher un tooltip. */
export interface HoverProps {
  onMouseMove: (event: MouseEvent<SVGElement>) => void
  onMouseLeave: () => void
}

export type HoverFactory = (title: string, detail?: string) => HoverProps

/** Marges minimales du tracé (px) : l'axe Y garde une gouttière de 24px pour ses graduations. */
export const MARGINS = { top: 20, right: 12, bottom: 28, left: 8 } as const
export const Y_TICK_GUTTER = 24
