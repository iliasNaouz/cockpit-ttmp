export { getKpiStatus, type KpiKind, type KpiStatus } from '@/design-system/status-styles'

/** O₂ sous le seuil bas (situation SIT-O2BAS) : badge et mise en alerte de la tuile. */
export function isO2Low(o2: number, threshold = 5): boolean {
  return o2 < threshold
}
