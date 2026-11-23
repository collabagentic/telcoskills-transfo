# Lot telcoskills-c2 — restitution de l'assistant, raisons précises

- Fait : chaque priorité affiche sa raison (moteur) puis une seconde ligne propre à la compétence — son résumé, ou « Prérequis de « X » » si c'est un prérequis — via la fonction pure `detailPriorite` ; « Ce que vous maîtrisez déjà » est limité à 6 compétences puis « … et N autres » (décompte exact) via `limiterAcquis`.
- Fichiers : `src/lib/parcours.ts`, `src/composants/Assistant.tsx`, `src/composants/assistant.css`, `src/contenu/publiques.ts` (champ `resume` exposé), `tests/parcours.test.ts`.
- Tests : 94 verts (dont C2-C1 à C2-C4) ; lint, types, build et `verifier-sortie` verts (0 erreur, 0 avertissement).
- Non testé : rendu mobile, clavier, thèmes clair et sombre (à faire par l'opérateur après coup).
- Limites : `ruff`/`bandit` sans objet — aucun fichier Python dans le dépôt.
