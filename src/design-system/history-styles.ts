import type { KpiStatus } from './status-styles'
import type { ChangeOrigin, RecoOutcome } from '@/types/lever-history'

export interface OutcomeStyle {
  label: string
  /** Pill : fond, bordure, texte. */
  pill: string
  /** Couleur pleine (point, triangle) pour le rendu SVG. */
  color: string
  /** Couleur de barre de progression / segment. */
  bar: string
}

export const RECO_OUTCOME_STYLES: Record<RecoOutcome, OutcomeStyle> = {
  suivie: {
    label: 'Suivie',
    pill: 'bg-success-bg border-success-border text-success',
    color: 'var(--color-success)',
    bar: 'bg-success',
  },
  partielle: {
    label: 'Partielle',
    pill: 'bg-warning-bg border-warning-border text-warning',
    color: 'var(--color-warning)',
    bar: 'bg-warning',
  },
  contraire: {
    label: 'Contraire',
    pill: 'bg-danger-bg border-danger-border text-danger',
    color: 'var(--color-danger)',
    bar: 'bg-danger',
  },
  ignoree: {
    label: 'Ignorée',
    pill: 'bg-surface-muted border-line text-ink-sub',
    color: 'var(--color-ink-mute)',
    bar: 'bg-ink-mute',
  },
}

export const CHANGE_ORIGIN_STYLES: Record<ChangeOrigin, OutcomeStyle> = {
  suite_reco: {
    label: 'Suite à une reco',
    pill: 'bg-success-bg border-success-border text-success',
    color: 'var(--color-success)',
    bar: 'bg-success',
  },
  initiative: {
    label: 'Initiative',
    pill: 'bg-initiative-bg border-initiative-border text-initiative-text',
    color: 'var(--color-initiative)',
    bar: 'bg-initiative',
  },
}

/** Couleur d'une marche sur la timeline : rouge si contre-sens, sinon selon l'origine. */
export function changeMarkerColor(origin: ChangeOrigin, outcome?: RecoOutcome): string {
  if (outcome === 'contraire') return RECO_OUTCOME_STYLES.contraire.color
  return CHANGE_ORIGIN_STYLES[origin].color
}

/** Statut du KPI « taux de suivi » : seuils 70 % et 40 %. */
export function getFollowUpStatus(rate: number): KpiStatus {
  if (rate >= 70) return 'bon'
  if (rate >= 40) return 'surveiller'
  return 'alerte'
}
