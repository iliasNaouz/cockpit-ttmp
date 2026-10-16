import { useParams } from 'react-router-dom'
import { RequirePermission } from '@/auth/RequirePermission'
import { NotFound } from '@/components/shared/AccessDenied'
import { isSiteId } from '@/lib/sites'
import { ProjectDetailPage } from './ProjectDetailPage'

/** Valide `:siteId` puis contrôle l'accès au site avant d'afficher le détail. */
export function ProjectDetailRoute() {
  const { siteId } = useParams()
  if (!isSiteId(siteId)) return <NotFound />

  return (
    <RequirePermission module="projets" siteId={siteId}>
      <ProjectDetailPage siteId={siteId} />
    </RequirePermission>
  )
}
