import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('ChatPage', () => {
  it('affiche la conversation avec réponses Markdown et sources', async () => {
    renderApp('/chat/c-01', 'chef@demo.fr')

    expect(await screen.findByRole('heading', { name: 'Analyse O₂ bas — FC1' })).toBeInTheDocument()
    expect(await screen.findAllByLabelText("Réponse de l'assistant")).toHaveLength(4)
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getAllByText('Poussoir').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Diagnostic 09:38').length).toBeGreaterThan(0)
  })

  it('affiche l’état vide personnalisé et envoie une suggestion', async () => {
    renderApp('/chat', 'chef@demo.fr')
    const user = userEvent.setup()

    expect(await screen.findByText(/Bonjour Claire, comment puis-je vous aider/)).toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: /Quel levier actionner/ }))

    expect(await screen.findByLabelText("Réponse de l'assistant")).toBeInTheDocument()
    expect(await screen.findByText(/Comparaison des leviers|comparaison des leviers/)).toBeInTheDocument()
  })

  it('refuse l’accès à un lecteur (module chat à « aucun »)', async () => {
    renderApp('/chat', 'lecteur@demo.fr')
    expect(await screen.findByText('Accès refusé')).toBeInTheDocument()
  })
})
