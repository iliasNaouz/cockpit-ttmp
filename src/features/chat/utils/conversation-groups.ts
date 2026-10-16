import type { Conversation } from '@/types/chat'

export type GroupLabel = 'Épinglées' | "Aujourd'hui" | 'Hier' | '7 derniers jours' | 'Plus ancien'

export interface ConversationGroup {
  label: GroupLabel
  conversations: Conversation[]
}

const GROUP_ORDER: GroupLabel[] = ['Épinglées', "Aujourd'hui", 'Hier', '7 derniers jours', 'Plus ancien']
const DAY_MS = 86_400_000

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Groupe de date d'une conversation non épinglée. */
export function getDateGroup(updatedAt: string, now: Date): Exclude<GroupLabel, 'Épinglées'> {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(new Date(updatedAt))) / DAY_MS)
  if (daysAgo <= 0) return "Aujourd'hui"
  if (daysAgo === 1) return 'Hier'
  if (daysAgo <= 7) return '7 derniers jours'
  return 'Plus ancien'
}

/** Filtre par titre puis regroupe (épinglées en tête, plus récentes d'abord). */
export function groupConversations(
  conversations: Conversation[],
  search: string,
  now: Date = new Date(),
): ConversationGroup[] {
  const query = search.trim().toLowerCase()
  const visible = conversations
    .filter((conversation) => query === '' || conversation.title.toLowerCase().includes(query))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const buckets = new Map<GroupLabel, Conversation[]>()
  for (const conversation of visible) {
    const label = conversation.pinned ? 'Épinglées' : getDateGroup(conversation.updatedAt, now)
    buckets.set(label, [...(buckets.get(label) ?? []), conversation])
  }

  return GROUP_ORDER.flatMap((label) => {
    const items = buckets.get(label)
    return items ? [{ label, conversations: items }] : []
  })
}
