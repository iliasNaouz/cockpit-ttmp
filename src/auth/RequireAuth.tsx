import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth-store'

/** Redirige vers /login quand personne n'est connecté. */
export function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <Outlet />
}
