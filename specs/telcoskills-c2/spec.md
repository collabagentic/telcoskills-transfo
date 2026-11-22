# Spécification telcoskills-c2 : restitution de l'assistant, raisons précises

> Lot de correction C2 du projet TelcoSkills Transformation. Source : relecture de la PR L2 (assistant) du 2026-11-22 et `reports/audit-2026-11-21/plan-agents.md` (lot L2).
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Préalable (à vérifier en premier)

Ce lot corrige le résultat du lot L2, supposé **déjà fusionné dans `main`**. Vérifier : `priorites` existe dans `src/lib/parcours.ts` et `src/composants/assistant.css` existe. Si l'un manque, **s'arrêter** et publier un rapport `"statut": "bloque"` : ne rien recréer.

## Besoin

La relecture de la restitution a relevé deux défauts :

1. **Raisons indifférenciées.** Les trois priorités de « Par où commencer » affichent la même raison (par exemple « Kubernetes et OpenShift : votre métier, votre point de départ »), parce que le moteur donne une raison **par domaine**. Le visiteur ne sait pas pourquoi *cette* compétence passe avant les autres.
2. **Liste d'acquis trop longue.** « Ce que vous maîtrisez déjà » peut afficher 18 compétences : la restitution se noie et les priorités sont repoussées.

## Périmètre

- Fichiers à toucher : `src/composants/Assistant.tsx`, `src/composants/assistant.css`, `src/lib/parcours.ts` (ajout ou extension de la fonction pure de restitution ; `recombiner`, `cumulerEffets` et les types existants restent compatibles), `tests/parcours.test.ts` (ou un nouveau test), `reports/lots/telcoskills-c2.md`.
- Si la précision demande une donnée déjà présente dans le contenu mais absente des données publiques (par exemple le résumé d'une compétence), on peut l'exposer dans `src/contenu/publiques.ts` (ajout d'un champ, sans changer les autres), en le disant dans le rapport.
- **Ne pas toucher** : `src/app/globals.css`, `src/app/page.tsx`, `src/app/fiche/`, `src/lib/stockage.ts` (le format `ts:bilan` ne change pas), `content/**`.
- Aucune dépendance ajoutée. Pas de score, pas de pourcentage, rien envoyé sur le réseau.
- Rien d'inventé : aucune phrase de raison n'est rédigée par l'agent pour une compétence donnée. Une raison est **composée à partir de données existantes** : l'objectif ou le poste choisi (libellés des options répondues dans `orientation.json`), le domaine, le prérequis dont dépend la compétence, le résumé de la compétence.
- **Ne jamais committer** de fichiers générés par les outils (`.config/`, `.local/`, `.next/`, `out/`, `node_modules/`) : vérifier `git status` avant de publier.

## Contenu attendu

1. **Raison par priorité** : chaque priorité affiche (a) la raison de domaine déjà fournie par le moteur, et (b) une seconde ligne **propre à la compétence** : son résumé tel qu'il est dans les données, ou, si la compétence est un prérequis, « Prérequis de « X » » avec X le titre de la compétence qui en dépend. Deux priorités différentes n'ont jamais exactement le même texte complet.
2. **Fonction pure** (par exemple `detailPriorite(...)` dans `parcours.ts`) qui construit ce texte, déterministe, couverte par des tests.
3. **Acquis limités** : « Ce que vous maîtrisez déjà » affiche au plus 6 compétences, dans l'ordre de la feuille, puis « … et N autres » quand il y en a davantage. Le décompte total reste exact. Les 6 sont choisies par une règle déterministe décrite en commentaire (par exemple : d'abord celles du domaine de la première priorité, puis l'ordre des identifiants).
4. **Rapport** `reports/lots/telcoskills-c2.md` (≤ 10 lignes : fait, fichiers, tests, **non testé**, limites).

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `C2-C1` : pour au moins trois jeux de réponses d'`orientation.json` (dont un où les trois priorités sont dans le même domaine), les textes complets des priorités sont deux à deux distincts ; test Vitest.
- `C2-C2` : chaque priorité garde une raison non vide et un lien valide (fiche ou `/competence/<id>`) ; au plus trois priorités ; aucun score ni pourcentage.
- `C2-C3` : la liste d'acquis affiche au plus 6 éléments et « … et N autres » avec N exact ; le test couvre 0, 3, 6 et 18 acquis.
- `C2-C4` : la fonction de détail est pure et déterministe (même entrée, même sortie) ; test.
- `C2-C5` : aucun texte de raison n'est écrit à la main pour une compétence nommée : tout vient des données (vérifiable par lecture du diff).
- `C2-C6` : `stockage.ts` et les tests `stockage` et `parcours` existants sont inchangés et verts ; `content/**` inchangé.
- `C2-C7` : lint, types, tests et build verts ; si le script `verifier-sortie` existe dans `package.json`, il passe.
- `C2-C8` : le rapport dit ce qui n'a pas pu être vérifié (rendu mobile, clavier, thèmes clair et sombre : faits après coup par l'opérateur).
