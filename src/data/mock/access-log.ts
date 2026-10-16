import type { AccessLogEntry, AccessLogType } from '@/types/auth'
import type { SiteId } from '@/types/domain'

const HOUR = 3_600_000

interface Seed {
  userId: string
  userName: string
  type: AccessLogType
  detail: string
  site: SiteId | null
}

const SEEDS: Seed[] = [
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-03', userName: 'Karim Benali', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-04', userName: 'Sophie Durand', type: 'acces_refuse', detail: '/utilisateurs refusé', site: 'rouen' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'droits_modifies', detail: 'Projets : lecture → écriture', site: null },
  { userId: 'u-02', userName: 'Claire Martin', type: 'connexion', detail: 'Connexion par email', site: 'rouen' },
  { userId: 'u-03', userName: 'Karim Benali', type: 'deconnexion', detail: 'Déconnexion', site: 'begles' },
  { userId: 'u-03', userName: 'Karim Benali', type: 'acces_refuse', detail: '/utilisateurs refusé', site: 'begles' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'invitation', detail: 'Invitation envoyée à npetit@demo.fr', site: null },
  { userId: 'u-05', userName: 'Julie Lefèvre', type: 'connexion', detail: 'Connexion par email', site: 'rouen' },
  { userId: 'u-06', userName: 'Marc Dubois', type: 'connexion', detail: 'Connexion par email', site: 'rouen' },
  { userId: 'u-06', userName: 'Marc Dubois', type: 'acces_refuse', detail: '/chat refusé', site: 'rouen' },
  { userId: 'u-07', userName: 'Amina Haddad', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'droits_modifies', detail: 'Thermal : lecture → écriture', site: null },
  { userId: 'u-02', userName: 'Claire Martin', type: 'deconnexion', detail: 'Déconnexion', site: 'rouen' },
  { userId: 'u-08', userName: 'Thomas Girard', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-08', userName: 'Thomas Girard', type: 'acces_refuse', detail: '/chat refusé', site: 'begles' },
  { userId: 'u-09', userName: 'Léa Moreau', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'invitation', detail: 'Invitation envoyée à croux@demo.fr', site: null },
  { userId: 'u-04', userName: 'Sophie Durand', type: 'connexion', detail: 'Connexion par email', site: 'rouen' },
  { userId: 'u-04', userName: 'Sophie Durand', type: 'deconnexion', detail: 'Déconnexion', site: 'rouen' },
  { userId: 'u-12', userName: 'Paul Fontaine', type: 'acces_refuse', detail: 'Compte désactivé', site: 'begles' },
  { userId: 'u-05', userName: 'Julie Lefèvre', type: 'deconnexion', detail: 'Déconnexion', site: 'rouen' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'droits_modifies', detail: 'Chat : lecture → écriture', site: null },
  { userId: 'u-07', userName: 'Amina Haddad', type: 'deconnexion', detail: 'Déconnexion', site: 'begles' },
  { userId: 'u-03', userName: 'Karim Benali', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-09', userName: 'Léa Moreau', type: 'deconnexion', detail: 'Déconnexion', site: 'begles' },
  { userId: 'u-02', userName: 'Claire Martin', type: 'connexion', detail: 'Connexion par email', site: 'begles' },
  { userId: 'u-06', userName: 'Marc Dubois', type: 'deconnexion', detail: 'Déconnexion', site: 'rouen' },
  { userId: 'u-01', userName: 'Ilias Naouz', type: 'connexion', detail: 'Connexion par email', site: 'rouen' },
  { userId: 'u-08', userName: 'Thomas Girard', type: 'deconnexion', detail: 'Déconnexion', site: 'begles' },
]

/** 30 entrées réparties sur les 7 derniers jours (les plus récentes en premier). */
export function buildAccessLog(now: number = Date.now()): AccessLogEntry[] {
  return SEEDS.map((seed, index) => ({
    id: `log-${String(index + 1).padStart(3, '0')}`,
    timestamp: new Date(now - (index * 5.5 + 0.4) * HOUR).toISOString(),
    ...seed,
    ip: `10.24.${(index * 7) % 40}.${12 + ((index * 13) % 200)}`,
  }))
}
