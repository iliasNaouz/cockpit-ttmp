/**
 * Couche d'accès aux données (mock).
 *
 * Seul fichier à remplacer pour brancher la vraie API : chaque fonction garde
 * la même signature (async, mêmes types). Les contrôles de droits réalisés ici
 * sont un simple filet pour la démo : la vraie API doit les appliquer côté serveur.
 */
import { getAccessLevel, normalizeOverrides } from '@/auth/permissions'
import { MODULES } from '@/auth/modules'
import { ROLE_LABELS } from '@/design-system/role-styles'
import type {
  AccessLevel,
  AccessLogEntry,
  AccessLogType,
  AccessOverrides,
  ModuleId,
  Role,
  Session,
  User,
  UserStatus,
} from '@/types/auth'
import type { ChatAnswer, Conversation, Message } from '@/types/chat'
import type {
  AgentHealth,
  Diagnostic,
  Direction,
  Evaluation,
  RecommendedLever,
  Recommendation,
  SiteId,
  SliderLever,
  StabilityPoint,
  TelemetryPoint,
  TtmpStatus,
} from '@/types/domain'
import type { Milestone, Project, Task, TaskStatus } from '@/types/project'
import { buildAccessLog } from '../mock/access-log'
import { CHAT_ANSWERS, FALLBACK_ANSWER, type AnswerEntry } from '../mock/chat-answers'
import { CONVERSATIONS } from '../mock/conversations'
import { DIAGNOSTIC } from '../mock/diagnostic'
import { SLIDER_LEVERS } from '../mock/levers'
import { PROJECTS } from '../mock/projects'
import { RECOMMENDATIONS } from '../mock/recommendations'
import { STABILITY_SERIES, TTMP_STATUS } from '../mock/stability'
import { AGENT_HEALTH, TELEMETRY } from '../mock/telemetry'
import { MOCK_PASSWORD, USERS } from '../mock/users'

// ------------------------------------------------------------------ outils

export type ApiErrorCode =
  | 'invalid_credentials'
  | 'account_disabled'
  | 'forbidden'
  | 'not_found'
  | 'conflict'

export class ApiError extends Error {
  code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const IS_TEST = import.meta.env.MODE === 'test'

const wait = (ms = 250): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, IS_TEST ? 0 : ms)
  })

const clone = <T>(value: T): T => structuredClone(value)

const LEVEL_TEXT: Record<AccessLevel, string> = {
  aucun: 'aucun',
  lecture: 'lecture',
  ecriture: 'écriture',
}

let sequence = 1000
const nextId = (prefix: string): string => {
  sequence += 1
  return `${prefix}-${sequence}`
}

// ------------------------------------------------------------------- état

const state = {
  users: clone(USERS),
  accessLog: buildAccessLog(),
  recommendations: clone(RECOMMENDATIONS),
  projects: clone(PROJECTS),
  conversations: clone(CONVERSATIONS),
}

function addLog(
  user: Pick<User, 'id' | 'firstName' | 'lastName'>,
  type: AccessLogType,
  detail: string,
  site: SiteId | null,
): void {
  state.accessLog.unshift({
    id: nextId('log'),
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    type,
    detail,
    site,
    ip: '10.24.0.12',
  })
}

function findUser(userId: string): User {
  const user = state.users.find((candidate) => candidate.id === userId)
  if (!user) throw new ApiError('not_found', 'Utilisateur introuvable.')
  return user
}

// --------------------------------------------------------- authentification

export async function login(email: string, password: string): Promise<Session> {
  await wait(400)
  const user = state.users.find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (!user || user.status === 'invite' || password !== MOCK_PASSWORD) {
    throw new ApiError('invalid_credentials', 'Email ou mot de passe incorrect.')
  }
  if (user.status === 'desactive') {
    addLog(user, 'acces_refuse', 'Compte désactivé', null)
    throw new ApiError('account_disabled', 'Ce compte est désactivé.')
  }
  user.lastLoginAt = new Date().toISOString()
  addLog(user, 'connexion', 'Connexion par email', null)
  return { user: clone(user), createdAt: new Date().toISOString() }
}

