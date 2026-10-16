import type { Role } from '@/types/auth'

export interface DemoAccount {
  name: string
  email: string
  password: string
  role: Role
}

/** Comptes de démonstration affichés uniquement en mode développement. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { name: 'Ilias Naouz', email: 'admin@demo.fr', password: 'demo1234', role: 'administrateur' },
  { name: 'Claire Martin', email: 'chef@demo.fr', password: 'demo1234', role: 'chef_projet' },
  { name: 'Karim Benali', email: 'operateur@demo.fr', password: 'demo1234', role: 'operateur' },
  { name: 'Sophie Durand', email: 'lecteur@demo.fr', password: 'demo1234', role: 'lecteur' },
]
