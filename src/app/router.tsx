import { Suspense } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { RequireAuth } from '@/auth/RequireAuth'
import { AppShell } from '@/components/layout/AppShell'
import { AccessDenied, NotFound } from '@/components/shared/AccessDenied'
import {
  ChatPage,
  LoginPage,
  ProjectDetailRoute,
  ProjectsOverviewPage,
  ThermalDashboardPage,
  TtmpPage,
  UsersPage,
} from './lazy-pages'
import { Guarded, HomeRedirect } from './route-elements'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: 'ttmp', element: <Guarded module="ttmp"><TtmpPage /></Guarded> },
          { path: 'thermal', element: <Guarded module="thermal"><ThermalDashboardPage /></Guarded> },
          { path: 'chat/:conversationId?', element: <Guarded module="chat"><ChatPage /></Guarded> },
          { path: 'projets', element: <Guarded module="projets"><ProjectsOverviewPage /></Guarded> },
          { path: 'projets/:siteId', element: <Guarded module="projets"><ProjectDetailRoute /></Guarded> },
          { path: 'utilisateurs', element: <Guarded module="utilisateurs"><UsersPage /></Guarded> },
          { path: 'acces-refuse', element: <AccessDenied /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]

export const createAppRouter = () => createBrowserRouter(routes)
