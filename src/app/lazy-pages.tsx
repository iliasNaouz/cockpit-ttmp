import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
export const TtmpPage = lazy(() => import('@/features/ttmp/TtmpPage').then((m) => ({ default: m.TtmpPage })))
export const ThermalDashboardPage = lazy(() =>
  import('@/features/thermal-dashboard/ThermalDashboardPage').then((m) => ({ default: m.ThermalDashboardPage })),
)
export const ChatPage = lazy(() => import('@/features/chat/ChatPage').then((m) => ({ default: m.ChatPage })))
export const ProjectsOverviewPage = lazy(() =>
  import('@/features/projects/ProjectsOverviewPage').then((m) => ({ default: m.ProjectsOverviewPage })),
)
export const ProjectDetailRoute = lazy(() =>
  import('@/features/projects/ProjectDetailRoute').then((m) => ({ default: m.ProjectDetailRoute })),
)
export const UsersPage = lazy(() => import('@/features/users/UsersPage').then((m) => ({ default: m.UsersPage })))
