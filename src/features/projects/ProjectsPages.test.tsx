import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('Suivi de projet', () => {
  it('affiche une carte par site autorisé (chef de projet : 2 sites)', async () => {
    renderApp('/projets', 'chef@demo.fr')

    expect(await screen.findByText('Bègles — FC1')).toBeInTheDocument()
    expect(await screen.findByText('Rouen — Ligne 2')).toBeInTheDocument()
    expect(screen.getByText('Phase 4 / 6 · Pilote')).toBeInTheDocument()
    expect(screen.getByText('Avancement moyen')).toBeInTheDocument()
  })

  it('limite la vue d’ensemble aux sites de l’opérateur', async () => {
    renderApp('/projets', 'operateur@demo.fr')

    expect(await screen.findByText('Bègles — FC1')).toBeInTheDocument()
    expect(screen.queryByText('Rouen — Ligne 2')).not.toBeInTheDocument()
  })

  it('refuse le détail d’un site non autorisé', async () => {
    renderApp('/projets/rouen', 'operateur@demo.fr')
    expect(await screen.findByText('Accès refusé')).toBeInTheDocument()
  })

  it('affiche le détail avec le kanban à 4 colonnes', async () => {
    renderApp('/projets/begles', 'chef@demo.fr')
    const user = userEvent.setup()

    expect(await screen.findByRole('heading', { name: 'Bègles — FC1' })).toBeInTheDocument()
    await user.click(await screen.findByRole('tab', { name: 'Tâches' }))
    for (const column of ['À faire', 'En cours', 'En revue', 'Terminé']) {
      expect(await screen.findByRole('region', { name: column })).toBeInTheDocument()
    }
  })

  it('désactive l’ajout de tâche en lecture seule (opérateur : projets en lecture)', async () => {
    renderApp('/projets/begles', 'operateur@demo.fr')
    const user = userEvent.setup()

    await user.click(await screen.findByRole('tab', { name: 'Tâches' }))
    const buttons = await screen.findAllByRole('button', { name: /Ajouter une tâche/ })
    for (const button of buttons) expect(button).toBeDisabled()
    expect(screen.getByRole('button', { name: /Ajouter un jalon/ })).toBeDisabled()
  })
})
