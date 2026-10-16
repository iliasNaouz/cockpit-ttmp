import type {
  ActivityEvent,
  ActivityType,
  AdoptionWeek,
  Milestone,
  MilestoneStatus,
  Phase,
  Project,
  Risk,
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TeamMember,
} from '@/types/project'
import type { SiteId } from '@/types/domain'

const HOUR = 3_600_000
const hoursAgo = (hours: number): string => new Date(Date.now() - hours * HOUR).toISOString()

const PHASE_TITLES = [
  'Cadrage',
  'Collecte & qualité des données',
  'Modélisation de l’agent',
  'Pilote en salle de contrôle',
  'Déploiement',
  'Exploitation (Run)',
]

function buildPhases(dates: Array<[string, string]>, currentPhase: number): Phase[] {
  return PHASE_TITLES.map((title, index) => ({
    id: index + 1,
    title,
    startDate: dates[index][0],
    endDate: dates[index][1],
    status:
      index + 1 < currentPhase ? 'termine' : index + 1 === currentPhase ? 'en_cours' : 'a_venir',
  }))
}

const milestone = (
  id: string,
  title: string,
  phaseId: number,
  owner: string,
  dueDate: string,
  status: MilestoneStatus,
): Milestone => ({ id, title, phaseId, owner, dueDate, status })

const task = (
  id: string,
  title: string,
  category: TaskCategory,
  status: TaskStatus,
  dueDate: string,
  assignee: string,
  priority: TaskPriority,
): Task => ({ id, title, category, status, dueDate, assignee, priority })

const event = (
  siteId: SiteId,
  index: number,
  type: ActivityType,
  text: string,
  hours: number,
): ActivityEvent => ({ id: `${siteId}-evt-${index}`, siteId, type, text, at: hoursAgo(hours) })

// ---------------------------------------------------------------- Bègles

const BEGLES_TEAM: TeamMember[] = [
  { id: 't-b1', name: 'Claire Martin', email: 'chef@demo.fr', projectRole: 'Chef de projet', toolRole: 'chef_projet' },
  { id: 't-b2', name: 'Yanis Boucher', email: 'yboucher@demo.fr', projectRole: 'Data scientist', toolRole: 'chef_projet' },
  { id: 't-b3', name: 'Karim Benali', email: 'operateur@demo.fr', projectRole: 'Exploitant référent', toolRole: 'operateur' },
  { id: 't-b4', name: 'Hélène Garnier', email: 'hgarnier@demo.fr', projectRole: 'Automaticien', toolRole: 'operateur' },
  { id: 't-b5', name: 'Julien Perrin', email: 'jperrin@demo.fr', projectRole: 'Data engineer', toolRole: 'lecteur' },
  { id: 't-b6', name: 'Thomas Girard', email: 'tgirard@demo.fr', projectRole: 'Responsable HSE', toolRole: 'lecteur' },
]

const BEGLES_ADOPTION: AdoptionWeek[] = [
  [28, 11, 68], [31, 13, 70], [35, 17, 72], [38, 20, 74], [42, 24, 75], [44, 27, 77],
  [47, 30, 78], [50, 34, 79], [52, 36, 80], [55, 39, 81], [57, 41, 81], [60, 43, 81],
].map(([issued, applied, positivePct], index) => ({
  label: `S${31 + index}`,
  issued,
  applied,
  positivePct,
}))

