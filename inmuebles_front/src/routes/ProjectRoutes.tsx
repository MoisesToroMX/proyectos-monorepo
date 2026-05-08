import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingState, Page } from '@/components/ui/page'

const ProjectsPage = lazy(() => import('@/pages/projects'))
const TaskRoutes = lazy(() =>
  import('./TaskRoutes').then(module => ({ default: module.TaskRoutes }))
)

function NestedFallback() {
  return (
    <Page>
      <LoadingState />
    </Page>
  )
}

export function ProjectRoutes() {
  return (
    <Suspense fallback={<NestedFallback />}>
      <Routes>
        <Route element={<ProjectsPage />} path="/" />
        <Route element={<TaskRoutes />} path="/:projectId/*" />
        <Route element={<Navigate replace to="." />} path="*" />
      </Routes>
    </Suspense>
  )
}
