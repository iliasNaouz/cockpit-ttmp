import type { Direction } from './domain'

export type LeverId = string
export type LeverGroup = 'alimentateurs' | 'grilles' | 'air' | 'combustion' | 'vapeur'
export type LeverUnit = '%' | 'mbar' | 'tr/min' | '°C' | 't/h'

export interface LeverDef {
  id: LeverId
  label: string
  group: LeverGroup
  unit: LeverUnit
  min: number
  max: number
  /** Bornes des 3 zones (bleu / vert / orange), en valeur du levier. */
  zones: { low: number; high: number }
}

/** Point de mesure réelle : horodatage ISO, pas de 1 min. */
export interface LeverPoint {
  t: string
  value: number
}

export interface LeverSeries {
  leverId: LeverId
  points: LeverPoint[]
}

/** Source d'un changement de valeur réelle. */
export type ChangeSource = 'operateur' | 'regulation' | 'inconnu'

export interface LeverAnnotation {
  text: string
  author: string
  at: string
}

export interface LeverChange {
  id: string
  leverId: LeverId
  t: string
  from: number
  to: number
  delta: number
  source: ChangeSource
  annotation?: LeverAnnotation
}

/** Résultat du rapprochement d'une recommandation avec les changements. */
export type RecoOutcome = 'suivie' | 'partielle' | 'contraire' | 'ignoree'

/** Origine d'un changement : en réponse à une reco, ou de la propre initiative de l'opérateur. */
export type ChangeOrigin = 'suite_reco' | 'initiative'

export interface LeverReco {
  id: string
  leverId: LeverId
  t: string
  direction: Direction
  /** Valeur cible si le modèle la fournit (ex. 52 %). */
  target?: number
  text: string
}

export interface RecoMatch {
  recoId: string
  changeId?: string
  outcome: RecoOutcome
  /** Délai entre la reco et le changement rattaché (minutes). */
  delayMin?: number
}

/** Réponse du procédé après un changement. */
export interface ChangeEffect {
  changeId: string
  steamDelta15: number
  o2Delta15: number
  steamDelta30: number
  o2Delta30: number
}

/** Payload renvoyé par l'API pour une fenêtre de temps et un site. */
export interface LeverHistoryData {
  defs: LeverDef[]
  series: LeverSeries[]
  changes: LeverChange[]
  recos: LeverReco[]
  steam: LeverPoint[]
  o2: LeverPoint[]
}

export interface HistorySummary {
  changeCount: number
  operatorChangeCount: number
  recoCount: number
  outcomes: Record<RecoOutcome, number>
  followRate: number
  initiativeCount: number
  avgDelayMin: number
}
