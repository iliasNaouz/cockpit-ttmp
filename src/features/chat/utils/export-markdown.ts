import { SITES } from '@/lib/sites'
import { formatDateTime } from '@/lib/format'
import type { Conversation } from '@/types/chat'

/** Exporte une conversation au format Markdown. */
export function conversationToMarkdown(conversation: Conversation): string {
  const header = [
    `# ${conversation.title}`,
    '',
    `Site : ${SITES[conversation.siteId].label}`,
    '',
  ]
  const body = conversation.messages.flatMap((message) => [
    `## ${message.role === 'user' ? 'Vous' : 'Assistant Vapeur'} — ${formatDateTime(new Date(message.createdAt))}`,
    '',
    message.content,
    '',
    ...(message.sources?.length ? [`Sources : ${message.sources.map((source) => source.label).join(' · ')}`, ''] : []),
  ])
  return [...header, ...body].join('\n')
}

/** Nom de fichier sûr pour l'export. */
export function exportFileName(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'conversation'}.md`
}
