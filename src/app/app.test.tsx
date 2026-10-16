import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()
  await user.type(await screen.findByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Mot de passe'), password)
  await user.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('authentification', () => {
  it('redirige un visiteur non connecté vers /login', async () => {
    renderApp('/ttmp')
    expect(await screen.findByRole('heading', { name: 'Connexion' })).toBeInTheDocument()
  })

  it('connecte un compte valide et ouvre le premier module autorisé', async () => {
    renderApp('/login')
    await fillAndSubmit('lecteur@demo.fr', 'demo1234')
    expect(await screen.findByText(/FC1 .* en marche/)).toBeInTheDocument()
  })

  it('affiche une erreur pour de mauvais identifiants', async () => {
    renderApp('/login')
    await fillAndSubmit('lecteur@demo.fr', 'mauvais')
    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect.')
  })

  it('signale un compte désactivé', async () => {
    renderApp('/login')
    await fillAndSubmit('pfontaine@demo.fr', 'demo1234')
    expect(await screen.findByRole('alert')).toHaveTextContent('Ce compte est désactivé. Contactez un administrateur.')
  })

  it('valide le format de l’email', async () => {
    renderApp('/login')
    await fillAndSubmit('pas-un-email', 'x')
    expect(await screen.findByText('Adresse email invalide')).toBeInTheDocument()
  })

  it('redirige un utilisateur déjà connecté depuis /login', async () => {
    renderApp('/login', 'operateur@demo.fr')
    expect(await screen.findByText(/FC1 .* en marche/)).toBeInTheDocument()
  })
})

describe('navigation selon les droits', () => {
  it('masque « Utilisateurs » à un opérateur', async () => {
    renderApp('/ttmp', 'operateur@demo.fr')
    const nav = await screen.findByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).queryByRole('link', { name: /Utilisateurs/ })).not.toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /Chat/ })).toBeInTheDocument()
  })

  it('affiche « Utilisateurs » à un administrateur', async () => {
    renderApp('/ttmp', 'admin@demo.fr')
    const nav = await screen.findByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).getByRole('link', { name: /Utilisateurs/ })).toBeInTheDocument()
  })

  it('masque « Chat » à un lecteur et signale les modules en lecture seule', async () => {
    renderApp('/ttmp', 'lecteur@demo.fr')
    const nav = await screen.findByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).queryByRole('link', { name: /Chat/ })).not.toBeInTheDocument()
    expect(within(nav).getAllByLabelText('Lecture seule').length).toBeGreaterThan(0)
  })

  it('ne propose que les sites autorisés', async () => {
    renderApp('/ttmp', 'operateur@demo.fr')
    await screen.findByRole('navigation', { name: 'Navigation principale' })
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(1)
    expect(screen.getByText('Bègles', { selector: 'label' })).toBeInTheDocument()
  })

  it('affiche la page 404 dans le layout', async () => {
    renderApp('/page-inconnue', 'admin@demo.fr')
    expect(await screen.findByText('Page introuvable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toBeInTheDocument()
  })

  it('redirige « / » vers le premier module autorisé', async () => {
    renderApp('/', 'chef@demo.fr')
    expect(await screen.findByText(/FC1 .* en marche/)).toBeInTheDocument()
  })
})
