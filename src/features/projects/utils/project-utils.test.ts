import { describe, expect, it } from 'vitest'
import { PROJECTS } from '@/data/mock/projects'
import {
  computeOverviewKpis,
  formatPhaseLabel,
  getLatestActivity,
  getNextMilestones,
  groupTasksByStatus,
  isOverdue,
  projectsToCsv,
} from './project-utils'

const [begles, rouen] = PROJECTS

describe('computeOverviewKpis', () => {
  it('calcule moyennes et risques ouverts à partir des données', () => {
    expect(computeOverviewKpis(PROJECTS)).toEqual({
      sites: 2,
      averageProgress: 60,
      averagePositiveRate: 78,
      openRisks: 3,
    })
  })

  it('gère l’absence de projet', () => {
    expect(computeOverviewKpis([])).toEqual({ sites: 0, averageProgress: 0, averagePositiveRate: 0, openRisks: 0 })
  })
})

describe('groupTasksByStatus', () => {
  it('répartit les 16 tâches de chaque site sur les 4 colonnes', () => {
    for (const project of PROJECTS) {
      const groups = groupTasksByStatus(project.tasks)
      const total = Object.values(groups).reduce((sum, tasks) => sum + tasks.length, 0)
      expect(total).toBe(16)
      expect(Object.values(groups).every((tasks) => tasks.length > 0)).toBe(true)
    }
  })
})

describe('isOverdue', () => {
  const now = new Date(2026, 9, 15, 10)
  it('détecte une échéance dépassée', () => {
    expect(isOverdue('2026-10-12', 'en_cours', now)).toBe(true)
    expect(isOverdue('2026-10-15', 'en_cours', now)).toBe(false)
    expect(isOverdue('2026-11-01', 'a_faire', now)).toBe(false)
  })
  it('ignore les tâches terminées', () => {
    expect(isOverdue('2026-01-01', 'termine', now)).toBe(false)
  })
})

describe('jalons, activité et libellés', () => {
  it('retourne les 3 prochains jalons non terminés, retard en tête', () => {
    const next = getNextMilestones(rouen.milestones)
    expect(next).toHaveLength(3)
    expect(next[0].title).toBe('Validation du modèle O₂')
    expect(next[0].status).toBe('en_retard')
  })

  it('retourne les 10 évènements les plus récents, triés', () => {
    const events = getLatestActivity(PROJECTS)
    expect(events).toHaveLength(10)
    const times = events.map((event) => new Date(event.at).getTime())
    expect([...times].sort((a, b) => b - a)).toEqual(times)
  })

  it('formate la phase courante', () => {
    expect(formatPhaseLabel(begles)).toBe('Phase 4 / 6 · Pilote')
    expect(formatPhaseLabel(rouen)).toBe('Phase 3 / 6 · Modélisation')
  })

  it('exporte un CSV avec une ligne par site', () => {
    expect(projectsToCsv(PROJECTS).split('\n')).toHaveLength(3)
  })
})
