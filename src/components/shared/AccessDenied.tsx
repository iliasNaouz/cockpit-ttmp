import { Compass, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card } from './Card'
import { EmptyState } from './EmptyState'

const HomeLink = () => (
  <Link to="/" className={cn(buttonVariants(), 'h-10 bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover')}>
    Retour à l'accueil
  </Link>
)

export function AccessDenied() {
  return (
    <div className="mx-auto w-full max-w-[1216px] px-6 py-10">
      <Card>
        <EmptyState
          icon={ShieldAlert}
          iconClassName="text-danger"
          circleClassName="bg-danger-bg"
          title="Accès refusé"
          description="Vous n'avez pas les droits nécessaires pour accéder à cette page. Contactez un administrateur."
          action={<HomeLink />}
        />
      </Card>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1216px] px-6 py-10">
      <Card>
        <EmptyState
          icon={Compass}
          title="Page introuvable"
          description="La page demandée n'existe pas ou a été déplacée."
          action={<HomeLink />}
        />
      </Card>
    </div>
  )
}
