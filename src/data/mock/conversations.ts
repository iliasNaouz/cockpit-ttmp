import type { Conversation, Message } from '@/types/chat'
import type { SiteId } from '@/types/domain'
import {
  DEPRESSION_ANSWER,
  FORECAST_ANSWER,
  LEVER_ANSWER,
  O2_ANSWER,
  SUMMARY_ANSWER,
  type AnswerEntry,
} from './chat-answers'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const at = (offsetMs: number): string => new Date(Date.now() - offsetMs).toISOString()

function exchange(
  id: string,
  question: string,
  answer: AnswerEntry,
  startOffsetMs: number,
): Message[] {
  return [
    { id: `${id}-q`, role: 'user', content: question, createdAt: at(startOffsetMs) },
    {
      id: `${id}-a`,
      role: 'assistant',
      content: answer.content,
      createdAt: at(startOffsetMs - 20_000),
      sources: answer.sources,
      chart: answer.chart,
    },
  ]
}

function conversation(
  id: string,
  title: string,
  siteId: SiteId,
  ageMs: number,
  messages: Message[],
  pinned = false,
): Conversation {
  return { id, title, siteId, pinned, updatedAt: at(ageMs), messages }
}

export const CONVERSATIONS: Conversation[] = [
  conversation(
    'c-01',
    'Analyse O₂ bas — FC1',
    'begles',
    20 * MINUTE,
    [
      ...exchange('c01-1', "Pourquoi l'O₂ est-il bas ?", O2_ANSWER, 50 * MINUTE),
      ...exchange('c01-2', 'Quel levier actionner ?', LEVER_ANSWER, 40 * MINUTE),
      ...exchange('c01-3', 'Et la dépression foyer ?', DEPRESSION_ANSWER, 30 * MINUTE),
      ...exchange('c01-4', 'Quelle est la tendance de la vapeur ?', FORECAST_ANSWER, 20 * MINUTE),
    ],
    true,
  ),
  conversation(
    'c-02',
    'Écart vapeur 05:15',
    'begles',
    3 * HOUR,
    exchange('c02-1', "Pourquoi la vapeur a-t-elle chuté à 05:15 ?", FORECAST_ANSWER, 3 * HOUR),
  ),
  conversation(
    'c-03',
    'Réglage grille zone 2',
    'rouen',
    5 * HOUR,
    exchange('c03-1', 'Quel levier actionner sur la zone 2 ?', LEVER_ANSWER, 5 * HOUR),
  ),
  conversation(
    'c-04',
    'Bilan de la nuit',
    'begles',
    DAY + 2 * HOUR,
    exchange('c04-1', 'Résumé de la dernière heure', SUMMARY_ANSWER, DAY + 2 * HOUR),
  ),
  conversation(
    'c-05',
    'Tirage et dépression foyer',
    'rouen',
    DAY + 6 * HOUR,
    exchange('c05-1', 'Où en est la dépression foyer ?', DEPRESSION_ANSWER, DAY + 6 * HOUR),
  ),
  conversation(
    'c-06',
    'Prévision +15 min Rouen',
    'rouen',
    4 * DAY,
    exchange('c06-1', 'Prévision vapeur 15 min', FORECAST_ANSWER, 4 * DAY),
  ),
  conversation(
    'c-07',
    'Alarme O₂ de la semaine',
    'begles',
    12 * DAY,
    exchange('c07-1', "Pourquoi l'O₂ est-il bas ?", O2_ANSWER, 12 * DAY),
  ),
  conversation(
    'c-08',
    'Comparaison des leviers',
    'begles',
    20 * DAY,
    exchange('c08-1', 'Quel levier actionner ?', LEVER_ANSWER, 20 * DAY),
  ),
]
