import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('ThermalDashboardPage', () => {
  it('affiche les cartes KPI, la répartition et le tableau de 50 logs', async () => {
    renderApp('/thermal', 'operateur@demo.fr')

    expect(await screen.findByText('Latest Recommendation')).toBeInTheDocument()
    expect(await screen.findByText('ROU_0449')).toBeInTheDocument()
    expect(await screen.findByText('Total: 50 recos')).toBeInTheDocument()
    expect(await screen.findByText(/operational logs/)).toHaveTextContent('Showing 50 of 50')
    const rows = await screen.findAllByRole('row')
    expect(rows).toHaveLength(51) // en-tête + 50 lignes
  })

  it('filtre le tableau avec la recherche', async () => {
    renderApp('/thermal', 'operateur@demo.fr')
    const user = userEvent.setup()

    const search = await screen.findByPlaceholderText('Search timestamps, levers, tags')
    await user.type(search, 'timeout')

    expect(await screen.findByText(/operational logs/)).toHaveTextContent('Showing 1 of 50')
  })

  it('désactive l’ajout et la suppression pour un lecteur', async () => {
    renderApp('/thermal', 'lecteur@demo.fr')

    const log = await screen.findByRole('button', { name: /Log Recommendation/ })
    expect(log).toBeDisabled()
    const [firstDelete] = await screen.findAllByRole('button', { name: 'Supprimer' })
    expect(firstDelete).toBeDisabled()
    expect(within(document.body).getAllByRole('button', { name: 'Modifier' })[0]).toBeDisabled()
  })
})
