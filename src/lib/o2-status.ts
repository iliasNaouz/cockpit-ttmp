import type { O2Status } from '@/types/domain'

export const O2_NEAR_THRESHOLD = 6.5
export const O2_ALERT_THRESHOLD = 7

/** Safe (< 6.5 %), proche du seuil (6.5–7 %), alerte (≥ 7 %). */
export function getO2Status(o2: number): O2Status {
  if (o2 >= O2_ALERT_THRESHOLD) return 'alert'
  if (o2 >= O2_NEAR_THRESHOLD) return 'near'
  return 'safe'
}
