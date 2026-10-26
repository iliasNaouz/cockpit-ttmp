import type { Evaluation, Rating } from '@/types/domain'

export type PartialEvaluation = Partial<Evaluation>

export const EVALUATION_FIELDS = ['diagnostic', 'action', 'rationale'] as const
export type EvaluationField = (typeof EVALUATION_FIELDS)[number]

export const EVALUATION_LABELS: Record<EvaluationField, string> = {
  diagnostic: 'Diagnostic',
  action: 'Action recommandée',
  rationale: 'Pourquoi cette action',
}

/** Toutes les notes sont renseignées : l'évaluation peut être validée. */
export function isEvaluationComplete(ratings: PartialEvaluation): ratings is Evaluation {
  return EVALUATION_FIELDS.every((field) => ratings[field] !== undefined)
}

/** Nombre de blocs déjà évalués (0 à 3). */
export function countEvaluated(ratings: PartialEvaluation): number {
  return EVALUATION_FIELDS.filter((field) => ratings[field] !== undefined).length
}

const SYMBOLS: Record<Rating, string> = { up: '👍', down: '👎' }

/** `Diag: 👍 | Reco: — | Expl: 👎` (conservé pour les tests existants). */
export function formatEvaluationStatus(ratings: PartialEvaluation): string {
  const show = (rating: Rating | undefined) => (rating ? SYMBOLS[rating] : '—')
  return `Diag: ${show(ratings.diagnostic)} | Reco: ${show(ratings.action)} | Expl: ${show(ratings.rationale)}`
}
