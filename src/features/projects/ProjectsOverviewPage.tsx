import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect'
import { Button } from '@/components/ui/button'
import { ActivityFeed } from './components/ActivityFeed'
import { ProjectKpis } from './components/ProjectKpis'
import { SitesOverview } from './components/SitesOverview'
import { useProjects } from './hooks/useProjects'
import { computeOverviewKpis, getLatestActivity, projectsToCsv } from './utils/project-utils'

type Period = '1' | '3' | '6'

const PERIODS: FilterOption<Period>[] = [
  { value: '1', label: 'Dernier mois' },
  { value: '3', label: '3 derniers mois' },
  { value: '6', label: '6 derniers mois' },
]

function exportCsv(csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'suivi-de-projet.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function ProjectsOverviewPage() {
  const { data, isLoading } = useProjects()
  const [period, setPeriod] = useState<Period>('3')
  const projects = useMemo(() => data ?? [], [data])
  const kpis = useMemo(() => computeOverviewKpis(projects), [projects])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Suivi de projet</h2>
          <p className="mt-0.5 text-[13px] text-ink-sub">Avancement du déploiement de la solution sur chaque site.</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect label="Période" value={period} options={PERIODS} onChange={setPeriod} />
          <Button variant="outline" className="h-9 rounded-lg" disabled={projects.length === 0} onClick={() => exportCsv(projectsToCsv(projects))}>
            <Download aria-hidden /> Exporter
          </Button>
        </div>
      </div>

      <ProjectKpis
        items={[
          { value: String(kpis.sites), label: kpis.sites > 1 ? 'Sites' : 'Site', tone: 'brand' },
          { value: String(kpis.averageProgress), unit: '%', label: 'Avancement moyen', tone: 'brand' },
          { value: String(kpis.averagePositiveRate), unit: '%', label: 'Recos évaluées positivement', tone: 'success' },
          { value: String(kpis.openRisks), label: kpis.openRisks > 1 ? 'Risques ouverts' : 'Risque ouvert', tone: 'warning' },
        ]}
      />
      <SitesOverview projects={projects} loading={isLoading} />
      <ActivityFeed events={getLatestActivity(projects)} />
    </div>
  )
}
