# Spécification telcoskills-c1 : accueil corrigé, page des compétences, lien du dépôt

> Lot de correction C1 du projet TelcoSkills Transformation. Source : relecture de la PR L1 (accueil) du 2026-11-22, `reports/audit-2026-11-21/plan-agents.md` (lot L1) et audit du 21 novembre 2026.
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Préalable (à vérifier en premier)

Ce lot corrige le résultat des lots L1 (accueil) et L3 (fiche), supposés **déjà fusionnés dans `main`**. Vérifier : `src/app/accueil.css`, `src/composants/ExempleFiche.tsx`, `FICHE_EXEMPLE` dans `src/lib/site.ts` et `src/composants/EssentielFiche.tsx` existent. Si l'un manque, **s'arrêter** et publier un rapport `"statut": "bloque"` : ne rien recréer.

## Besoin

La relecture de l'accueil a relevé trois défauts :

1. Sur mobile (375 × 812 px), les trois entrées sont sous la première fenêtre (les trois repères les repoussent à environ 930 px), et elles ont toutes le même style discret : l'action principale n'est plus mise en avant.
2. « Explorer les compétences » mène à `/cockpit`, qui affiche « Composez d'abord votre feuille de route » à un visiteur qui n'a rien répondu : impasse. Aucune page ne permet de parcourir librement les compétences.
3. Les liens « Signaler une erreur » et « Proposer une correction » pointent vers `taoufikbo/telcoskills-transfo` (dépôt privé de l'auteur), alors que le dépôt public est `collabagentic/telcoskills-transfo` : lien mort pour tout visiteur.

## Périmètre

- Fichiers à toucher : `src/app/page.tsx`, `src/app/accueil.css`, un **nouveau** `src/app/competences/page.tsx` avec son CSS dans un **nouveau** fichier (par exemple `src/app/competences/competences.css`), `src/lib/site.ts` (constante `DEPOT` uniquement), `src/app/fiche/[id]/page.tsx` (uniquement la constante `DEPOT` locale, à remplacer par l'import de `site.ts`), `tests/accueil.test.ts` et un nouveau test, `reports/lots/telcoskills-c1.md`.
- **Ne pas toucher** : `src/app/globals.css`, `src/composants/Assistant.tsx`, `src/lib/parcours.ts`, le contenu `content/**` (aucun texte de fiche ni de compétence n'est réécrit), `src/composants/EssentielFiche.tsx`, `.github/`, `package.json`.
- Aucune dépendance ajoutée. Pas de refonte du design : jetons de `tokens.css` uniquement, classes existantes réutilisées (`btn`, `btn-principal`, `pastille`).
- Le fil « Reprendre votre feuille de route » (`Reprise`) et l'exemple de fiche de l'accueil restent en place.
- **Ne jamais committer** de fichiers générés par les outils (`.config/`, `.local/`, `.next/`, `out/`, `node_modules/`) : vérifier `git status` avant de publier.

## Contenu attendu

1. **Accueil** : ordre dans la section : sur-titre, titre, accroche, **entrées**, puis les trois repères, puis l'exemple de fiche. « Composer ma feuille de route » prend la classe `btn btn-principal` ; les deux autres entrées gardent `btn`. L'entrée « Explorer les compétences » pointe vers `/competences`. Les textes des repères et des entrées sont conservés tels quels.
2. **Page `/competences`** (export statique, sans JavaScript client) : titre `<h1>` « Les compétences », une phrase d'introduction sans chiffre écrit à la main, puis un bloc par domaine dans l'ordre de `content/domaines.json` : `<h2>` du domaine, et pour chaque compétence du domaine : titre (lien vers `/competence/<id>`), niveau (même libellés que la page compétence), résumé tel que dans les données, et une pastille « fiche » ou « N fiches » quand au moins une fiche la couvre (lien vers la première fiche). Les nombres affichés (compétences, domaines) sont calculés depuis `chargerContenu()`. Métadonnées : titre de page et description non vides. Mise en page lisible à 375 px, sans défilement horizontal, thèmes clair et sombre.
3. **Lien du dépôt** : `DEPOT` par défaut = `collabagentic/telcoskills-transfo` dans `src/lib/site.ts` ; la page fiche importe `DEPOT` depuis `@/lib/site` au lieu de redéfinir sa constante ; le commentaire de `DEPOT` est corrigé (le dépôt est public). La variable d'environnement `NEXT_PUBLIC_DEPOT` garde sa priorité.
4. **Rapport** `reports/lots/telcoskills-c1.md` (≤ 10 lignes : fait, fichiers, tests, **non testé**, limites).

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `C1-C1` : dans le HTML statique de l'accueil (`out/index.html`), le lien « Composer ma feuille de route » porte `btn-principal` et les trois entrées apparaissent **avant** le premier titre de repère ; un test Vitest le vérifie sur le source de la page ou sur la sortie construite.
- `C1-C2` : « Explorer les compétences » pointe vers `/competences`, et `out/competences/index.html` existe.
- `C1-C3` : la page `/competences` liste **toutes** les compétences de `content/competences/` (nombre égal), groupées par domaine dans l'ordre de `domaines.json`, chacune avec un lien vers `/competence/<id>` existant ; un test Vitest compare avec `chargerContenu()`.
- `C1-C4` : aucune valeur chiffrée ni aucun texte de compétence écrit à la main : tout vient de `chargerContenu()` ; `content/**` inchangé.
- `C1-C5` : `DEPOT` vaut `collabagentic/telcoskills-transfo` par défaut, il n'existe plus qu'une seule définition de `DEPOT` dans `src/`, et un test vérifie que le défaut n'est plus `taoufikbo/…`.
- `C1-C6` : `globals.css`, `Assistant.tsx`, `parcours.ts` non modifiés ; aucun fichier généré par un outil dans le diff.
- `C1-C7` : lint, types, tests et build verts ; si le script `verifier-sortie` existe dans `package.json`, il passe sur la nouvelle sortie (nouvelle page comprise).
- `C1-C8` : le rapport dit ce qui n'a pas pu être vérifié (rendu à 375 px et position des entrées dans la première fenêtre, thèmes clair et sombre, navigation clavier : faits après coup par l'opérateur).
