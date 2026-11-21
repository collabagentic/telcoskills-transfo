# Spécification telcoskills-l1 : accueil

> Mission L1 du projet TelcoSkills Transformation. Source : `reports/audit-2026-11-21/plan-agents.md` (§1, §2, lot L1) du dépôt, au commit de base.
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Besoin

Un professionnel du télécom qui arrive sur l'accueil doit comprendre en quelques secondes : ce que le site fait pour lui, qu'il ne repart pas de zéro, et ce qu'il peut faire (composer sa feuille de route, explorer, contribuer). Aujourd'hui : un slogan, une seule action, aucun exemple.

## Périmètre

- Fichiers à toucher : `src/app/page.tsx`, **un nouveau fichier CSS** `src/app/accueil.css` (importé par la page), éventuellement un nouveau composant `src/composants/ExempleFiche.tsx`, `src/lib/site.ts` (une seule constante), un nouveau test.
- **Ne pas toucher** `src/app/globals.css` (le lot L3 y travaille en parallèle : conflit à éviter), ni `Assistant.tsx`, ni `src/app/fiche/`.
- Garder `<Reprise>` au-dessus de la section d'accueil, inchangé.
- Pas de compteur ni de chiffre sur l'accueil (`DESIGN.md`). Pas d'animation continue. Respecter `prefers-reduced-motion`.
- Textes d'interface en français, vouvoiement, sans jargon. Le site reste statique (`output: "export"`).

## Contenu attendu

1. **Accroche** : « Vous connaissez déjà le télécom. » en titre ; sous le titre, une phrase : le cloud natif change les architectures et les pratiques, mais pas tout ce que vous avez appris ne devient inutile.
2. **Trois repères** : « Ce qui reste. » « Ce qui change. » « Ce qu'il faut apprendre. », chacun avec une phrase courte.
3. **Trois entrées de poids égal** : « Composer ma feuille de route » → `/roadmap` ; « Explorer les compétences » → `/cockpit` ; « Contribuer » → `/contribuer`. Avant de brancher la deuxième, vérifier ce que `/cockpit` affiche quand aucune réponse n'est donnée et le dire dans le rapport ; si l'écran est vide ou trompeur, pointer vers la meilleure page existante et le signaler.
4. **Un exemple réel** : une fiche existante, choisie par une constante exportée `FICHE_EXEMPLE` (identifiant) dans `src/lib/site.ts`. Afficher son « avant → après » (`resume.avant`, `resume.apres`), son réflexe à lâcher (`reflexe`, pour une transposition) et un lien vers `/fiche/<id>`. Les textes sont **lus dans le contenu au build**, jamais recopiés. Choisir une fiche de genre « transposition » avec un réflexe (par exemple `matrice-networkpolicy`) et justifier le choix dans le rapport.
5. Si la fiche d'exemple porte une étiquette « avis d'auteur » pour le champ affiché (`avisAuteur`), l'afficher aussi.

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `L1-C1` : la page d'accueil contient le titre « Vous connaissez déjà le télécom. » et les trois repères « Ce qui reste », « Ce qui change », « Ce qu'il faut apprendre ».
- `L1-C2` : trois liens de même style vers `/roadmap`, `/cockpit` et `/contribuer` (ou le remplaçant justifié du deuxième), présents dans le HTML statique `out/index.html`.
- `L1-C3` : l'exemple est lu depuis `content/fiches/<FICHE_EXEMPLE>.json` ; un test Vitest vérifie que `FICHE_EXEMPLE` existe, est une transposition et a un réflexe.
- `L1-C4` : `<Reprise>` est conservé ; aucun compteur ; aucun fichier `globals.css` modifié ; les styles sont dans `src/app/accueil.css` et n'utilisent que les jetons de `tokens.css` (thèmes sombre et clair).
- `L1-C5` : lint, types, tests et build verts (`node node_modules/eslint/bin/eslint.js .`, `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/next/dist/bin/next build`).
- `L1-C6` : le rapport dit ce qui n'a pas pu être vérifié (rendu visuel à 360, 390 et 430 px, clair et sombre : fait après coup par l'opérateur, pas dans la sandbox).
