import { useAuth } from '@/auth/auth-store'
import { MonoValue } from '@/components/shared/MonoValue'
import { formatDateTime } from '@/lib/format'
import { useNow } from '@/lib/use-now'

/** Nom | email | date-heure en mono (mise à jour chaque minute). */
export function UserInfoInline() {
  const { user } = useAuth()
  const now = useNow()
  if (!user) return null

  return (
    <div className="flex items-center divide-x divide-line text-xs">
      <span className="pr-3 font-semibold text-ink">
        {user.firstName} {user.lastName}
      </span>
      <span className="hidden px-3 text-ink-sub sm:inline">{user.email}</span>
      <MonoValue className="pl-3 text-ink-sub">{formatDateTime(now)}</MonoValue>
    </div>
  )
}
