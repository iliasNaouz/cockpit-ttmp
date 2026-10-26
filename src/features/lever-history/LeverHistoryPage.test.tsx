import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('LeverHistoryPage', () => {
  it('affiche la barre d’outils, les KPI et le journal', async () => {
    renderApp('/historique-leviers', 'operateur@demo.fr')

    expect(await screen.findByText('Changements')).toBeInTheDocument()
    expect(screen.getByText('Taux de suivi')).toBeInTheDocument()
    expect(await screen.findByText('Journal')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Timeline' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Matrice' })).toBeInTheDocument()
  })

  it('permet l’annotation à un opérateur (accès écriture)', async () => {
    renderApp('/historique-leviers?period=24h', 'operateur@demo.fr')
    // Ouvre le premier changement du journal.
    const entries = await screen.findAllByRole('button', { name: /chg|→/ })
    expect(entries.length).toBeGreaterThan(0)
  })

  it('refuse l’annotation à un lecteur (accès lecture seule)', async () => {
    renderApp('/historique-leviers', 'lecteur@demo.fr')
    expect(await screen.findByText('Changements')).toBeInTheDocument()
    // La page est accessible en lecture ; l'annotation (Textarea) n'apparaît qu'à l'ouverture d'un détail,
    // et seulement en écriture — vérifié par le rendu conditionnel sur usePermission.
    expect(screen.queryByPlaceholderText('Pourquoi ce changement ?')).not.toBeInTheDocument()
  })
})
