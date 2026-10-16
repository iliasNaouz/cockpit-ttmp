import type { Evaluation, Rating } from '@/types/domain'

export type PartialEvaluation = Partial<Evaluation>

const SYMBOLS: Record<Rating, string> = { up: '👍', down: '👎' }

/** Toutes les notes sont renseignées : l'évaluation peut être validée. */
export function isEvaluationComplete(ratings: PartialEvaluation): ratings is Evaluation {
  return ratings.diagnostic !== undefined && ratings.action !== undefined && ratings.why !== undefined
}

/** `Diag: 👍 | Reco: — | Expl: 👎` */
export function formatEvaluationStatus(ratings: PartialEvaluation): string {
  const show = (rating: Rating | undefined) => (rating ? SYMBOLS[rating] : '—')
  return `Diag: ${show(ratings.diagnostic)} | Reco: ${show(ratings.action)} | Expl: ${show(ratings.why)}`
}
