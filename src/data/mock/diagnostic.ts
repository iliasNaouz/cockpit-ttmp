import type { Diagnostic } from '@/types/domain'

export const DIAGNOSTIC: Diagnostic = {
  diagnostic:
    "L'oxygène dans les fumées (BEG0346) est à 4,23 %, en dessous du seuil de 5 % — situation SIT-O2BAS (oxygène dans les fumées très bas, risque de déficit d'air en combustion). Le four est en marche, en mode ABB. La production de vapeur mesurée est à 36,78 t/h pour une consigne de 36,00 t/h (écart de +0,78 t/h) : la vapeur est légèrement au-dessus de la consigne, ce qui confirme que la priorité n'est pas d'augmenter la combustion mais de corriger le déficit d'air. Le registre air primaire Zone 2 (BEG2244) est en consigne à 50 %, avec une position mesurée à 48,16 % (BEG0502). La dépression foyer mesurée est à −3,85 mbar pour une consigne de −3,00 mbar (BEG1405 / BEG1406), le ventilateur de tirage est à 68,85 % (BEG1407), ce qui indique une marge disponible.",
  action:
    "Ouvrir le registre air primaire Zone 2 (BEG2244) de +2 %, en passant la consigne de 50 % à 52 %, afin d'augmenter l'apport d'air en zone de combustion active et de faire remonter l'oxygène dans les fumées au-dessus de 5 %. Surveiller BEG0346 dans les 10 à 15 minutes suivant l'action. Délai avant prochaine action possible : 30 minutes.",
  why: "En situation SIT-O2BAS, la priorité absolue est de rétablir un niveau d'oxygène suffisant pour garantir une combustion complète et éviter la formation d'imbrûlés. Ouvrir le registre air primaire Zone 2 est le levier prioritaire en mode ABB : c'est la zone de combustion active, et un apport d'air supplémentaire permet de corriger rapidement le déficit d'oxygène. La vapeur étant déjà légèrement au-dessus de la consigne (+0,78 t/h), cette ouverture ne risque pas de dégrader la production. Si l'oxygène ne remonte pas au-dessus de 5 % après 15 minutes, envisager en complément une légère augmentation de la dépression foyer (BEG_1406) — le ventilateur de tirage à 68,85 % dispose de marge. ⚠ Annuler l'action et revenir à 50 % si la température foyer dépasse 1 000 °C ou si le CO dépasse 100 mg/Nm³.",
  generatedAt: '09:38',
  updatedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
}
