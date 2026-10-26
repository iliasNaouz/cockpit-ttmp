import { CloudFog, Flame, Settings, Wind, Wrench } from 'lucide-react'
import type { UnderlineTabOption } from '@/components/shared/UnderlineTabs'
import type { LeverTab } from '@/types/domain'

export const LEVER_TABS: UnderlineTabOption<LeverTab>[] = [
  { value: 'alimentateurs', label: 'Alimentateurs', icon: Wrench },
  { value: 'grilles', label: 'Grilles', icon: Settings },
  { value: 'air', label: 'Air', icon: Wind },
  { value: 'combustion', label: 'Combustion', icon: Flame },
  { value: 'vapeur', label: 'Vapeur', icon: CloudFog },
]

/** Découpage de la piste des sliders (en % de la course). */
export const SLIDER_ZONES = { lowEnd: 20, highStart: 80 } as const

/** Correspondance slider TTMP → levier de l'historique (quand il existe). */
export const SLIDER_TO_HISTORY: Record<string, string> = {
  'air-primaire-z2': 'BEG2244',
  'air-primaire-z1': 'AIR_Z1',
  'air-secondaire': 'AIR_SECONDAIRE',
  'alim-vitesse-sup': 'ALIM_SUP',
  'alim-vitesse-inf': 'ALIM_INF',
  'grille-vitesse-1': 'GRILLE_V1',
  'grille-vitesse-2': 'GRILLE_V2',
  'grille-vitesse-3': 'GRILLE_V3',
  'comb-o2': 'O2_CONSIGNE',
  'comb-depression': 'DEPRESSION',
  'vap-debit': 'VAP_CONSIGNE',
  'vap-ballon': 'BALLON',
}
