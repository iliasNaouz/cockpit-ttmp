import type { Role } from '@/types/auth'

export const ROLE_LABELS: Record<Role, string> = {
  administrateur: 'Administrateur',
  chef_projet: 'Chef de projet',
  operateur: 'Opérateur',
  lecteur: 'Lecteur',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  administrateur: 'Gère les comptes, les droits et tous les sites.',
  chef_projet: 'Pilote le déploiement et consulte la production.',
  operateur: 'Agit sur les leviers et évalue les diagnostics.',
  lecteur: 'Consulte la production et le suivi en lecture seule.',
}

export const ROLE_STYLES: Record<Role, string> = {
  administrateur: 'bg-role-admin-bg border-role-admin-border text-role-admin-text',
  chef_projet: 'bg-role-chef-bg border-role-chef-border text-role-chef-text',
  operateur: 'bg-role-operateur-bg border-role-operateur-border text-role-operateur-text',
  lecteur: 'bg-role-lecteur-bg border-role-lecteur-border text-role-lecteur-text',
}

export const ROLE_ORDER: Role[] = ['administrateur', 'chef_projet', 'operateur', 'lecteur']
