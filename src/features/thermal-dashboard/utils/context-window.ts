import type { Recommendation } from '@/types/domain'

/** Recommandations situées à ± `minutes` minutes de la recommandation `id`. */
export function getContextWindow(recos: Recommendation[], id: string, minutes = 15): Recommendation[] {
  const target = recos.find((reco) => reco.id === id)
  if (!target) return []
  const center = new Date(target.timestamp).getTime()
  const span = minutes * 60_000
  return recos.filter((reco) => Math.abs(new Date(reco.timestamp).getTime() - center) <= span)
}

/** Recommandation voisine dans la liste (−1 précédente, +1 suivante), `null` aux extrémités. */
export function getNeighbor(recos: Recommendation[], id: string, step: -1 | 1): Recommendation | null {
  const index = recos.findIndex((reco) => reco.id === id)
  if (index === -1) return null
  return recos[index + step] ?? null
}
