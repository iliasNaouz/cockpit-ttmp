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

/**
 * Blocs de diagnostic : fond blanc ; seules la barre gauche et le label portent la couleur.
 * Seule l'Action recommandée a un fond très légèrement teinté (`tinted`) pour la repérer en premier.
 */
/**
 * Blocs de diagnostic : fond teinté doux, barre gauche + label colorés.
 * L'Action recommandée est mise en avant (barre plus épaisse, ombre) côté composant.
 */
export const DIAGNOSTIC_BLOCK_STYLES = {
  diagnostic: { box: 'bg-brand-soft border-brand-border border-l-brand-accent', label: 'text-brand' },
  action: { box: 'bg-success-bg border-success-border border-l-success-dot', label: 'text-success' },
  rationale: { box: 'bg-warning-bg border-warning-border border-l-warning-dot', label: 'text-warning' },
} as const

export const RATING_STYLES = {
  up: 'bg-rate-up-bg border-rate-up-border text-rate-up-icon',
  down: 'bg-rate-down-bg border-rate-down-border text-rate-down-icon',
  idle: 'bg-surface border-line text-predicted',
} as const

/** Statut d'un KPI : neutre (informatif) ou coloré quand la valeur sort de la cible. */
export type KpiStatus = 'normal' | 'bon' | 'surveiller' | 'alerte'

export const KPI_STATUS_STYLES: Record<KpiStatus, { bar: string; value: string }> = {
  normal: { bar: 'border-l-line', value: 'text-ink' },
  bon: { bar: 'border-l-success', value: 'text-ink' },
  surveiller: { bar: 'border-l-warning', value: 'text-warning' },
  alerte: { bar: 'border-l-danger', value: 'text-danger' },
}

export type KpiKind = 'neutre' | 'ecart' | 'o2' | 'stabilite'

/**
 * Statut d'un KPI à partir de sa valeur, selon les seuils métier.
 * Fonction pure : les bornes sont inclusives côté « meilleur ».
 */
export function getKpiStatus(kind: KpiKind, value: number): KpiStatus {
  switch (kind) {
    case 'ecart': {
      const magnitude = Math.abs(value)
      if (magnitude <= 0.5) return 'bon'
      if (magnitude <= 1.5) return 'surveiller'
      return 'alerte'
    }
    case 'o2':
      if (value >= 5) return 'bon'
      if (value >= 4.5) return 'surveiller'
      return 'alerte'
    case 'stabilite':
      if (value >= 95) return 'bon'
      if (value >= 85) return 'surveiller'
      return 'alerte'
    default:
      return 'normal'
  }
}

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
