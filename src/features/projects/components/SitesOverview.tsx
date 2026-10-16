import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '@/types/project'
import { SiteProjectCard } from './SiteProjectCard'

export function SitesOverview({ projects, loading }: { projects: Project[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    )
  }
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {projects.map((project) => (
        <SiteProjectCard key={project.siteId} project={project} />
      ))}
    </div>
  )
}
