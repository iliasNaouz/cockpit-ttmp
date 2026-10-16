/**
 * Source unique côté TypeScript des tokens du design system.
 * Les valeurs sont des références `var(--…)` définies dans `src/index.css` :
 * aucune couleur hex ici ni dans les composants.
 */
export const fonts = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

export const colors = {
  page: 'var(--color-page)',
  surface: 'var(--color-surface)',
  surfaceMuted: 'var(--color-surface-muted)',
  line: 'var(--color-line)',
  lineSoft: 'var(--color-line-soft)',
  ink: 'var(--color-ink)',
  inkBody: 'var(--color-ink-body)',
  inkSub: 'var(--color-ink-sub)',
  inkMute: 'var(--color-ink-mute)',
  inkLabel: 'var(--color-ink-label)',
  brand: 'var(--color-brand)',
  brandHover: 'var(--color-brand-hover)',
  brandSoft: 'var(--color-brand-soft)',
  onBrand: 'var(--color-surface)',
  predicted: 'var(--color-predicted)',
  setpoint: 'var(--color-setpoint)',
  success: 'var(--color-success)',
  successDot: 'var(--color-success-dot)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  dangerDot: 'var(--color-danger-dot)',
} as const

export const radii = {
  card: 'var(--radius-xl)',
  control: 'var(--radius-lg)',
  pill: 'var(--radius-md)',
} as const

export const shadows = {
  card: 'var(--shadow-card)',
  tab: 'var(--shadow-tab)',
} as const

/** Contenu centré standard des pages. */
export const PAGE_CONTAINER = 'mx-auto w-full max-w-[1216px] px-6 py-4'
