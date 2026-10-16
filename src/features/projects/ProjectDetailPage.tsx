import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { usePermission } from '@/auth/usePermission'
import { Card } from '@/components/shared/Card'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { UnderlineTabs, type UnderlineTabOption } from '@/components/shared/UnderlineTabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SITES } from '@/lib/sites'
import type { SiteId } from '@/types/domain'
import { AddMilestoneDialog } from './components/AddMilestoneDialog'
import { HealthPill } from './components/HealthPill'
import { MilestonesTable } from './components/MilestonesTable'
import { PhaseStepper } from './components/PhaseStepper'
import { ProjectKpis } from './components/ProjectKpis'
import { ProjectOverviewTab } from './components/ProjectOverviewTab'
import { RisksList } from './components/RisksList'
import { SiteTeam } from './components/SiteTeam'
import { TasksBoard } from './components/TasksBoard'
import { useProject } from './hooks/useProjects'

type Tab = 'apercu' | 'jalons' | 'taches' | 'risques' | 'equipe'

const TABS: UnderlineTabOption<Tab>[] = [
  { value: 'apercu', label: "Vue d'ensemble" },
  { value: 'jalons', label: 'Jalons' },
  { value: 'taches', label: 'Tâches' },
  { value: 'risques', label: 'Risques' },
  { value: 'equipe', label: 'Équipe' },
]

export function ProjectDetailPage({ siteId }: { siteId: SiteId }) {
  const { data: project } = useProject(siteId)
  const { canWrite } = usePermission('projets')
  const [tab, setTab] = useState<Tab>('apercu')

  if (!project) return <Skeleton className="h-96 w-full" />

  return (
    <div className="space-y-6">
      <nav aria-label="Fil d'Ariane" className="text-xs text-ink-sub">
        <Link to="/projets" className="text-brand hover:underline">Suivi de projet</Link> / <span>{SITES[siteId].projectName}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">{project.name}</h2>
          <HealthPill health={project.health} />
        </div>
        <div className="flex items-center gap-2">
          <ReadOnlyGuard canWrite={canWrite}>
            <Button variant="outline" className="h-9 rounded-lg" disabled={!canWrite} onClick={() => toast.info("La modification du projet n'est pas disponible dans cette démo.")}>
              Modifier
            </Button>
          </ReadOnlyGuard>
          <AddMilestoneDialog siteId={siteId} project={project} />
        </div>
      </div>

      <Card className="p-5"><PhaseStepper phases={project.phases} /></Card>

      <ProjectKpis
        items={[
          { value: String(project.progress), unit: '%', label: 'Avancement', tone: 'brand' },
          { value: String(project.adoption), unit: '%', label: "Taux d'adoption des recos", tone: 'brand' },
          { value: String(project.positiveRate), unit: '%', label: 'Évaluations positives', tone: 'success' },
          { value: String(project.availability), unit: '%', label: "Disponibilité de l'agent", tone: 'success' },
        ]}
      />

      <UnderlineTabs options={TABS} value={tab} onChange={setTab} ariaLabel="Sections du projet" />
      <div role="tabpanel">
        {tab === 'apercu' && <ProjectOverviewTab project={project} />}
        {tab === 'jalons' && <MilestonesTable milestones={project.milestones} phases={project.phases} />}
        {tab === 'taches' && <TasksBoard siteId={siteId} tasks={project.tasks} />}
        {tab === 'risques' && <RisksList risks={project.risks} />}
        {tab === 'equipe' && <SiteTeam team={project.team} />}
      </div>
    </div>
  )
}
