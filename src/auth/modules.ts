import type { ModuleId } from '@/types/auth'

export interface ModuleMeta {
  id: ModuleId
  label: string
  description: string
  /** Libellé affiché dans la sidebar */
  navLabel: string
  route: string
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  ttmp: {
    id: 'ttmp',
    label: 'TTMP',
    navLabel: 'Tableau de bord',
    description: 'Production de vapeur, leviers et diagnostic de la ligne.',
    route: '/ttmp',
  },
  thermal: {
    id: 'thermal',
    label: 'Thermal',
    navLabel: 'Télémétrie & recos',
    description: 'Télémétrie prédictive et journal des recommandations.',
    route: '/thermal',
  },
  historique: {
    id: 'historique',
    label: 'Historique',
    navLabel: 'Historique leviers',
    description: 'Évolution des leviers, recommandations suivies et effets sur le procédé.',
    route: '/historique-leviers',
  },
  chat: {
    id: 'chat',
    label: 'Chat',
    navLabel: 'Chat',
    description: 'Assistant conversationnel sur les données vapeur.',
    route: '/chat',
  },
  projets: {
    id: 'projets',
    label: 'Projets',
    navLabel: 'Suivi de projet',
    description: 'Avancement du déploiement sur chaque site.',
    route: '/projets',
  },
  utilisateurs: {
    id: 'utilisateurs',
    label: 'Utilisateurs',
    navLabel: 'Utilisateurs',
    description: 'Comptes, rôles et accès par site et par module.',
    route: '/utilisateurs',
  },
}

/** Ordre d'affichage (sidebar, matrices). */
export const MODULE_ORDER: ModuleId[] = ['ttmp', 'thermal', 'historique', 'chat', 'projets', 'utilisateurs']
