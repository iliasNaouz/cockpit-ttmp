import { useLocation } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import { getPageTitle } from './page-titles'
import { UserInfoInline } from './UserInfoInline'

/** Carte d'en-tête pleine largeur (52px) : titre, utilisateur, e-mail, date-heure. */
export function PageHeader() {
  const { pathname } = useLocation()

  return (
    <Card className="flex min-h-[52px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
      <h1 className="text-[15px] font-bold text-ink">{getPageTitle(pathname)}</h1>
      <UserInfoInline />
    </Card>
  )
}
