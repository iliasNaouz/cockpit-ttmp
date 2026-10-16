import { useCallback, useMemo, useState, type ReactNode } from 'react'
import * as api from '@/data/services/api'
import type { Session, User } from '@/types/auth'
import { AuthContext, readSession, writeSession, type AuthContextValue } from './auth-store'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession())

  const applySession = useCallback((next: Session | null) => {
    writeSession(next)
    setSession(next)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      applySession(await api.login(email, password))
    },
    [applySession],
  )

  const loginWithMicrosoft = useCallback(async () => {
    applySession(await api.loginWithMicrosoft())
  }, [applySession])

  const logout = useCallback(async () => {
    if (session) await api.logout(session.user.id)
    applySession(null)
  }, [applySession, session])

  const updateSessionUser = useCallback(
    (user: User) => {
      applySession({ user, createdAt: session?.createdAt ?? new Date().toISOString() })
    },
    [applySession, session],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, login, loginWithMicrosoft, logout, updateSessionUser }),
    [session, login, loginWithMicrosoft, logout, updateSessionUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