/** Mock de la connexion Microsoft : connecte le compte administrateur de démo. */
export async function loginWithMicrosoft(): Promise<Session> {
  await wait(400)
  const admin = state.users.find((candidate) => candidate.role === 'administrateur')
  if (!admin) throw new ApiError('not_found', 'Aucun compte administrateur.')
  admin.lastLoginAt = new Date().toISOString()
  addLog(admin, 'connexion', 'Connexion Microsoft', null)
  return { user: clone(admin), createdAt: new Date().toISOString() }
}

export async function logout(userId: string): Promise<void> {
  const user = state.users.find((candidate) => candidate.id === userId)
  if (user) addLog(user, 'deconnexion', 'Déconnexion', null)
  await wait(100)
}

export async function recordAccessDenied(
  userId: string,
  path: string,
  site: SiteId | null,
): Promise<void> {
  const user = state.users.find((candidate) => candidate.id === userId)
  if (user) addLog(user, 'acces_refuse', `${path} refusé`, site)
}

// ------------------------------------------------------------------ TTMP

export async function getTtmpStatus(siteId: SiteId): Promise<TtmpStatus> {
  await wait()
  // Point de fonctionnement mocké par site.
  const operating = siteId === 'rouen' ? { wasteFlow: 10.6, thermalPower: 26.9 } : { wasteFlow: 9.9, thermalPower: 25.1 }
  return clone({ ...TTMP_STATUS, ...operating })
}

export async function getSliderLevers(siteId: SiteId): Promise<SliderLever[]> {
  void siteId
  await wait()
  return clone(SLIDER_LEVERS)
}

export async function getStability(siteId: SiteId): Promise<StabilityPoint[]> {
  void siteId
  await wait()
  return clone(STABILITY_SERIES)
}

export async function getDiagnostic(siteId: SiteId, refresh = false): Promise<Diagnostic> {
  void siteId
  await wait(refresh ? 900 : 350)
  return clone(refresh ? { ...DIAGNOSTIC, updatedAt: new Date().toISOString() } : DIAGNOSTIC)
}

export async function submitEvaluation(siteId: SiteId, evaluation: Evaluation): Promise<void> {
  void siteId
  void evaluation
  await wait(300)
}

// --------------------------------------------------------------- Thermal

export async function getRecommendations(siteId: SiteId): Promise<Recommendation[]> {
  void siteId
  await wait()
  return clone(state.recommendations)
}

export async function getTelemetry(siteId: SiteId): Promise<TelemetryPoint[]> {
  void siteId
  await wait()
  return clone(TELEMETRY)
}

export async function getAgentHealth(siteId: SiteId): Promise<AgentHealth> {
  void siteId
  await wait()
  return clone(AGENT_HEALTH)
}

export interface NewRecommendationInput {
  lever: RecommendedLever
  direction: Direction
  title: string
  description: string
}

