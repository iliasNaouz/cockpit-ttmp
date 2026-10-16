import { createContext, useContext } from 'react'
import type { Session, User } from '@/types/auth'

export interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  logout: () => Promise<void>
  /** Met à jour l'utilisateur en session (ex. après modification de ses propres droits). */
  updateSessionUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const SESSION_KEY = 'vsd.session'

export function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (isSession(parsed)) return parsed
  } catch {
    // session illisible : on repart déconnecté
  }
  return null
}

export function writeSession(session: Session | null): void {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // stockage indisponible : la session reste en mémoire
  }
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null || !('user' in value)) return false
  const user = (value as { user: unknown }).user
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'role' in user &&
    'overrides' in user &&
    'sites' in user
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}

/** Utilisateur connecté, garanti non nul (à utiliser sous RequireAuth). */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error('Aucun utilisateur connecté')
  return user
}