const BEGLES: Project = {
  siteId: 'begles',
  name: 'Bègles — FC1',
  health: 'en_bonne_voie',
  currentPhase: 4,
  progress: 68,
  adoption: 72,
  positiveRate: 81,
  availability: 98,
  nextMilestoneDate: '2026-10-28',
  manager: BEGLES_TEAM[0],
  team: BEGLES_TEAM,
  adoptionWeeks: BEGLES_ADOPTION,
  phases: buildPhases(
    [
      ['2026-01-12', '2026-02-13'],
      ['2026-02-16', '2026-04-24'],
      ['2026-04-27', '2026-07-17'],
      ['2026-07-20', '2026-11-27'],
      ['2026-11-30', '2027-02-26'],
      ['2027-03-01', '2027-06-30'],
    ],
    4,
  ),
  milestones: [
    milestone('m-b1', 'Lancement du projet', 1, 'Claire Martin', '2026-01-16', 'termine'),
    milestone('m-b2', 'Validation du périmètre', 1, 'Claire Martin', '2026-02-13', 'termine'),
    milestone('m-b3', 'Inventaire des capteurs', 2, 'Hélène Garnier', '2026-03-13', 'termine'),
    milestone('m-b4', 'Qualité des données PCI validée', 2, 'Julien Perrin', '2026-04-24', 'termine'),
    milestone('m-b5', 'Modèle de prédiction vapeur +15 min', 3, 'Yanis Boucher', '2026-06-05', 'termine'),
    milestone('m-b6', 'Validation du modèle O₂', 3, 'Yanis Boucher', '2026-07-17', 'termine'),
    milestone('m-b7', 'Démarrage du pilote en salle de contrôle', 4, 'Karim Benali', '2026-07-27', 'termine'),
    milestone('m-b8', 'Revue mi-pilote', 4, 'Claire Martin', '2026-10-28', 'en_cours'),
    milestone('m-b9', 'Formation des équipes de quart', 4, 'Karim Benali', '2026-11-12', 'a_venir'),
    milestone('m-b10', 'Bilan du pilote', 4, 'Claire Martin', '2026-11-27', 'a_venir'),
  ],
  tasks: [
    task('k-b1', 'Rédiger le guide de l’opérateur', 'Formation', 'a_faire', '2026-11-05', 'Karim Benali', 'haute'),
    task('k-b2', 'Planifier la formation des équipes de quart', 'Formation', 'a_faire', '2026-11-09', 'Claire Martin', 'moyenne'),
    task('k-b3', 'Préparer la recette de déploiement', 'Infra', 'a_faire', '2026-11-20', 'Hélène Garnier', 'moyenne'),
    task('k-b4', 'Étendre l’agent à la ligne FC2', 'Modèle', 'a_faire', '2026-12-18', 'Yanis Boucher', 'basse'),
    task('k-b5', 'Calibrer le seuil d’alerte O₂', 'Modèle', 'en_cours', '2026-10-22', 'Yanis Boucher', 'haute'),
    task('k-b6', 'Fiabiliser l’API ABB', 'Infra', 'en_cours', '2026-10-12', 'Hélène Garnier', 'haute'),
    task('k-b7', 'Affiner l’interface des recommandations', 'Interface', 'en_cours', '2026-10-30', 'Julien Perrin', 'moyenne'),
    task('k-b8', 'Corriger les dérives du capteur BEG0346', 'Données', 'en_cours', '2026-10-25', 'Julien Perrin', 'moyenne'),
    task('k-b9', 'Suivre l’adoption hebdomadaire', 'Données', 'en_cours', '2026-11-02', 'Claire Martin', 'basse'),
    task('k-b10', 'Valider la fenêtre de prédiction', 'Modèle', 'en_revue', '2026-10-20', 'Yanis Boucher', 'haute'),
    task('k-b11', 'Revue UX de la page TTMP', 'Interface', 'en_revue', '2026-10-18', 'Karim Benali', 'moyenne'),
    task('k-b12', 'Documenter l’API de recommandation', 'Infra', 'en_revue', '2026-10-27', 'Hélène Garnier', 'basse'),
    task('k-b13', 'Nettoyage des données PCI', 'Données', 'termine', '2026-04-20', 'Julien Perrin', 'haute'),
    task('k-b14', 'Entraînement du modèle vapeur +15 min', 'Modèle', 'termine', '2026-06-01', 'Yanis Boucher', 'haute'),
    task('k-b15', 'Mise en place du pilote en salle de contrôle', 'Infra', 'termine', '2026-07-24', 'Hélène Garnier', 'moyenne'),
    task('k-b16', 'Atelier de lancement avec les exploitants', 'Formation', 'termine', '2026-07-28', 'Karim Benali', 'basse'),
  ],
  risks: [
    {
      id: 'r-b1',
      title: 'Qualité des données PCI insuffisante',
      description: 'Les mesures de PCI présentent des trous et des dérives qui peuvent biaiser les recommandations.',
      severity: 'elevee',
      probability: 3,
      impact: 4,
      owner: 'Julien Perrin',
      mitigation: 'Contrôles automatiques de cohérence et recalage mensuel avec les analyses laboratoire.',
      status: 'maitrise',
    },
    {
      id: 'r-b2',
      title: 'Disponibilité de l’API ABB',
      description: 'Des timeouts ponctuels de l’API de régulation interrompent la production de recommandations.',
      severity: 'moderee',
      probability: 3,
      impact: 3,
      owner: 'Hélène Garnier',
      mitigation: 'Mise en place d’un mécanisme de reprise et d’une alerte dès deux timeouts consécutifs.',
      status: 'ouvert',
    },
    {
      id: 'r-b3',
      title: 'Adhésion des équipes de quart',
      description: 'Les opérateurs de nuit utilisent moins les recommandations que les équipes de jour.',
      severity: 'moderee',
      probability: 2,
      impact: 4,
      owner: 'Karim Benali',
      mitigation: 'Sessions de formation dédiées et retours d’expérience lors des relèves de quart.',
      status: 'maitrise',
    },
    {
      id: 'r-b4',
      title: 'Dérive du capteur O₂ BEG0346',
      description: 'Le capteur d’oxygène des fumées peut dériver entre deux étalonnages.',
      severity: 'faible',
      probability: 2,
      impact: 2,
      owner: 'Hélène Garnier',
      mitigation: 'Étalonnage trimestriel réalisé et comparaison automatique avec la mesure redondante.',
      status: 'clos',
    },
  ] satisfies Risk[],
  activity: [
    event('begles', 1, 'evaluation', 'Évaluation positive du diagnostic de 09:38 par Karim Benali', 1),
    event('begles', 2, 'tache', 'Tâche « Fiabiliser l’API ABB » passée en cours', 5),
    event('begles', 3, 'deploiement', 'Agent mis à jour en version 0.9.4 sur la ligne FC1', 22),
    event('begles', 4, 'tache', 'Tâche « Revue UX de la page TTMP » passée en revue', 30),
    event('begles', 5, 'risque', 'Risque « Adhésion des équipes de quart » passé à Maîtrisé', 52),
    event('begles', 6, 'jalon', 'Jalon « Revue mi-pilote » planifié au 28/10', 76),
    event('begles', 7, 'evaluation', '12 recommandations évaluées sur la semaine', 100),
    event('begles', 8, 'tache', 'Tâche « Nettoyage des données PCI » terminée', 140),
    event('begles', 9, 'deploiement', 'Pilote étendu à l’équipe de nuit', 190),
    event('begles', 10, 'jalon', 'Jalon « Démarrage du pilote » validé', 260),
  ],
}

