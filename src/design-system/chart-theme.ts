import type { CSSProperties } from 'react'
import { colors, fonts } from './tokens'

/** Thème commun des graphiques Recharts : uniquement des références aux tokens. */
export const chartTheme = {
  grid: colors.surfaceMuted,
  axisTick: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fill: colors.inkSub,
  } satisfies CSSProperties,
  axisTickSmall: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fill: colors.inkSub,
  } satisfies CSSProperties,
  series: {
    actual: colors.brand,
    predicted: colors.predicted,
    setpoint: colors.setpoint,
    setpointLabel: colors.inkLabel,
    o2: colors.success,
    threshold: colors.dangerDot,
  },
  tooltip: {
    wrapper: 'rounded-lg border border-line bg-surface p-3 shadow-card text-xs',
    value: 'font-mono font-semibold text-ink',
    label: 'text-ink-sub',
  },
} as const

/** Couleurs du diagramme de combustion (droites PCI et zones). */
export const combustionTheme = {
  pci: {
    1400: 'var(--color-pci-1400)',
    1915: 'var(--color-pci-1915)',
    2114: 'var(--color-pci-2114)',
    2400: 'var(--color-pci-2400)',
    3000: 'var(--color-pci-3000)',
  },
  nominalFill: 'var(--color-nominal-fill)',
  nominalStroke: 'var(--color-nominal-stroke)',
  overloadFill: 'var(--color-overload-fill)',
  overloadStroke: 'var(--color-overload-stroke)',
  annualPoint: 'var(--color-annual-point)',
  refLine: colors.inkMute,
} as const

export type PciKey = keyof typeof combustionTheme.pci
