import type { ActivityEvent, Milestone, Project, Task, TaskStatus } from '@/types/project'

export interface OverviewKpis {
  sites: number
  averageProgress: number
  averagePositiveRate: number
  openRisks: number
}

/** Moyenne arrondie à l'entier, 0 pour une liste vide. */
function average(values: number[]): number {
  return values.length === 0 ? 0 : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function computeOverviewKpis(projects: Project[]): OverviewKpis {
  return {
    sites: projects.length,
    averageProgress: average(projects.map((project) => project.progress)),
    averagePositiveRate: average(projects.map((project) => project.positiveRate)),
    openRisks: projects.reduce((sum, project) => sum + project.risks.filter((risk) => risk.status === 'ouvert').length, 0),
  }
}

export const TASK_COLUMNS: Array<{ status: TaskStatus; label: string }> = [
  { status: 'a_faire', label: 'À faire' },
  { status: 'en_cours', label: 'En cours' },
  { status: 'en_revue', label: 'En revue' },
  { status: 'termine', label: 'Terminé' },
]

export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = { a_faire: [], en_cours: [], en_revue: [], termine: [] }
  for (const task of tasks) groups[task.status].push(task)
  return groups
}

/** Échéance dépassée (jour calendaire) et tâche non terminée. */
export function isOverdue(dueDate: string, status: TaskStatus, now: Date = new Date()): boolean {
  if (status === 'termine') return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return new Date(dueDate).getTime() < today.getTime()
}

/** Jalons non terminés à venir, du plus proche au plus lointain (les retards d'abord). */
export function getNextMilestones(milestones: Milestone[], limit = 3): Milestone[] {
  return milestones
    .filter((milestone) => milestone.status !== 'termine')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit)
}

/** Évènements les plus récents, tous sites confondus. */
export function getLatestActivity(projects: Project[], limit = 10): ActivityEvent[] {
  return projects
    .flatMap((project) => project.activity)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}

export function projectsToCsv(projects: Project[]): string {
  const header = 'Site;Phase;Avancement (%);Adoption (%);Évaluations positives (%);Disponibilité (%)'
  const rows = projects.map((project) =>
    [project.name, project.currentPhase, project.progress, project.adoption, project.positiveRate, project.availability].join(';'),
  )
  return [header, ...rows].join('\n')
}

/** Libellé « Phase 4 / 6 · Pilote » */
export function formatPhaseLabel(project: Project): string {
  const phase = project.phases.find((candidate) => candidate.id === project.currentPhase)
  return `Phase ${project.currentPhase} / ${project.phases.length} · ${phase?.title.split(' ')[0] ?? ''}`.trim()
}
