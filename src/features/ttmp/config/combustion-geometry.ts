import type { PciKey } from '@/design-system/chart-theme'

export interface Point {
  x: number
  y: number
}

export interface LabeledPoint extends Point {
  id: string
}

export interface DiagramDomain {
  x: [number, number]
  y: [number, number]
  xTicks: number[]
  yTicks: number[]
}

/** Vue compacte resserrée autour de la zone utile ; la vue agrandie garde le domaine complet. */
export const COMPACT_DOMAIN: DiagramDomain = {
  x: [4, 14],
  y: [10, 35],
  xTicks: [4, 6, 8, 10, 12, 14],
  yTicks: [10, 15, 20, 25, 30, 35],
}

export const FULL_DOMAIN: DiagramDomain = {
  x: [4, 16],
  y: [10, 40],
  xTicks: [4, 6, 8, 10, 12, 14, 16],
  yTicks: [10, 15, 20, 25, 30, 35, 40],
}

/** 1 kcal/h = 1,163 W : puissance (MW) = débit (t/h) × PCI (kcal/kg) × 0,001163. */
const KCAL_TO_MW = 0.001163

export function pciPower(pci: number, flow: number): number {
  return flow * pci * KCAL_TO_MW
}

export const PCI_LEVELS: ReadonlyArray<{ pci: PciKey; label: string }> = [
  { pci: 1400, label: 'PCI 1400 kcal/kg' },
  { pci: 1915, label: 'PCI 1915 kcal/kg' },
  { pci: 2114, label: 'PCI 2114 kcal/kg' },
  { pci: 2400, label: 'PCI 2400 kcal/kg' },
  { pci: 3000, label: 'PCI 3000 kcal/kg' },
]

export const POWER_LINES = [
  { value: 31, short: 'Pmax 31', label: 'Puissance maxi 31 MW' },
  { value: 28.2, short: 'Pnom 28,2', label: 'Puissance nominale 28,2 MW' },
  { value: 16.9, short: 'Pmin 16,9', label: 'Puissance mini 16,9 MW' },
] as const

export const LOAD_LINES = [
  { value: 6.6, short: 'Min 6,6', label: 'Charge minimale (6,6 t/h)' },
  { value: 11.4, short: 'Nom 11,4', label: 'Charge nominale (11,4 t/h)' },
  { value: 12.4, short: 'Max 12,4', label: 'Charge maximale (12,4 t/h)' },
] as const

/** Sommets A–G de la zone de fonctionnement nominal (bornée par PCI 1400/3000, puissances et charges). */
export const NOMINAL_POLYGON: LabeledPoint[] = [
  { id: 'A', x: 6.6, y: 16.9 },
  { id: 'B', x: 16.9 / pciPower(1400, 1), y: 16.9 },
  { id: 'C', x: 12.4, y: pciPower(1400, 12.4) },
  { id: 'D', x: 12.4, y: 28.2 },
  { id: 'E', x: 11.4, y: 31 },
  { id: 'F', x: 31 / pciPower(3000, 1), y: 31 },
  { id: 'G', x: 6.6, y: pciPower(3000, 6.6) },
]

/** Zone de surcharge : à droite de la charge maximale. */
export const OVERLOAD_POLYGON: Point[] = [
  { x: 12.4, y: pciPower(1400, 12.4) },
  { x: 14.2, y: pciPower(1400, 14.2) },
  { x: 14.2, y: 31 },
  { x: 11.4, y: 31 },
  { x: 12.4, y: 28.2 },
]

const ANNUAL_FLOW = 10.5
export const ANNUAL_PCI = 2150
export const ANNUAL_POINT: Point = { x: ANNUAL_FLOW, y: pciPower(ANNUAL_PCI, ANNUAL_FLOW) }
