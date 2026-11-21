# Spécification telcoskills-l2 : assistant et restitution

> Mission L2 du projet TelcoSkills Transformation. Source : `reports/audit-2026-11-21/plan-agents.md` (§1, §2, lot L2) et `BACKLOG.md` §13 (la feuille de route vivante fait foi sur le produit).
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Besoin

Avant de commencer le questionnaire, rien n'est annoncé (nombre de questions, durée, absence de compte). À la fin, la restitution doit donner une compréhension actionnable : ce que vous maîtrisez déjà, puis **trois priorités au plus** pour commencer, chacune avec sa raison.

## Périmètre

- Fichiers à toucher : `src/composants/Assistant.tsx` (et ses sous-composants si besoin), `src/lib/parcours.ts`, `tests/parcours.test.ts` (ou un nouveau test), un **nouveau fichier CSS** `src/composants/assistant.css` pour les styles neufs.
- **Ne pas toucher** `src/app/globals.css`, `src/app/page.tsx`, `src/app/fiche/`.
- **D'abord inspecter** l'écran final actuel de l'assistant et le cockpit (`Cockpit.tsx`, `Reprise.tsx`) ; ne changer que l'écart avec le besoin, et dire dans le rapport ce qui existait déjà.
- Le format de stockage local `ts:bilan` ne change pas (`src/lib/stockage.ts` et ses tests restent verts, sans migration).
- Pas de score, pas de pourcentage inventé : le moteur donne des effets lisibles (acquis, poids de domaine, cible, écarté), pas une note.
- Pas de compte, rien n'est envoyé sur le réseau.

## Contenu attendu

1. **Écran d'entrée** (quand aucune réponse n'est enregistrée) : « N questions · environ 2 minutes · sans compte · vos réponses restent dans votre navigateur », bouton « Commencer ». N est lu dans `content/orientation.json`. Quand des réponses existent déjà, ne pas imposer cet écran : reprendre là où l'on en était, comme aujourd'hui.
2. **Écran final** : en haut « Ce que vous maîtrisez déjà » (les compétences marquées acquises par les réponses, liste courte, masquée si vide) ; puis « Par où commencer » : **trois priorités au plus**, chacune avec la compétence, la raison (le moteur sait déjà dire « pourquoi cette étape »), et un lien vers sa fiche si elle en a une, sinon vers `/competence/<id>` ; un bouton « Voir toute ma feuille de route » vers `/cockpit`.
3. **Fonction pure** `priorites(...)` dans `src/lib/parcours.ts` : déterministe, au plus 3 éléments, sans doublon, ordre stable, tableau vide quand aucune réponse n'a été donnée. La règle de choix s'appuie sur les données déjà calculées par le moteur (prochaines étapes de la feuille recomposée) ; la décrire en commentaire en deux phrases.

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `L2-C1` : l'écran d'entrée affiche le nombre de questions lu dans `orientation.json`, la durée, « sans compte » ; il n'apparaît pas quand des réponses existent.
- `L2-C2` : l'écran final contient au plus trois priorités, chacune avec une raison non vide et un lien valide (fiche ou compétence existante) ; aucun score ni pourcentage.
- `L2-C3` : `priorites` est une fonction pure couverte par au moins 4 tests : aucune réponse, quelques réponses, toutes les réponses, déterminisme (même entrée, même sortie).
- `L2-C4` : « ‹ Précédente » conserve les réponses ; le stockage `ts:bilan` est inchangé ; tests `stockage` et `parcours` existants verts.
- `L2-C5` : sans réponse, la feuille de route complète reste affichée comme aujourd'hui (`BACKLOG.md` §13).
- `L2-C6` : lint, types, tests et build verts.
- `L2-C7` : le rapport dit ce qui n'a pas pu être vérifié (mobile, clavier, clair et sombre : faits après coup par l'opérateur).
