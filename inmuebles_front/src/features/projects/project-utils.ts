import type { Project } from '@/store/slices/projectsSlice'
import type { Task } from '@/store/slices/tasksSlice'

export function buildTasksByProject(tasks: Task[]) {
  return tasks.reduce<Record<number, Task[]>>((acc, task) => {
    const projectTasks = acc[task.project_id] ?? []

    acc[task.project_id] = [...projectTasks, task]

    return acc
  }, {})
}

export function filterProjects(projects: Project[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (normalizedSearch.length === 0) return projects

  return projects.filter(project => {
    const searchableText = `${project.name} ${project.description}`

    return searchableText.toLowerCase().includes(normalizedSearch)
  })
}
