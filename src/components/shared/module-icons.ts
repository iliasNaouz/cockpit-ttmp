import { Activity, FolderKanban, Gauge, MessageSquare, Users, type LucideIcon } from 'lucide-react'
import type { ModuleId } from '@/types/auth'

export const MODULE_ICONS: Record<ModuleId, LucideIcon> = {
  ttmp: Gauge,
  thermal: Activity,
  chat: MessageSquare,
  projets: FolderKanban,
  utilisateurs: Users,
}
