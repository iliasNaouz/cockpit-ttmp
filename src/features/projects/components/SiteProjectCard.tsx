import { Link } from 'react-router-dom'
import { MonoValue } from '@/components/shared/MonoValue'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { formatDayMonth } from '@/lib/format'
import type { Project } from '@/types/project'
import { formatPhaseLabel } from '../utils/project-utils'
import { HealthPill } from './HealthPill'
import { PhaseStepper } from './PhaseStepper'

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <MonoValue className="block text-sm font-bold text-ink">{value}</MonoValue>
      <span className="text-[11px] text-ink-sub">{label}</span>
    </div>
  )
}

/** Carte d'un site : santé, phase, avancement, stepper compact, statistiques et équipe. */
export function SiteProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projets/${project.siteId}`}
      className="block rounded-xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-bold text-ink">{project.name}</h2>
        <HealthPill health={project.health} />
      </div>
      <p className="mt-1 text-xs text-ink-sub">{formatPhaseLabel(project)}</p>

      <div className="mt-4 flex items-center gap-4">
        <ProgressBar value={project.progress} size="md" label={`Avancement ${project.name}`} />
        <MonoValue className="text-xl font-bold text-brand">{project.progress}%</MonoValue>
      </div>

      <div className="mt-4">
        <PhaseStepper phases={project.phases} variant="compact" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat label="Taux d'adoption" value={`${project.adoption}%`} />
        <MiniStat label="Disponibilité agent" value={`${project.availability}%`} />
        <MiniStat label="Prochain jalon" value={formatDayMonth(project.nextMilestoneDate)} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3">
        <div className="flex items-center gap-2">
          <UserAvatar name={project.manager.name} size="sm" />
          <span className="text-xs text-ink-body">{project.manager.name}</span>
          <div className="ml-2 flex -space-x-1.5">
            {project.team.slice(1, 4).map((member) => (
              <UserAvatar key={member.id} name={member.name} size="sm" className="ring-2 ring-surface" />
            ))}
          </div>
        </div>
        <span className="text-[13px] font-semibold text-brand">Voir le détail →</span>
      </div>
    </Link>
  )
}
