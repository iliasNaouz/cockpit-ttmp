import type { AccessLevel, UserStatus } from '@/types/auth'
import type { Direction, O2Status } from '@/types/domain'
import type {
  Health,
  MilestoneStatus,
  RiskSeverity,
  RiskStatus,
  TaskCategory,
  TaskPriority,
} from '@/types/project'

/** Styles de pill génériques (fond, bordure, texte). */
export const PILL = {
  success: 'bg-success-bg border-success-border text-success',
  warning: 'bg-warning-bg border-warning-border text-warning',
  danger: 'bg-danger-bg border-danger-border text-danger',
  brand: 'bg-brand-soft border-brand-border text-brand',
  neutral: 'bg-surface-muted border-line text-ink-sub',
} as const

export const DIRECTION_STYLES: Record<Direction, string> = {
  Up: 'bg-success-bg border-success-border text-success',
  Down: 'bg-danger-bg border-danger-border text-danger',
  Hold: 'bg-surface-muted border-transparent text-ink-sub',
}

export const O2_STYLES: Record<O2Status, string> = {
  safe: 'bg-success-bg border-success-border text-success-strong',
  near: 'bg-o2-near-bg border-o2-near-border text-o2-near-text',
  alert: 'bg-alert-bg border-alert-border text-alert-text',
}

/** Couleur de texte d'une valeur O₂ selon son statut. */
export const O2_TEXT: Record<O2Status, string> = {
  safe: 'text-success-strong',
  near: 'text-o2-near-text',
  alert: 'text-alert-text',
}

export const O2_DOT = {
  safe: 'bg-success-dot',
  alert: 'bg-danger-dot',
} as const

export const DIAGNOSTIC_BLOCK_STYLES = {
  diagnostic: {
    box: 'bg-diag-info-bg border-l-diag-info-border',
    label: 'text-diag-info-label',
    fade: 'from-diag-info-bg',
  },
  action: {
    box: 'bg-diag-action-bg border-l-diag-action-border',
    label: 'text-diag-action-label',
    fade: 'from-diag-action-bg',
  },
  why: {
    box: 'bg-diag-why-bg border-l-diag-why-border',
    label: 'text-diag-why-label',
    fade: 'from-diag-why-bg',
  },
} as const

export const RATING_STYLES = {
  up: 'bg-rate-up-bg border-rate-up-border text-rate-up-icon',
  down: 'bg-rate-down-bg border-rate-down-border text-rate-down-icon',
  idle: 'bg-surface border-line text-predicted',
} as const

export const HEALTH_STYLES: Record<Health, { label: string; pill: string }> = {
  en_bonne_voie: { label: 'En bonne voie', pill: DIRECTION_STYLES.Up },
  a_surveiller: { label: 'À surveiller', pill: PILL.warning },
  en_retard: { label: 'En retard', pill: DIRECTION_STYLES.Down },
}

export const MILESTONE_STYLES: Record<MilestoneStatus, { label: string; pill: string }> = {
  termine: { label: 'Terminé', pill: DIRECTION_STYLES.Up },
  en_cours: { label: 'En cours', pill: PILL.brand },
  a_venir: { label: 'À venir', pill: DIRECTION_STYLES.Hold },
  en_retard: { label: 'En retard', pill: DIRECTION_STYLES.Down },
}

export const SEVERITY_STYLES: Record<RiskSeverity, { label: string; pill: string }> = {
  critique: { label: 'Critique', pill: DIRECTION_STYLES.Down },
  elevee: { label: 'Élevée', pill: PILL.warning },
  moderee: { label: 'Modérée', pill: PILL.brand },
  faible: { label: 'Faible', pill: DIRECTION_STYLES.Hold },
}

export const RISK_STATUS_LABELS: Record<RiskStatus, string> = {
  ouvert: 'Ouvert',
  maitrise: 'Maîtrisé',
  clos: 'Clos',
}

export const PRIORITY_DOT: Record<TaskPriority, { label: string; dot: string }> = {
  haute: { label: 'Priorité haute', dot: 'bg-danger-dot' },
  moyenne: { label: 'Priorité moyenne', dot: 'bg-warning-dot' },
  basse: { label: 'Priorité basse', dot: 'bg-ink-mute' },
}

export const CATEGORY_PILL: Record<TaskCategory, string> = {
  Données: 'bg-pill-poussoir-bg border-pill-poussoir-border text-pill-poussoir-text',
  Modèle: 'bg-pill-manuelle-bg border-pill-manuelle-border text-pill-manuelle-text',
  Interface: 'bg-pill-air-bg border-pill-air-border text-pill-air-text',
  Formation: 'bg-pill-grille-bg border-pill-grille-border text-pill-grille-text',
  Infra: 'bg-pill-pression-bg border-pill-pression-border text-pill-pression-text',
}

export const USER_STATUS_STYLES: Record<UserStatus, { label: string; dot: string }> = {
  actif: { label: 'Actif', dot: 'bg-success-dot' },
  invite: { label: 'Invité', dot: 'bg-warning-dot' },
  desactive: { label: 'Désactivé', dot: 'bg-ink-mute' },
}

export const ACCESS_LEVEL_STYLES: Record<
  AccessLevel,
  { label: string; pill: string; icon: string }
> = {
  ecriture: { label: 'Écriture', pill: DIRECTION_STYLES.Up, icon: 'text-success' },
  lecture: { label: 'Lecture', pill: PILL.brand, icon: 'text-brand' },
  aucun: { label: 'Aucun', pill: DIRECTION_STYLES.Hold, icon: 'text-ink-mute opacity-40' },
}
