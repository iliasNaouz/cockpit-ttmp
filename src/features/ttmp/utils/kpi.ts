import type { KpiTone } from '@/components/shared/kpi-tones'

/** Écart (t/h) au-delà duquel le débit vapeur est jugé loin de la consigne. */
export const DELTA_WARNING_THRESHOLD = 1

/** Vert si l'écart absolu est inférieur ou égal à 1 t/h, orange au-delà. */
export function getDeltaTone(delta: number): KpiTone {
  return Math.abs(delta) <= DELTA_WARNING_THRESHOLD ? 'success' : 'warning'
}

/** Rouge sous le seuil d'O₂ (situation SIT-O2BAS), vert sinon. */
export function getO2Tone(o2: number, threshold: number): KpiTone {
  return o2 < threshold ? 'danger' : 'success'
}

export function isO2Low(o2: number, threshold: number): boolean {
  return o2 < threshold
}
