import type { SliderLever } from '@/types/domain'

export const SLIDER_LEVERS: SliderLever[] = [
  // Alimentateurs
  { id: 'alim-vitesse-sup', tab: 'alimentateurs', label: 'Vitesse Alimentateur Supérieur', value: 20 },
  { id: 'alim-vitesse-inf', tab: 'alimentateurs', label: 'Vitesse Alimentateur Inférieur', value: 20 },
  { id: 'alim-course-sup', tab: 'alimentateurs', label: 'Course Max Alimentateur Supérieur', value: 70 },
  { id: 'alim-course-inf', tab: 'alimentateurs', label: 'Course Max Alimentateur Inférieur', value: 70 },
  { id: 'alim-avancee', tab: 'alimentateurs', label: 'Vitesse Avancée Alimentateurs', value: 22 },
  { id: 'alim-recul', tab: 'alimentateurs', label: 'Vitesse Recul Alimentateurs', value: 78 },
  // Grilles
  { id: 'grille-vitesse-1', tab: 'grilles', label: 'Vitesse grille 1', value: 45 },
  { id: 'grille-vitesse-2', tab: 'grilles', label: 'Vitesse grille 2', value: 50 },
  { id: 'grille-vitesse-3', tab: 'grilles', label: 'Vitesse grille 3', value: 55 },
  { id: 'grille-course', tab: 'grilles', label: 'Course max grille', value: 62 },
  // Air
  { id: 'air-primaire-z1', tab: 'air', label: 'Registre air primaire Z1', value: 48 },
  { id: 'air-primaire-z2', tab: 'air', label: 'Registre air primaire Z2', value: 50 },
  { id: 'air-primaire-z3', tab: 'air', label: 'Registre air primaire Z3', value: 46 },
  { id: 'air-secondaire', tab: 'air', label: 'Air secondaire', value: 35 },
  // Combustion
  { id: 'comb-o2', tab: 'combustion', label: 'Consigne O₂', value: 45 },
  { id: 'comb-depression', tab: 'combustion', label: 'Dépression foyer', value: 38 },
  { id: 'comb-temperature', tab: 'combustion', label: 'Consigne température foyer', value: 55 },
  { id: 'comb-dechets', tab: 'combustion', label: 'Débit déchets', value: 62 },
  // Vapeur
  { id: 'vap-debit', tab: 'vapeur', label: 'Consigne débit vapeur', value: 72 },
  { id: 'vap-ballon', tab: 'vapeur', label: 'Pression ballon', value: 66 },
  { id: 'vap-eau', tab: 'vapeur', label: 'Débit eau alimentaire', value: 58 },
  { id: 'vap-temperature', tab: 'vapeur', label: 'Température vapeur', value: 64 },
]
