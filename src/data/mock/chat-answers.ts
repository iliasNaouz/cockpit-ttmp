import type { ChatAnswer, MessageChart } from '@/types/chat'

export interface AnswerEntry extends ChatAnswer {
  id: string
  keywords: string[]
}

export const STEAM_TREND_CHART: MessageChart = {
  title: 'Débit vapeur — 12 dernières minutes',
  unit: 't/h',
  points: [
    { label: '09:26', value: 36.12 },
    { label: '09:27', value: 36.2 },
    { label: '09:28', value: 36.31 },
    { label: '09:29', value: 36.4 },
    { label: '09:30', value: 36.47 },
    { label: '09:31', value: 36.55 },
    { label: '09:32', value: 36.58 },
    { label: '09:33', value: 36.66 },
    { label: '09:34', value: 36.7 },
    { label: '09:35', value: 36.73 },
    { label: '09:36', value: 36.76 },
    { label: '09:37', value: 36.78 },
  ],
}

export const O2_ANSWER: AnswerEntry = {
  id: 'o2',
  keywords: ['o₂', 'o2', 'oxygène', 'oxygene', 'sit-o2bas', 'fumées'],
  content: `L'oxygène dans les fumées (**BEG0346**) est à **4,23 %**, sous le seuil de 5 % : c'est la situation **SIT-O2BAS** (risque de déficit d'air).

Ce qui ressort des mesures :

- La vapeur est à 36,78 t/h pour une consigne de 36,00 t/h (**+0,78 t/h**) : il n'y a pas besoin de brûler plus.
- Le registre air primaire Zone 2 (**BEG2244**) est à 50 % pour une position mesurée de 48,16 % (**BEG0502**).
- La dépression foyer est à −3,85 mbar pour une consigne de −3,00 mbar.
- Le ventilateur de tirage est à 68,85 % (**BEG1407**) : il reste de la marge.

Je recommande d'ouvrir le registre air primaire Zone 2 de +2 % (50 % → 52 %) puis de surveiller BEG0346 pendant 10 à 15 minutes.`,
  sources: [
    { label: 'BEG0346 · O₂ fumées' },
    { label: 'BEG2244 · Registre Z2' },
    { label: 'Diagnostic 09:38' },
  ],
}

export const FORECAST_ANSWER: AnswerEntry = {
  id: 'forecast',
  keywords: ['prévision', 'prevision', 'prédiction', 'prediction', 'consigne', 'écart', 'ecart', 'vapeur'],
  content: `La vapeur monte régulièrement depuis une douzaine de minutes et se stabilise autour de **36,78 t/h**. La consigne est à **36,00 t/h**, soit un écart de **+0,78 t/h**.

À 15 minutes, l'agent prévoit un retour progressif vers la consigne si aucune action n'est engagée sur les alimentateurs. Le graphique ci-dessous montre la tendance récente.`,
  sources: [{ label: 'Historique 1 h' }, { label: 'Prévision +15 min' }],
  chart: STEAM_TREND_CHART,
}

export const LEVER_ANSWER: AnswerEntry = {
  id: 'levier',
  keywords: ['levier', 'leviers', 'actionner', 'reco', 'recommandation', 'recommandations'],
  content: `Voici la comparaison des leviers recommandés par l'agent sur la dernière heure :

| Levier | Recos | Part | Tendance |
|---|---|---|---|
| Poussoir | 15 | 30 % | Stable |
| Air Secondaire | 13 | 26 % | En hausse |
| Action Manuelle | 10 | 20 % | Stable |
| Grille | 9 | 18 % | En baisse |
| Pression_Z2 | 2 | 4 % | Stable |

Dans la situation actuelle (**SIT-O2BAS**), le levier prioritaire est l'**air primaire Zone 2** : il agit directement sur le déficit d'oxygène sans dégrader la production.`,
  sources: [{ label: 'Recommandations 04:46 → 05:35' }, { label: 'Diagnostic 09:38' }],
}

export const SUMMARY_ANSWER: AnswerEntry = {
  id: 'resume',
  keywords: ['résumé', 'resume', 'synthèse', 'synthese', 'heure', 'alarme', 'bilan'],
  content: `Synthèse de la dernière heure sur **FC1 Bègles** :

- **Production** : vapeur stable entre 35,9 et 37,1 t/h, stabilité à 99 %.
- **Combustion** : O₂ passé sous 5 % à 09:20 (SIT-O2BAS), toujours actif.
- **Agent** : 1 timeout API (09:05), aucune autre anomalie.
- **Actions** : 1 recommandation en attente (registre air primaire Zone 2, +2 %).`,
  sources: [{ label: 'Historique 1 h' }, { label: 'Journal des alarmes' }],
}

export const DEPRESSION_ANSWER: AnswerEntry = {
  id: 'depression',
  keywords: ['dépression', 'depression', 'tirage', 'foyer', 'ventilateur'],
  content: `La dépression foyer mesurée est à **−3,85 mbar** pour une consigne de **−3,00 mbar** (**BEG1405** / **BEG1406**). Le ventilateur de tirage tourne à **68,85 %** (**BEG1407**), ce qui laisse de la marge.

Si l'oxygène ne remonte pas au-dessus de 5 % après 15 minutes, une légère augmentation de la dépression foyer peut compléter l'action sur l'air primaire.`,
  sources: [{ label: 'BEG1405 · Dépression foyer' }, { label: 'BEG1407 · Tirage' }],
}

export const FALLBACK_ANSWER: AnswerEntry = {
  id: 'fallback',
  keywords: [],
  content: `Je n'ai pas assez d'éléments pour répondre précisément. Je peux vous aider sur :

- l'**oxygène dans les fumées** et la situation SIT-O2BAS,
- l'**écart vapeur / consigne** et la prévision à 15 minutes,
- le **choix du levier** à actionner,
- le **résumé de la dernière heure**.

Reformulez votre question avec l'un de ces sujets.`,
  sources: [{ label: 'Historique 1 h' }],
}

/** Ordre de priorité de la recherche par mots-clés. */
export const CHAT_ANSWERS: AnswerEntry[] = [
  DEPRESSION_ANSWER,
  O2_ANSWER,
  LEVER_ANSWER,
  SUMMARY_ANSWER,
  FORECAST_ANSWER,
]
