import { Plus } from 'lucide-react'
import { useState } from 'react'
import { MonoValue } from '@/components/shared/MonoValue'
import { ReadOnlyGuard } from '@/components/shared/ReadOnlyGuard'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/project'
import { TaskCard } from './TaskCard'

interface TaskColumnProps {
  status: TaskStatus
  label: string
  tasks: Task[]
  canWrite: boolean
  isDropTarget: boolean
  onDragStart: (taskId: string) => void
  onDragOver: (status: TaskStatus) => void
  onDrop: (status: TaskStatus) => void
  onAdd: (status: TaskStatus, title: string) => void
}

/** Colonne du Kanban : zone de dépôt HTML5 native (écriture uniquement). */
export function TaskColumn({ status, label, tasks, canWrite, isDropTarget, onDragStart, onDragOver, onDrop, onAdd }: TaskColumnProps) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  const commit = () => {
    if (title.trim() !== '') onAdd(status, title.trim())
    setTitle('')
    setAdding(false)
  }

  return (
    <section
      aria-label={label}
      onDragOver={(event) => { if (canWrite) { event.preventDefault(); onDragOver(status) } }}
      onDrop={(event) => { if (canWrite) { event.preventDefault(); onDrop(status) } }}
      className={cn('flex min-h-48 flex-col gap-3 rounded-xl bg-surface-muted/60 p-3 transition-colors', isDropTarget && 'bg-brand-soft')}
    >
      <h3 className="flex items-center gap-2 text-[13px] font-bold text-ink">
        {label}
        <MonoValue className="rounded-full bg-surface-muted px-2 text-[11px] font-semibold text-ink-sub">{tasks.length}</MonoValue>
      </h3>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} draggable={canWrite} onDragStart={onDragStart} />
      ))}
      {adding ? (
        <Input
          autoFocus
          value={title}
          aria-label="Titre de la nouvelle tâche"
          placeholder="Titre de la tâche"
          className="h-9 bg-surface"
          onChange={(event) => setTitle(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => { if (event.key === 'Enter') commit(); if (event.key === 'Escape') { setTitle(''); setAdding(false) } }}
        />
      ) : (
        <ReadOnlyGuard canWrite={canWrite} className="flex">
          <button type="button" disabled={!canWrite} onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs font-semibold text-ink-sub hover:text-brand disabled:cursor-not-allowed disabled:opacity-50">
            <Plus className="size-3.5" aria-hidden /> Ajouter une tâche
          </button>
        </ReadOnlyGuard>
      )}
    </section>
  )
}
