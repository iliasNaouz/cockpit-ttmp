import { Calendar } from 'lucide-react'
import { MonoValue } from '@/components/shared/MonoValue'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { CATEGORY_PILL, PRIORITY_DOT } from '@/design-system/status-styles'
import { formatDayMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/project'
import { isOverdue } from '../utils/project-utils'

interface TaskCardProps {
  task: Task
  draggable: boolean
  onDragStart: (taskId: string) => void
}

export function TaskCard({ task, draggable, onDragStart }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status)
  const priority = PRIORITY_DOT[task.priority]

  return (
    <article
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', task.id)
        event.dataTransfer.effectAllowed = 'move'
        onDragStart(task.id)
      }}
      className={cn('rounded-lg border border-line bg-surface p-3 shadow-card', draggable && 'cursor-grab active:cursor-grabbing')}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[13px] font-semibold text-ink">{task.title}</h4>
        <span className={cn('mt-1 size-2 shrink-0 rounded-full', priority.dot)} role="img" aria-label={priority.label} title={priority.label} />
      </div>
      <span className={cn('mt-2 inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold', CATEGORY_PILL[task.category])}>{task.category}</span>
      <div className="mt-3 flex items-center justify-between">
        <MonoValue className={cn('flex items-center gap-1 text-[11px]', overdue ? 'text-danger' : 'text-ink-sub')}>
          <Calendar className="size-3" aria-hidden />
          {formatDayMonth(task.dueDate)}
          {overdue && <span className="sr-only"> (échéance dépassée)</span>}
        </MonoValue>
        <span title={task.assignee}><UserAvatar name={task.assignee} size="sm" /></span>
      </div>
    </article>
  )
}
