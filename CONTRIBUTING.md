# Contribuer à TelcoSkills

Une erreur signalée est une contribution. L'auteur s'engage à répondre sous 7 jours. Les mêmes règles sont sur la page « Contribuer » du site.

## Le plus simple : un ticket

Chaque fiche a un bouton « Signaler une erreur » qui ouvre un ticket prérempli. Dites ce qui est faux ou manque, **avec une source**.

## Modifier le contenu

Tout le contenu est en JSON, validé à la construction du site :

| Quoi | Où |
|---|---|
| Une fiche de transformation | `content/fiches/<id>.json` |
| Une compétence (résumé, prérequis, ressources, diagramme) | `content/competences/<domaine>.json` |
| Les questions qui recomposent la feuille de route | `content/orientation.json` |
| Les questions de vérification d'une fiche | `content/questions/<id>.json` |

Règles :
- **Une source par affirmation technique** : documentation officielle, spécification ou texte de référence.
- Ton direct, vouvoiement, pas de jargon inutile.
- Longueurs limitées (puces de 140 caractères, piège de 600) : le site refuse de se construire sinon, et dit quel champ pose problème.
- Un seul sujet par proposition.

## Vérifier avant de proposer

```bash
node node_modules/eslint/bin/eslint.js .
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
node node_modules/next/dist/bin/next build
```

(`npm run lint`, `npm run types`, `npm test` et `npm run build` font la même chose.)

## Licences

Code sous licence MIT, contenu sous licence CC BY-SA 4.0 (voir `LICENSE-CONTENU.md`). En contribuant, vous acceptez que votre contribution soit publiée sous ces licences.
