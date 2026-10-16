import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { routes } from '@/app/router'
import { SESSION_KEY } from '@/auth/auth-store'
import { USERS } from '@/data/mock/users'

export type DemoEmail = 'admin@demo.fr' | 'chef@demo.fr' | 'operateur@demo.fr' | 'lecteur@demo.fr'

/** Ouvre une session de démo (sans passer par le formulaire de connexion). */
export function signInAs(email: DemoEmail): void {
  const user = USERS.find((candidate) => candidate.email === email)
  if (!user) throw new Error(`Utilisateur de démo introuvable : ${email}`)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, createdAt: new Date().toISOString() }))
}

/** Rend toute l'application (providers + routes) à une URL donnée. */
export function renderApp(path: string, email?: DemoEmail) {
  if (email) signInAs(email)
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const result = render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  )
  return { ...result, router }
}
