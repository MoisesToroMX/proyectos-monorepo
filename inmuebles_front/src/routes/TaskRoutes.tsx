import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingState, Page } from '@/components/ui/page'

const TasksPage = lazy(() => import('@/pages/tasks'))
const TaskDetailPage = lazy(() => import('@/pages/task-detail'))

function NestedFallback() {
  return (
    <Page>
      <LoadingState />
    </Page>
  )
}

export function TaskRoutes() {
  return (
    <Suspense fallback={<NestedFallback />}>
      <Routes>
        <Route element={<TasksPage />} path="/" />
        <Route element={<TasksPage />} path="/tasks" />
        <Route element={<TaskDetailPage />} path="/tasks/:taskId" />
        <Route element={<Navigate replace to="." />} path="*" />
      </Routes>
    </Suspense>
  )
}
