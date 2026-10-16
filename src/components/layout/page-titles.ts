const PAGE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: '/ttmp', title: 'VEOLIA TTMP — Production de vapeur' },
  { prefix: '/thermal', title: 'Thermal Plant Boiler & Steam Production Dashboard' },
  { prefix: '/chat', title: 'Assistant' },
  { prefix: '/projets', title: 'Suivi de projet' },
  { prefix: '/utilisateurs', title: 'Gestion des utilisateurs' },
]

export function getPageTitle(pathname: string): string {
  return PAGE_TITLES.find((entry) => pathname.startsWith(entry.prefix))?.title ?? 'Veolia Steam Dashboard'
}