// ----------------------------------------------------------------- Rouen

const ROUEN_TEAM: TeamMember[] = [
  { id: 't-r1', name: 'Julie Lefèvre', email: 'jlefevre@demo.fr', projectRole: 'Chef de projet', toolRole: 'chef_projet' },
  { id: 't-r2', name: 'Nadia Chevalier', email: 'nchevalier@demo.fr', projectRole: 'Data scientist', toolRole: 'chef_projet' },
  { id: 't-r3', name: 'Marc Dubois', email: 'mdubois@demo.fr', projectRole: 'Exploitant référent', toolRole: 'operateur' },
  { id: 't-r4', name: 'Antoine Leroy', email: 'aleroy@demo.fr', projectRole: 'Automaticien', toolRole: 'operateur' },
  { id: 't-r5', name: 'Emma Blanc', email: 'eblanc@demo.fr', projectRole: 'Data engineer', toolRole: 'lecteur' },
  { id: 't-r6', name: 'Sophie Durand', email: 'lecteur@demo.fr', projectRole: 'Responsable HSE', toolRole: 'lecteur' },
]

const ROUEN_ADOPTION: AdoptionWeek[] = [
  [18, 4, 62], [20, 5, 64], [22, 6, 65], [25, 8, 68], [27, 9, 70], [28, 10, 71],
  [30, 12, 72], [32, 13, 73], [34, 14, 74], [35, 15, 74], [36, 15, 74], [38, 16, 74],
].map(([issued, applied, positivePct], index) => ({
  label: `S${31 + index}`,
  issued,
  applied,
  positivePct,
}))

