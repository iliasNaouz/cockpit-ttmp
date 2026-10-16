# Veolia Steam Dashboard

Application web de supervision de la production de vapeur sur les usines de valorisation énergétique de Rouen et de Bègles. Un agent IA recommande des actions sur des leviers (Poussoir, Grille, Air secondaire…) et produit des diagnostics que les opérateurs évaluent. L'outil suit aussi le déploiement par site et gère les accès.

Stack : Vite, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Recharts, React Router, TanStack Query, react-hook-form + zod, Vitest.

## Lancer le projet

```bash
npm install
npm run dev        # serveur de développement
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run test       # vitest (npx vitest --run pour une exécution unique)
```

## Pages

| Route | Page | Module |
|---|---|---|
| `/login` | Connexion (publique) | — |
| `/ttmp` | TTMP — Production de vapeur | `ttmp` |
| `/thermal` | Thermal Plant Boiler & Steam Production Dashboard | `thermal` |
| `/chat`, `/chat/:conversationId` | Assistant conversationnel | `chat` |
| `/projets`, `/projets/:siteId` | Suivi de projet | `projets` |
| `/utilisateurs` | Gestion des utilisateurs | `utilisateurs` |

## Comptes de démo

Mot de passe commun : `demo1234`. En développement (`npm run dev`), la page de connexion liste ces comptes et un clic pré-remplit le formulaire.

| Nom | Email | Rôle | Sites |
|---|---|---|---|
| Ilias Naouz | `admin@demo.fr` | Administrateur | Rouen, Bègles |
| Claire Martin | `chef@demo.fr` | Chef de projet | Rouen, Bègles |
| Karim Benali | `operateur@demo.fr` | Opérateur | Bègles |
| Sophie Durand | `lecteur@demo.fr` | Lecteur | Rouen |

Huit autres comptes fictifs (dont deux invitations en attente et un compte désactivé) remplissent le tableau des utilisateurs.

## Droits par défaut

| Module | Administrateur | Chef de projet | Opérateur | Lecteur |
|---|---|---|---|---|
| TTMP | écriture | lecture | écriture | lecture |
| Thermal | écriture | lecture | écriture | lecture |
| Chat | écriture | écriture | écriture | aucun |
| Suivi de projet | écriture | écriture | lecture | lecture |
| Utilisateurs | écriture | aucun | aucun | aucun |

Un administrateur peut surcharger le niveau d'un utilisateur module par module. Les administrateurs ont accès à tous les sites.

## Arborescence

```
src/
├── app/            App, router (routes lazy), providers
├── design-system/  tokens, styles de leviers / statuts / rôles, thème des graphiques
├── components/
│   ├── ui/         shadcn/ui (généré)
│   ├── layout/     AppShell, Sidebar, PageHeader, UserMenu, MobileNav
│   └── shared/     Card, KpiTile, pills, onglets, SteamChart, FilterSelect…
├── auth/           permissions (fonctions pures), contexte de session, gardes de routes
├── contexts/       site sélectionné (limité aux sites autorisés)
├── features/       auth, ttmp, thermal-dashboard, chat, projects, users
├── data/           mock/ (données) et services/api.ts (seul point d'accès)
├── types/          modèles de domaine
└── lib/            format, sites, helpers purs
```

Règles : les pages assemblent des composants de leur feature ; les composants lisent les données uniquement via des hooks TanStack Query qui appellent `data/services/api.ts` ; les calculs sont des fonctions pures testées.

## Modifier les couleurs

Toutes les couleurs sont définies une seule fois dans `src/index.css` (bloc `@theme`). Les composants utilisent des classes de token (`bg-brand`, `text-ink-sub`, `border-line`…) ou des références `var(--color-…)` via `src/design-system/`. Aucune couleur hex ne doit apparaître dans `src/features`, `src/components/shared` ni `src/components/layout`. Vérification :

```bash
grep -rnE "#[0-9A-Fa-f]{6}\b" src/features src/components/shared src/components/layout
```

## Brancher la vraie API

Remplacer les mocks ne demande de modifier que `src/data/services/api.ts` : chaque fonction est asynchrone et garde la signature que doit avoir la future API (`login`, `getRecommendations`, `streamChatAnswer` → `AsyncGenerator<string>`, `listUsers`…). Les données mockées vivent dans `src/data/mock/` et ne sont importées par aucun composant.

## Sécurité

Les contrôles de droits du front (masquage de la navigation, `RequirePermission`, boutons désactivés) servent **uniquement à l'ergonomie**. **La vraie API devra vérifier elle-même chaque droit côté serveur** (module, niveau d'accès et site) à chaque requête.

- Les mots de passe ne sont gérés en clair que dans les mocks (`demo1234`). Une vraie API ne stocke et ne compare que des empreintes salées.
- La session (`sessionStorage`, clé `vsd.session`) ne contient jamais de mot de passe.
- Le journal d'accès (connexions, déconnexions, accès refusés, droits modifiés, invitations) est simulé ; il devra être produit et conservé côté serveur.
