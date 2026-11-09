# TelcoSkills · Transformation — consignes de session

Produit : aider un professionnel du télécom à **transformer** ses compétences existantes vers le cloud natif
(« Votre matrice de flux, version NetworkPolicy »). Pas de roadmap, pas de départ de zéro.
Le backlog complet, les écrans, le modèle de contenu et l'ordre des lots sont dans **`BACKLOG.md`** : il fait foi.

## Comment travailler

- Un lot à la fois (`BACKLOG.md` §9). Depuis la refonte du 2026-11-09, `BACKLOG.md` §13 fait foi sur le produit : une feuille de route vivante, plus de métier à choisir. Aux points d'arrêt, s'arrêter et attendre l'auteur ; ailleurs, enchaîner.
- Fin de lot : lint, types, tests, build verts ; captures (E10-3) ; résumé ≤ 10 lignes dans `reports/lots/<n>.md`.
- Français partout (interface, commits, docs). Ton direct, pas de jargon. Vouvoiement à l'écran.
- Ne rouvre pas les principes et l'anti-périmètre (`BACKLOG.md` §2). Une contradiction trouvée : la signaler, chiffre à l'appui.
- Rien d'inventé : toute affirmation technique d'une fiche a une source ; tout contenu neuf est `statut: "brouillon"`.
- Une dépendance ajoutée = une ligne de justification dans le commit. React Flow est autorisé pour la carte de transformation (décision de l'auteur, 2026-11-09) ; pas de dagre, le placement est maison (`src/lib/carte.ts`).
- Aucun déploiement, aucune fusion, aucun push sans accord explicite de l'auteur dans la conversation.

## Commandes (npm et npx sont bloqués sur ce poste : passer par node)

```bash
node node_modules/next/dist/bin/next dev -p 3000
node node_modules/eslint/bin/eslint.js .
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
node node_modules/next/dist/bin/next build
```

Arrêter `next dev` avant un build. Installer les paquets : `node <chemin de npm-cli.js> install` si `npm` est bloqué.

## Pièges connus (repris de l'ancien projet)

- Cette version de Next.js a des changements incompatibles : lire `node_modules/next/dist/docs/` avant d'utiliser une API Next.
- Vercel (plan Hobby) bloque un déploiement dont le commit n'est pas signé par le propriétaire du compte. Avant le premier
  commit : `git config user.name "Taoufik Bouazza"` et `git config user.email` = celle de `git -C ../telcoskills config user.email`.
- Ne jamais importer `node:fs` dans un composant client : le chargement du contenu vit dans `src/contenu/` (serveur, build).
- Règles ESLint react-hooks strictes : pas de lecture ni d'écriture de ref pendant le rendu.
- Le stockage local (`ts:bilan`) n'est lu qu'après hydratation : l'état vide est le rendu serveur, sans clignotement.

## Ancien code à consulter (lecture seule, ne jamais modifier)

- `../telco/telcocloud-roadmaps` : système visuel v4, passerelles, questions, landscape, produits Consentement/Mesure.
- `../telcoskills` : dépôt public, CI, licences.
