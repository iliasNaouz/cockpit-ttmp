import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

describe('TtmpPage', () => {
  it('affiche statut, KPI, leviers et les 3 blocs du diagnostic', async () => {
    renderApp('/ttmp', 'operateur@demo.fr')

    expect(await screen.findByText(/FC1 Bègles en marche/)).toBeInTheDocument()
    expect(await screen.findByText('36.78')).toBeInTheDocument()
    expect(screen.getByText('Leviers actionnables')).toBeInTheDocument()
    expect(await screen.findByText('Vitesse Alimentateur Supérieur')).toBeInTheDocument()

    // Les 3 blocs sont visibles en même temps, dans l'ordre.
    expect(await screen.findByText('DIAGNOSTIC')).toBeInTheDocument()
    expect(screen.getByText('ACTION RECOMMANDÉE')).toBeInTheDocument()
    expect(screen.getByText('POURQUOI CETTE ACTION')).toBeInTheDocument()

    // Plus de « Voir plus », plus de chips : seulement le texte.
    expect(screen.queryByRole('button', { name: /Voir plus/ })).not.toBeInTheDocument()
    expect(screen.queryByText('O₂ fumées · 4,23 %')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: "Valider l'évaluation" })).toBeDisabled()
    expect(screen.getByText('0/3 évalués')).toBeInTheDocument()
  })

  it('désactive les évaluations pour un lecteur', async () => {
    renderApp('/ttmp', 'lecteur@demo.fr')

    const thumbs = await screen.findAllByRole('button', { name: /^Pertinent — / })
    expect(thumbs).toHaveLength(3)
    for (const button of thumbs) expect(button).toBeDisabled()
  })
})
