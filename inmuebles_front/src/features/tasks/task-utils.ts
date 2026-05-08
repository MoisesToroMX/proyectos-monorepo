import type { Task } from '@/store/slices/tasksSlice'
import type { TaskStatusFilter } from '@/features/tasks/task-status'

export function filterTasks(
  tasks: Task[],
  searchTerm: string,
  statusFilter: TaskStatusFilter
) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesSearch =
      normalizedSearch.length === 0 ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      task.description.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
}
