# Lot L3 · Fiche en trois niveaux de lecture

Fait : bandeau « L'essentiel en 30 secondes » (composé de resume, reflexe/pourquoiNouveau et première puce de change ; étiquettes « avis d'auteur » conservées) et repères de niveaux (navigation « L'essentiel · En 2 minutes · Approfondir », ancres #essentiel, #en-2-minutes, #approfondir). Aucune section supprimée, aucun contenu masqué par défaut, aucun détail fermé ajouté, ordre des sections inchangé.

Fichiers : src/app/fiche/[id]/page.tsx (modifié), src/contenu/lecture.ts (modifié), src/composants/EssentielFiche.tsx (nouveau), src/composants/essentiel.css (nouveau), tests/essentiel.test.ts (nouveau). Non touchés : src/app/globals.css, src/app/page.tsx, Assistant.tsx, content/**.

Qualité : npm run lint OK · npm run types OK · npm test OK (74 tests, 10 fichiers, dont 3 nouveaux essentiel) · npm run build OK (163 pages statiques, 21 fiches). Ruff/bandit : sans objet — aucun fichier .py dans le dépôt (git ls-files '*.py' = 0).

L3-C2, h2 avant → après. Transposition vm-pod : avant = [Ce qui reste vrai · Ce qui change · Le schéma · Le réflexe à lâcher · Le piège · En télécom, concrètement · Posez la bonne question à votre IA · Un cas · Compétences de la feuille de route · Pour aller plus loin · Historique de la fiche] (11) ; après = mêmes 11 + [L'essentiel en 30 secondes] en tête (12). Nouveauté reconciliation : mêmes 11 + [L'essentiel en 30 secondes]. Aucun h2 perdu.

Non testé : rendu mobile (360/390/430), thème clair, diagrammes, focus clavier — faits après coup par l'opérateur (navigateur, hors sandbox).

Limites : le HTML statique est out/fiche/<id>.html (Next.js 16 output export), pas out/fiche/<id>/index.html comme l'exemple de la spec ; .config/ (cache de build Next) ajouté à .gitignore.
