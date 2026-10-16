import type { LeverName, RecommendedLever } from '@/types/domain'

export interface LeverStyle {
  /** Classe de fond de la barre de répartition et de la barre de progression */
  bar: string
  /** Classe de fond du point de légende */
  dot: string
  /** Classe de fond du chip de timeline */
  chip: string
  /** Classes de la pill (fond, bordure, texte) */
  pill: string
  /** Variable CSS de la couleur pleine (pour Recharts / SVG) */
  color: string
}

export const LEVER_STYLES: Record<RecommendedLever, LeverStyle> = {
  Poussoir: {
    bar: 'bg-lever-poussoir',
    dot: 'bg-lever-poussoir',
    chip: 'bg-chip-poussoir',
    pill: 'bg-pill-poussoir-bg border-pill-poussoir-border text-pill-poussoir-text',
    color: 'var(--color-lever-poussoir)',
  },
  'Air Secondaire': {
    bar: 'bg-lever-air',
    dot: 'bg-lever-air',
    chip: 'bg-chip-air',
    pill: 'bg-pill-air-bg border-pill-air-border text-pill-air-text',
    color: 'var(--color-lever-air)',
  },
  'Action Manuelle': {
    bar: 'bg-lever-manuelle',
    dot: 'bg-lever-manuelle',
    chip: 'bg-chip-manuelle',
    pill: 'bg-pill-manuelle-bg border-pill-manuelle-border text-pill-manuelle-text',
    color: 'var(--color-lever-manuelle)',
  },
  Grille: {
    bar: 'bg-lever-grille',
    dot: 'bg-lever-grille',
    chip: 'bg-chip-grille',
    pill: 'bg-pill-grille-bg border-pill-grille-border text-pill-grille-text',
    color: 'var(--color-lever-grille)',
  },
  Pression_Z2: {
    bar: 'bg-lever-pression',
    dot: 'bg-lever-pression',
    chip: 'bg-chip-pression',
    pill: 'bg-pill-pression-bg border-pill-pression-border text-pill-pression-text',
    color: 'var(--color-lever-pression)',
  },
  'Non défini': {
    bar: 'bg-lever-undef',
    dot: 'bg-lever-undef',
    chip: 'bg-chip-undef',
    pill: 'bg-surface-muted border-line text-ink-sub',
    color: 'var(--color-lever-undef)',
  },
  'Timeout Error': {
    bar: 'bg-lever-undef',
    dot: 'bg-lever-undef',
    chip: 'bg-chip-undef',
    pill: 'bg-alert-bg border-alert-border text-alert-text',
    color: 'var(--color-alert-text)',
  },
}

/** Ordre d'affichage des leviers dans la répartition. */
export const LEVER_ORDER: LeverName[] = [
  'Poussoir',
  'Air Secondaire',
  'Action Manuelle',
  'Grille',
  'Pression_Z2',
  'Non défini',
]