/** Horodatage local `YYYY-MM-DDTHH:mm:ss` une minute après `timestamp`. */
function nextMinute(timestamp: string): string {
  const date = new Date(timestamp)
  date.setMinutes(date.getMinutes() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export async function logRecommendation(
  siteId: SiteId,
  input: NewRecommendationInput,
): Promise<Recommendation> {
  void siteId
  await wait(300)
  const last = state.recommendations[state.recommendations.length - 1]
  const created: Recommendation = {
    id: nextId('reco'),
    timestamp: nextMinute(last ? last.timestamp : '2026-04-08T05:34:00'),
    actualSteam: last?.actualSteam ?? null,
    predictedSteam: last?.predictedSteam ?? null,
    o2: last?.o2 ?? null,
    grillePct: last?.grillePct ?? 0,
    poussoirPct: last?.poussoirPct ?? 0,
    tag: last?.tag ?? 'ROU_0000',
    consigne: last?.consigne ?? 40,
    airPrimaireRpm: last?.airPrimaireRpm ?? null,
    airSecondaireRpm: last?.airSecondaireRpm ?? null,
    pressionZ2: last?.pressionZ2 ?? null,
    pressionZ3: last?.pressionZ3 ?? null,
    diagnostic: input.description,
    rationale: 'Recommandation saisie manuellement par un opérateur.',
    ...input,
  }
  state.recommendations.push(created)
  return clone(created)
}

export type RecommendationPatch = Pick<Recommendation, 'lever' | 'direction' | 'description' | 'diagnostic'>

export async function updateRecommendation(
  siteId: SiteId,
  id: string,
  patch: RecommendationPatch,
): Promise<Recommendation> {
  void siteId
  await wait(250)
  const target = state.recommendations.find((reco) => reco.id === id)
  if (!target) throw new ApiError('not_found', 'Recommandation introuvable.')
  Object.assign(target, patch)
  return clone(target)
}

export async function deleteRecommendation(siteId: SiteId, id: string): Promise<void> {
  void siteId
  await wait(200)
  state.recommendations = state.recommendations.filter((reco) => reco.id !== id)
}

// ------------------------------------------------------------------ Chat

export function pickChatAnswer(message: string): AnswerEntry {
  const text = message.toLowerCase()
  return CHAT_ANSWERS.find((entry) => entry.keywords.some((word) => text.includes(word))) ?? FALLBACK_ANSWER
}

export async function resolveChatAnswer(message: string): Promise<ChatAnswer> {
  await wait(700)
  const { content, sources, chart } = pickChatAnswer(message)
  return clone({ content, sources, chart })
}

/** Simule le streaming : un mot toutes les ~20 ms. */
export async function* streamChatAnswer(
  conversationId: string,
  message: string,
): AsyncGenerator<string> {
  void conversationId
  const { content } = pickChatAnswer(message)
  const chunks = content.split(/(?<=\s)/)
  for (const chunk of chunks) {
    await wait(20)
    yield chunk
  }
}

export async function listConversations(): Promise<Conversation[]> {
  await wait(200)
  return clone(state.conversations)
}

export async function createConversation(siteId: SiteId): Promise<Conversation> {
  await wait(100)
  const created: Conversation = {
    id: nextId('c'),
    title: 'Nouvelle conversation',
    siteId,
    pinned: false,
    updatedAt: new Date().toISOString(),
    messages: [],
  }
  state.conversations.unshift(created)
  return clone(created)
}

function findConversation(id: string): Conversation {
  const found = state.conversations.find((conversation) => conversation.id === id)
  if (!found) throw new ApiError('not_found', 'Conversation introuvable.')
  return found
}

export async function renameConversation(id: string, title: string): Promise<void> {
  await wait(100)
  findConversation(id).title = title.trim() || 'Sans titre'
}

export async function togglePinConversation(id: string): Promise<void> {
  await wait(100)
  const conversation = findConversation(id)
  conversation.pinned = !conversation.pinned
}

export async function deleteConversation(id: string): Promise<void> {
  await wait(100)
  state.conversations = state.conversations.filter((conversation) => conversation.id !== id)
}

export async function saveMessages(id: string, messages: Message[]): Promise<void> {
  await wait(50)
  const conversation = findConversation(id)
  conversation.messages.push(...clone(messages))
  conversation.updatedAt = new Date().toISOString()
  const firstUser = conversation.messages.find((message) => message.role === 'user')
  if (conversation.title === 'Nouvelle conversation' && firstUser) {
    conversation.title = firstUser.content.slice(0, 40)
  }
}

// -------------------------------------------------------------- Projets

function findProject(siteId: SiteId): Project {
  const project = state.projects.find((candidate) => candidate.siteId === siteId)
  if (!project) throw new ApiError('not_found', 'Projet introuvable.')
  return project
}

export async function listProjects(siteIds: SiteId[]): Promise<Project[]> {
  await wait()
  return clone(state.projects.filter((project) => siteIds.includes(project.siteId)))
}

export async function getProject(siteId: SiteId): Promise<Project> {
  await wait()
  return clone(findProject(siteId))
}

export async function moveTask(siteId: SiteId, taskId: string, status: TaskStatus): Promise<void> {
  await wait(120)
  const target = findProject(siteId).tasks.find((candidate) => candidate.id === taskId)
  if (!target) throw new ApiError('not_found', 'Tâche introuvable.')
  target.status = status
}

export async function addTask(
  siteId: SiteId,
  status: TaskStatus,
  title: string,
): Promise<Task> {
  await wait(150)
  const project = findProject(siteId)
  const created: Task = {
    id: nextId('k'),
    title,
    category: 'Données',
    status,
    dueDate: new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10),
    assignee: project.manager.name,
    priority: 'moyenne',
  }
  project.tasks.push(created)
  return clone(created)
}

export interface NewMilestoneInput {
  title: string
  owner: string
  dueDate: string
  phaseId: number
}

export async function addMilestone(siteId: SiteId, input: NewMilestoneInput): Promise<Milestone> {
  await wait(150)
  const created: Milestone = { id: nextId('m'), status: 'a_venir', ...input }
  findProject(siteId).milestones.push(created)
  return clone(created)
}

// ---------------------------------------------------------- Utilisateurs

export async function listUsers(): Promise<User[]> {
  await wait()
  return clone(state.users)
}

export interface InviteUserInput {
  firstName: string
  lastName: string
  email: string
  role: Role
  sites: SiteId[]
}

export async function inviteUser(input: InviteUserInput, actor: User): Promise<User> {
  await wait(400)
  if (state.users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    throw new ApiError('conflict', 'Un compte existe déjà avec cet email.')
  }
  const created: User = {
    id: nextId('u'),
    ...input,
    overrides: {},
    status: 'invite',
    lastLoginAt: null,
  }
  state.users.push(created)
  addLog(actor, 'invitation', `Invitation envoyée à ${input.email}`, null)
  return clone(created)
}

export interface UpdateAccessInput {
  role: Role
  sites: SiteId[]
  overrides: AccessOverrides
}

export async function updateUserAccess(
  userId: string,
  patch: UpdateAccessInput,
  actor: User,
): Promise<User> {
  await wait(400)
  const user = findUser(userId)
  const next = { role: patch.role, overrides: normalizeOverrides(patch.role, patch.overrides) }
  const changes: string[] = []
  if (user.role !== patch.role) changes.push(`Rôle : ${ROLE_LABELS[user.role]} → ${ROLE_LABELS[patch.role]}`)
  for (const module of Object.keys(MODULES) as ModuleId[]) {
    const before: AccessLevel = getAccessLevel(user, module)
    const after: AccessLevel = getAccessLevel(next, module)
    if (before !== after) changes.push(`${MODULES[module].label} : ${LEVEL_TEXT[before]} → ${LEVEL_TEXT[after]}`)
  }
  user.role = patch.role
  user.sites = patch.role === 'administrateur' ? ['rouen', 'begles'] : [...patch.sites]
  user.overrides = next.overrides
  addLog(actor, 'droits_modifies', changes.join(' ; ') || 'Sites modifiés', null)
  return clone(user)
}

export async function setUserStatus(
  userId: string,
  status: Extract<UserStatus, 'actif' | 'desactive'>,
  actor: User,
): Promise<void> {
  await wait(250)
  if (userId === actor.id && status === 'desactive') {
    throw new ApiError('forbidden', 'Vous ne pouvez pas désactiver votre propre compte.')
  }
  const user = findUser(userId)
  user.status = status
  addLog(
    actor,
    'droits_modifies',
    `${user.firstName} ${user.lastName} : ${status === 'actif' ? 'réactivé' : 'désactivé'}`,
    null,
  )
}

export async function deleteUser(userId: string, actor: User): Promise<void> {
  await wait(250)
  if (userId === actor.id) {
    throw new ApiError('forbidden', 'Vous ne pouvez pas supprimer votre propre compte.')
  }
  const user = findUser(userId)
  state.users = state.users.filter((candidate) => candidate.id !== userId)
  addLog(actor, 'droits_modifies', `Compte supprimé : ${user.email}`, null)
}

export async function resendInvitation(userId: string, actor: User): Promise<void> {
  await wait(250)
  const user = findUser(userId)
  addLog(actor, 'invitation', `Invitation renvoyée à ${user.email}`, null)
}

export async function resetPassword(userId: string): Promise<void> {
  await wait(250)
  findUser(userId)
}

export async function getAccessLog(): Promise<AccessLogEntry[]> {
  await wait()
  return clone(state.accessLog)
}