const ROUEN: Project = {
  siteId: 'rouen',
  name: 'Rouen — Ligne 2',
  health: 'a_surveiller',
  currentPhase: 3,
  progress: 52,
  adoption: 41,
  positiveRate: 74,
  availability: 94,
  nextMilestoneDate: '2026-11-06',
  manager: ROUEN_TEAM[0],
  team: ROUEN_TEAM,
  adoptionWeeks: ROUEN_ADOPTION,
  phases: buildPhases(
    [
      ['2026-02-02', '2026-03-06'],
      ['2026-03-09', '2026-06-12'],
      ['2026-06-15', '2026-11-06'],
      ['2026-11-09', '2027-02-12'],
      ['2027-02-15', '2027-05-28'],
      ['2027-06-01', '2027-09-30'],
    ],
    3,
  ),
  milestones: [
    milestone('m-r1', 'Lancement du projet', 1, 'Julie Lefèvre', '2026-02-06', 'termine'),
    milestone('m-r2', 'Validation du périmètre', 1, 'Julie Lefèvre', '2026-03-06', 'termine'),
    milestone('m-r3', 'Inventaire des capteurs', 2, 'Antoine Leroy', '2026-04-10', 'termine'),
    milestone('m-r4', 'Qualité des données PCI validée', 2, 'Emma Blanc', '2026-06-12', 'termine'),
    milestone('m-r5', 'Modèle de prédiction vapeur +15 min', 3, 'Nadia Chevalier', '2026-08-28', 'termine'),
    milestone('m-r6', 'Validation du modèle O₂', 3, 'Nadia Chevalier', '2026-10-02', 'en_retard'),
    milestone('m-r7', 'Recette du modèle de recommandation', 3, 'Julie Lefèvre', '2026-11-06', 'en_cours'),
    milestone('m-r8', 'Démarrage du pilote en salle de contrôle', 4, 'Marc Dubois', '2026-11-16', 'a_venir'),
    milestone('m-r9', 'Formation des équipes de quart', 4, 'Marc Dubois', '2026-12-10', 'a_venir'),
    milestone('m-r10', 'Bilan du pilote', 4, 'Julie Lefèvre', '2027-02-12', 'a_venir'),
  ],
  tasks: [
    task('k-r1', 'Préparer le plan de pilote', 'Infra', 'a_faire', '2026-11-10', 'Julie Lefèvre', 'haute'),
    task('k-r2', 'Rédiger le guide de l’opérateur', 'Formation', 'a_faire', '2026-11-30', 'Marc Dubois', 'moyenne'),
    task('k-r3', 'Configurer les accès de la salle de contrôle', 'Infra', 'a_faire', '2026-11-13', 'Antoine Leroy', 'moyenne'),
    task('k-r4', 'Définir les indicateurs de succès du pilote', 'Données', 'a_faire', '2026-11-20', 'Emma Blanc', 'basse'),
    task('k-r5', 'Réentraîner le modèle O₂', 'Modèle', 'en_cours', '2026-10-09', 'Nadia Chevalier', 'haute'),
    task('k-r6', 'Compléter les données PCI manquantes', 'Données', 'en_cours', '2026-10-14', 'Emma Blanc', 'haute'),
    task('k-r7', 'Maquette de l’écran de recommandations', 'Interface', 'en_cours', '2026-10-28', 'Emma Blanc', 'moyenne'),
    task('k-r8', 'Raccorder l’API de régulation', 'Infra', 'en_cours', '2026-10-30', 'Antoine Leroy', 'moyenne'),
    task('k-r9', 'Analyser les écarts de prédiction', 'Modèle', 'en_cours', '2026-11-03', 'Nadia Chevalier', 'basse'),
    task('k-r10', 'Valider le jeu de test vapeur', 'Modèle', 'en_revue', '2026-10-16', 'Nadia Chevalier', 'haute'),
    task('k-r11', 'Revue des seuils d’alerte', 'Modèle', 'en_revue', '2026-10-21', 'Marc Dubois', 'moyenne'),
    task('k-r12', 'Revue de la maquette TTMP', 'Interface', 'en_revue', '2026-10-23', 'Julie Lefèvre', 'basse'),
    task('k-r13', 'Inventaire des capteurs ROU_xxxx', 'Données', 'termine', '2026-04-08', 'Antoine Leroy', 'haute'),
    task('k-r14', 'Collecte de l’historique 12 mois', 'Données', 'termine', '2026-05-22', 'Emma Blanc', 'haute'),
    task('k-r15', 'Premier modèle vapeur +15 min', 'Modèle', 'termine', '2026-08-26', 'Nadia Chevalier', 'moyenne'),
    task('k-r16', 'Atelier de lancement avec les exploitants', 'Formation', 'termine', '2026-02-10', 'Marc Dubois', 'basse'),
  ],
  risks: [
    {
      id: 'r-r1',
      title: 'Qualité des données PCI insuffisante',
      description: 'L’historique PCI de la ligne 2 contient de longues périodes sans mesure fiable.',
      severity: 'critique',
      probability: 4,
      impact: 5,
      owner: 'Emma Blanc',
      mitigation: 'Reconstitution à partir des analyses laboratoire et ajout d’un contrôle qualité en entrée de pipeline.',
      status: 'ouvert',
    },
    {
      id: 'r-r2',
      title: 'Retard de validation du modèle O₂',
      description: 'La validation du modèle O₂ dépasse l’échéance et décale la recette du modèle.',
      severity: 'elevee',
      probability: 4,
      impact: 3,
      owner: 'Nadia Chevalier',
      mitigation: 'Réentraînement avec les données corrigées et point hebdomadaire avec l’exploitant référent.',
      status: 'ouvert',
    },
    {
      id: 'r-r3',
      title: 'Adhésion des équipes de quart',
      description: 'Les équipes de quart connaissent peu l’outil, le pilote n’ayant pas encore démarré.',
      severity: 'moderee',
      probability: 3,
      impact: 3,
      owner: 'Marc Dubois',
      mitigation: 'Présentations en relève de quart et désignation d’un référent par équipe.',
      status: 'maitrise',
    },
    {
      id: 'r-r4',
      title: 'Disponibilité de l’API ABB',
      description: 'L’API de régulation est peu disponible en dehors des heures ouvrées.',
      severity: 'faible',
      probability: 2,
      impact: 2,
      owner: 'Antoine Leroy',
      mitigation: 'Supervision de la disponibilité et astreinte pendant le pilote.',
      status: 'maitrise',
    },
  ] satisfies Risk[],
  activity: [
    event('rouen', 1, 'risque', 'Risque « Retard de validation du modèle O₂ » ouvert', 3),
    event('rouen', 2, 'tache', 'Tâche « Réentraîner le modèle O₂ » passée en cours', 9),
    event('rouen', 3, 'jalon', 'Jalon « Validation du modèle O₂ » en retard (échéance 02/10)', 24),
    event('rouen', 4, 'evaluation', '8 recommandations évaluées sur la semaine', 48),
    event('rouen', 5, 'tache', 'Tâche « Valider le jeu de test vapeur » passée en revue', 60),
    event('rouen', 6, 'deploiement', 'Agent mis à jour en version 0.8.1 sur la ligne 2', 96),
    event('rouen', 7, 'tache', 'Tâche « Collecte de l’historique 12 mois » terminée', 150),
    event('rouen', 8, 'risque', 'Risque « Adhésion des équipes de quart » passé à Maîtrisé', 200),
    event('rouen', 9, 'jalon', 'Jalon « Modèle de prédiction vapeur +15 min » validé', 280),
    event('rouen', 10, 'jalon', 'Jalon « Recette du modèle » planifié au 06/11', 340),
  ],
}

export const PROJECTS: Project[] = [BEGLES, ROUEN]
