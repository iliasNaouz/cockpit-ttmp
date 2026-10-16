import type { Role } from './auth'
import type { SiteId } from './domain'

export type Health = 'en_bonne_voie' | 'a_surveiller' | 'en_retard'

export type PhaseStatus = 'termine' | 'en_cours' | 'a_venir'

export interface Phase {
  id: number
  title: string
  startDate: string
  endDate: string
  status: PhaseStatus
}

export type MilestoneStatus = 'termine' | 'en_cours' | 'a_venir' | 'en_retard'

export interface Milestone {
  id: string
  title: string
  phaseId: number
  owner: string
  dueDate: string
  status: MilestoneStatus
}

export type TaskStatus = 'a_faire' | 'en_cours' | 'en_revue' | 'termine'
export type TaskCategory = 'Données' | 'Modèle' | 'Interface' | 'Formation' | 'Infra'
export type TaskPriority = 'haute' | 'moyenne' | 'basse'

export interface Task {
  id: string
  title: string
  category: TaskCategory
  status: TaskStatus
  dueDate: string
  assignee: string
  priority: TaskPriority
}

export type RiskSeverity = 'critique' | 'elevee' | 'moderee' | 'faible'
export type RiskStatus = 'ouvert' | 'maitrise' | 'clos'

export interface Risk {
  id: string
  title: string
  description: string
  severity: RiskSeverity
  /** 1 à 5 */
  probability: number
  /** 1 à 5 */
  impact: number
  owner: string
  mitigation: string
  status: RiskStatus
}

export type ActivityType = 'jalon' | 'tache' | 'risque' | 'deploiement' | 'evaluation'

export interface ActivityEvent {
  id: string
  siteId: SiteId
  type: ActivityType
  text: string
  at: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  projectRole: string
  toolRole: Role
}

export interface AdoptionWeek {
  label: string
  issued: number
  applied: number
  positivePct: number
}

export interface Project {
  siteId: SiteId
  name: string
  health: Health
  currentPhase: number
  progress: number
  adoption: number
  positiveRate: number
  availability: number
  nextMilestoneDate: string
  manager: TeamMember
  phases: Phase[]
  milestones: Milestone[]
  tasks: Task[]
  risks: Risk[]
  team: TeamMember[]
  adoptionWeeks: AdoptionWeek[]
  activity: ActivityEvent[]
}
