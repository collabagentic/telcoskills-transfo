# Lot C1 · Accueil corrigé, page des compétences, lien du dépôt

- **Fait** : entrées de l'accueil remontées avant les repères, « Composer ma feuille de route » en btn-principal, « Explorer les compétences » pointe vers /competences ; nouvelle page /competences (titre, phrase d'intro, domaines dans l'ordre, compétences avec niveau, résumé, pastille « fiche » / « N fiches », lien /competence/<id>) ; DEPOT par défaut = collabagentic/telcoskills-transfo (commentaire corrigé, constante locale supprimée de la page fiche).
- **Fichiers** : src/app/page.tsx, src/app/competences/page.tsx (nouveau), src/app/competences/competences.css (nouveau), src/lib/site.ts, src/app/fiche/[id]/page.tsx, tests/accueil.test.ts, tests/competences.test.ts (nouveau), ce rapport.
- **Tests** : 89/89 verts ; lint, types, build verts (164 pages), verifier-sortie 0 erreur. Ruff/bandit : N/A — aucun code Python dans le dépôt.
- **Non testé** : rendu à 375 px, thèmes clair et sombre, navigation clavier — faits après coup par l'opérateur.
- **Limites** : la sortie statique est out/competences.html (Next.js 16, output export), pas out/competences/index.html comme écrit dans la spec (même écart déjà signalé au lot L3).
