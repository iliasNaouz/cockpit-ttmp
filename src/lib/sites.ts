import type { Site, SiteId } from '@/types/domain'

export const SITES: Record<SiteId, Site> = {
  rouen: {
    id: 'rouen',
    label: 'Rouen',
    lineName: 'FC1 Rouen',
    projectName: 'Rouen — Ligne 2',
  },
  begles: {
    id: 'begles',
    label: 'Bègles',
    lineName: 'FC1 Bègles',
    projectName: 'Bègles — FC1',
  },
}

export const SITE_IDS: SiteId[] = ['rouen', 'begles']

export function isSiteId(value: string | undefined | null): value is SiteId {
  return value === 'rouen' || value === 'begles'
}

/** Deux lettres du site en majuscules : « RO », « BÈ ». */
export function siteInitials(label: string): string {
  return label.slice(0, 2).toUpperCase()
}
