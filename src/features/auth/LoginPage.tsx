import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/auth-store'
import { firstAllowedRoute } from '@/auth/permissions'
import { Logo } from '@/components/layout/Logo'
import { BrandPanel } from './BrandPanel'
import { LoginForm } from './LoginForm'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from

  if (user) {
    return <Navigate to={from && from !== '/login' ? from : firstAllowedRoute(user)} replace />
  }

  return (
    <div className="grid min-h-dvh bg-page lg:grid-cols-2">
      <BrandPanel />
      <main className="flex flex-col items-center justify-center gap-6 p-6">
        <Logo className="lg:hidden" />
        <LoginForm />
      </main>
    </div>
  )
}
