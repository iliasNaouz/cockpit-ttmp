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
