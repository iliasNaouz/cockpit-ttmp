import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('TtmpPage', () => {
  it('affiche statut, KPI, leviers et diagnostic', async () => {
    renderApp('/ttmp', 'operateur@demo.fr')

    expect(await screen.findByText(/FC1 Bègles en marche/)).toBeInTheDocument()
    expect(await screen.findByText('36.78')).toBeInTheDocument()
    expect(screen.getByText('Leviers actionnables')).toBeInTheDocument()
    expect(await screen.findByText('Vitesse Alimentateur Supérieur')).toBeInTheDocument()
    expect(await screen.findByText('ACTION RECOMMANDÉE')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Valider l'évaluation" })).toBeDisabled()
  })

  it('désactive les évaluations pour un lecteur', async () => {
    renderApp('/ttmp', 'lecteur@demo.fr')

    const thumbs = await screen.findAllByRole('button', { name: /^Utile — / })
    expect(thumbs).toHaveLength(3)
    for (const button of thumbs) expect(button).toBeDisabled()
  })
})
