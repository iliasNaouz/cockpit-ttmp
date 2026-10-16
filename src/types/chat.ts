import type { SiteId } from './domain'

export interface Source {
  label: string
}

export interface ChartPoint {
  label: string
  value: number
}

export interface MessageChart {
  title: string
  unit: string
  points: ChartPoint[]
}

export type MessageFeedback = 'up' | 'down'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  sources?: Source[]
  chart?: MessageChart
  feedback?: MessageFeedback
}

export interface Conversation {
  id: string
  title: string
  siteId: SiteId
  pinned: boolean
  updatedAt: string
  messages: Message[]
}

export interface ChatAnswer {
  content: string
  sources: Source[]
  chart?: MessageChart
}
