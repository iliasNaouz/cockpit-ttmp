import { useState } from 'react'
import { usePermission } from '@/auth/usePermission'
import type { SiteId } from '@/types/domain'
import type { Task, TaskStatus } from '@/types/project'
import { useProjectMutations } from '../hooks/useProjects'
import { groupTasksByStatus, TASK_COLUMNS } from '../utils/project-utils'
import { TaskColumn } from './TaskColumn'

/** Kanban à 4 colonnes avec glisser-déposer natif (accès écriture). */
export function TasksBoard({ siteId, tasks }: { siteId: SiteId; tasks: Task[] }) {
  const { canWrite } = usePermission('projets')
  const { moveTask, addTask } = useProjectMutations(siteId)
  const [dragged, setDragged] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)
  const groups = groupTasksByStatus(tasks)

  const handleDrop = (status: TaskStatus) => {
    const task = tasks.find((candidate) => candidate.id === dragged)
    if (task && task.status !== status) moveTask.mutate({ taskId: task.id, status })
    setDragged(null)
    setOverStatus(null)
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" onDragEnd={() => { setDragged(null); setOverStatus(null) }}>
      {TASK_COLUMNS.map(({ status, label }) => (
        <TaskColumn
          key={status}
          status={status}
          label={label}
          tasks={groups[status]}
          canWrite={canWrite}
          isDropTarget={overStatus === status && dragged !== null}
          onDragStart={setDragged}
          onDragOver={setOverStatus}
          onDrop={handleDrop}
          onAdd={(columnStatus, title) => addTask.mutate({ status: columnStatus, title })}
        />
      ))}
    </div>
  )
}
