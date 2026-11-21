# Spécification telcoskills-l3 : fiche en trois niveaux de lecture

> Mission L3 du projet TelcoSkills Transformation. Source : `reports/audit-2026-11-21/plan-agents.md` (§1, §2, lot L3).
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Besoin

La fiche est riche mais se lit d'un bloc. Un visiteur qui arrive depuis un lien partagé doit comprendre l'essentiel en 30 secondes, retrouver l'utile en 2 minutes, et pouvoir approfondir ensuite, **sans perdre aucune section existante**.

## Périmètre

- Fichiers à toucher : `src/app/fiche/[id]/page.tsx`, `src/contenu/lecture.ts`, un nouveau composant (par exemple `src/composants/EssentielFiche.tsx`), un **nouveau fichier CSS** `src/composants/essentiel.css`, un nouveau test.
- **Ne pas toucher** `src/app/globals.css` (le lot L1 travaille en parallèle), ni `src/app/page.tsx`, ni `Assistant.tsx`, ni le contenu `content/**` (aucun texte de fiche n'est réécrit).
- **Aucune section supprimée, aucun contenu masqué par défaut** (pas de repli « Lire la suite » : le contenu doit rester lisible à l'impression et sans JavaScript). Ordre des sections inchangé.
- La mise en page « Pilotage » (fil de métro en haut, feuille de route à gauche, lecture au centre, « prochain geste » à droite, une seule colonne sous 62 rem) ne doit pas régresser.
- Les étiquettes « avis d'auteur » restent affichées là où elles le sont aujourd'hui.

## Contenu attendu

1. **Bandeau « L'essentiel en 30 secondes »** en tête de lecture, composé **uniquement de champs existants** : `resume.avant` → `resume.apres`, le réflexe à lâcher (`reflexe`) pour une transposition ou `pourquoiNouveau` pour une nouveauté, et la première puce de `change`. Si un de ces champs figure dans `avisAuteur`, l'étiquette « avis d'auteur » l'accompagne.
2. **Repères de niveaux** : une courte navigation (liens d'ancre) « L'essentiel · En 2 minutes · Approfondir », et des ancres (`id`) posées sur les sections existantes : « En 2 minutes » = ce qui reste vrai, ce qui change, le réflexe, l'exemple télécom ; « Approfondir » = schéma détaillé, piège, épreuve, prompt, ressources, sources, historique. Un petit libellé de niveau peut précéder le premier titre de chaque groupe.
3. **Fonction pure** `essentiel(fiche)` dans `src/contenu/lecture.ts` qui renvoie les éléments du bandeau.

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `L3-C1` : un test Vitest applique `essentiel` aux 21 fiches réelles : jamais de champ vide, textes lus tels quels (aucune réécriture), étiquette présente quand le champ source est dans `avisAuteur`.
- `L3-C2` : le HTML statique de chaque fiche (`out/fiche/<id>/index.html`) contient le bandeau et les trois ancres de niveau ; tous les `<h2>` d'avant les modifications y sont encore (aucune section perdue). Le rapport donne la liste des `<h2>` avant et après pour une fiche de chaque genre.
- `L3-C3` : aucun contenu n'est masqué par défaut ; aucun `<details>` fermé ajouté.
- `L3-C4` : `globals.css` non modifié ; styles dans `essentiel.css` avec les jetons de `tokens.css` (thèmes sombre et clair) ; la règle de repli à une colonne sous 62 rem est conservée.
- `L3-C5` : lint, types, tests et build verts.
- `L3-C6` : le rapport dit ce qui n'a pas pu être vérifié (rendu mobile, diagrammes, thème clair : faits après coup par l'opérateur).
