import { Card } from '@/components/shared/Card'
import { MonoValue } from '@/components/shared/MonoValue'
import type { Project } from '@/types/project'
import { getNextMilestones } from '../utils/project-utils'
import { ActivityFeed } from './ActivityFeed'
import { AdoptionChart } from './AdoptionChart'
import { SeverityPill } from './RisksList'

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function CalendarBlock({ date }: { date: string }) {
  const parsed = new Date(date)
  return (
    <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-soft text-brand">
      <MonoValue className="text-base leading-none font-bold">{parsed.getDate()}</MonoValue>
      <span className="text-[10px] font-semibold uppercase">{MONTHS[parsed.getMonth()]}</span>
    </div>
  )
}

export function ProjectOverviewTab({ project }: { project: Project }) {
  const nextMilestones = getNextMilestones(project.milestones)
  const openRisks = project.risks.filter((risk) => risk.status === 'ouvert')

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2"><AdoptionChart weeks={project.adoptionWeeks} /></div>

      <Card className="p-5">
        <h2 className="text-[15px] font-bold text-ink">Prochains jalons</h2>
        <ul className="mt-3 space-y-3">
          {nextMilestones.map((milestone) => (
            <li key={milestone.id} className="flex items-center gap-3">
              <CalendarBlock date={milestone.dueDate} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{milestone.title}</p>
                <p className="text-xs text-ink-sub">{milestone.owner}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="text-[15px] font-bold text-ink">Risques ouverts</h2>
        {openRisks.length === 0 ? (
          <p className="mt-3 text-[13px] text-ink-sub">Aucun risque ouvert.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {openRisks.map((risk) => (
              <li key={risk.id} className="flex items-start justify-between gap-3">
                <p className="text-[13px] text-ink-body">{risk.title}</p>
                <SeverityPill severity={risk.severity} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="lg:col-span-2">
        <ActivityFeed events={project.activity} showSite={false} />
      </div>
    </div>
  )
}
