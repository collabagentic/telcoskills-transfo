# Lot L1 — Accueil

- **Fait** : accueil refondu — accroche « Vous connaissez déjà le télécom. », trois repères (Ce qui reste / Ce qui change / Ce qu'il faut apprendre), trois entrées de poids égal (/roadmap, /cockpit, /contribuer), exemple de fiche lu du contenu (matrice-networkpolicy : avant → après, réflexe, lien, avis d'auteur).
- **Fichiers** : src/app/page.tsx, src/app/accueil.css (nouveau), src/composants/ExempleFiche.tsx (nouveau), src/lib/site.ts (constante FICHE_EXEMPLE), tests/accueil.test.ts (nouveau), ce rapport.
- **Tests** : 72/72 verts ; lint, types, build verts (163 pages statiques). Aucun code Python (ruff/bandit non applicables).
- **Non testé** : rendu visuel 360/390/430 px, thèmes clair et sombre — fait après coup par l'opérateur, pas dans la sandbox.
- **Limites / signalement** : /cockpit sans réponse affiche « Composez d'abord votre feuille de route » (renvoi vers /roadmap) ; il n'existe pas de page de navigation dédiée aux compétences, donc l'entrée « Explorer les compétences » pointe vers /cockpit (programme), seul écran listant les compétences.
