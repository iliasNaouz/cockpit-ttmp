import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('UsersPage', () => {
  it('affiche KPI, tableau paginé et filtres pour un administrateur', async () => {
    renderApp('/utilisateurs', 'admin@demo.fr')

    expect(await screen.findByRole('heading', { name: 'Gestion des utilisateurs', level: 2 })).toBeInTheDocument()
    expect(await screen.findByText('1–10 sur 12')).toBeInTheDocument()
    expect(screen.getByText('Invitations en attente')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(11) // en-tête + 10 lignes
  })

  it('filtre les utilisateurs avec la recherche', async () => {
    renderApp('/utilisateurs', 'admin@demo.fr')
    const user = userEvent.setup()

    await user.type(await screen.findByPlaceholderText('Rechercher un nom, un email…'), 'benali')
    expect(await screen.findByText('1–1 sur 1')).toBeInTheDocument()
  })

  it('empêche un administrateur de se désactiver ou de se supprimer', async () => {
    renderApp('/utilisateurs', 'admin@demo.fr')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Actions pour Ilias Naouz' }))
    expect(await screen.findByRole('menuitem', { name: /Désactiver/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('menuitem', { name: /Supprimer/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('ouvre la matrice des rôles', async () => {
    renderApp('/utilisateurs', 'admin@demo.fr')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('tab', { name: 'Rôles & permissions' }))
    const table = await screen.findByRole('table')
    expect(within(table).getAllByText('Écriture').length).toBeGreaterThan(0)
  })

  it('masque la page à un opérateur', async () => {
    renderApp('/utilisateurs', 'operateur@demo.fr')
    expect(await screen.findByText('Accès refusé')).toBeInTheDocument()
  })
})
