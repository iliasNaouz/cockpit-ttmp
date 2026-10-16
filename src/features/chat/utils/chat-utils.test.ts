import { describe, expect, it } from 'vitest'
import type { Conversation } from '@/types/chat'
import { groupConversations, getDateGroup } from './conversation-groups'
import { conversationToMarkdown, exportFileName } from './export-markdown'

const NOW = new Date(2026, 9, 15, 12, 0, 0)

function conv(id: string, title: string, daysAgo: number, pinned = false): Conversation {
  return {
    id,
    title,
    siteId: 'begles',
    pinned,
    updatedAt: new Date(2026, 9, 15 - daysAgo, 10, 0, 0).toISOString(),
    messages: [],
  }
}

describe('getDateGroup', () => {
  it('classe selon le jour calendaire', () => {
    expect(getDateGroup(new Date(2026, 9, 15, 1).toISOString(), NOW)).toBe("Aujourd'hui")
    expect(getDateGroup(new Date(2026, 9, 14, 23).toISOString(), NOW)).toBe('Hier')
    expect(getDateGroup(new Date(2026, 9, 10).toISOString(), NOW)).toBe('7 derniers jours')
    expect(getDateGroup(new Date(2026, 8, 1).toISOString(), NOW)).toBe('Plus ancien')
  })
})

describe('groupConversations', () => {
  const list = [conv('a', 'Analyse O₂', 0), conv('b', 'Bilan nuit', 1), conv('c', 'Ancien', 30), conv('d', 'Épinglée', 5, true)]

  it('place les épinglées en tête puis respecte l’ordre des groupes', () => {
    expect(groupConversations(list, '', NOW).map((group) => group.label)).toEqual([
      'Épinglées',
      "Aujourd'hui",
      'Hier',
      'Plus ancien',
    ])
  })

  it('filtre par titre sans tenir compte de la casse', () => {
    const groups = groupConversations(list, 'o₂', NOW)
    expect(groups).toHaveLength(1)
    expect(groups[0].conversations[0].id).toBe('a')
  })

  it('renvoie une liste vide si rien ne correspond', () => {
    expect(groupConversations(list, 'zzz', NOW)).toEqual([])
  })
})

describe('export Markdown', () => {
  it('produit un titre, le site et les messages', () => {
    const markdown = conversationToMarkdown({
      ...conv('x', 'Analyse O₂ bas', 0),
      messages: [
        { id: '1', role: 'user', content: 'Pourquoi ?', createdAt: new Date(2026, 9, 15, 9, 0).toISOString() },
        { id: '2', role: 'assistant', content: 'Parce que.', createdAt: new Date(2026, 9, 15, 9, 1).toISOString(), sources: [{ label: 'BEG0346' }] },
      ],
    })
    expect(markdown).toContain('# Analyse O₂ bas')
    expect(markdown).toContain('Site : Bègles')
    expect(markdown).toContain('## Vous — 15/10/2026 09:00')
    expect(markdown).toContain('Sources : BEG0346')
  })

  it('génère un nom de fichier sûr', () => {
    expect(exportFileName('Analyse O₂ bas — FC1')).toBe('analyse-o2-bas-fc1.md')
    expect(exportFileName('???')).toBe('conversation.md')
  })
})
