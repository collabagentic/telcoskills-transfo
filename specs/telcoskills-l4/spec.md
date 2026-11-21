# Spécification telcoskills-l4 : qualité mesurée

> Mission L4 du projet TelcoSkills Transformation. Source : `reports/audit-2026-11-21/plan-agents.md` (§1, §2, lot L4).
> Fichier figé par le commit indiqué dans le commentaire de validation de l'issue.

## Besoin

Aucune mesure de qualité du site construit n'existe : liens internes, routes, métadonnées, structure des titres, alternatives d'image. Il faut un contrôle automatique de la sortie statique `out/`, branché dans la CI, et un état des lieux écrit, avec ce qui n'est pas testé dit clairement.

## Périmètre

- Fichiers à toucher : un nouveau `scripts/verifier-sortie.mjs`, un test dédié avec une petite sortie de fixture dans `tests/fixtures/`, `package.json` (un script), `.github/workflows/ci.yml` (une étape après le Build), et deux rapports : `reports/qualite-2026-11-21.md` et `reports/composants.md`.
- **Ne pas toucher** `src/app/page.tsx`, `src/app/fiche/`, `src/composants/Assistant.tsx`, `src/app/globals.css` (autres lots en cours). Un défaut trouvé dans ces fichiers est **listé dans le rapport, pas corrigé**.
- Aucune dépendance ajoutée : analyser le HTML avec Node seul (expressions régulières prudentes ou parcours simple).
- Pas de refonte, pas de changement de design. Corrections limitées aux défauts évidents et locaux ailleurs (une alternative d'image manquante, un titre de page vide…), chacune listée dans le rapport.
- Les liens externes ne sont **pas** testés dans la CI (le réseau ne doit pas la faire échouer).

## Contenu attendu

1. **`scripts/verifier-sortie.mjs`** : lit `out/` et contrôle (a) chaque lien interne (`href` commençant par `/`, sans le préfixe `/_next/`) existe comme fichier ou dossier avec `index.html` ; (b) chaque ancre `#id` existe dans la page cible ; (c) chaque page a un `<title>` non vide, une `<meta name="description">` non vide, un attribut `lang` sur `<html>`, un seul `<h1>` ; (d) pas de saut de niveau de titre (h1 → h3) ; (e) chaque `<img>` a un `alt` (vide admis seulement s'il est décoratif et marqué `aria-hidden` ou `role="presentation"`). Sortie : erreurs (code de sortie 1) et avertissements (code 0), avec la page et la ligne.
2. **Test Vitest** avec une fixture minimale qui contient un défaut de chaque type, et une fixture saine.
3. **Script npm** `verifier-sortie` et **étape CI** après le build.
4. **`reports/qualite-2026-11-21.md`** : résultat du script sur la sortie réelle, problèmes classés bloquant / majeur / mineur, corrections faites, corrections laissées. Section finale **« Non testé »** : Lighthouse (performance, accessibilité), affichage à 360, 390 et 430 px et tablette, navigation clavier et focus visible, contraste, `prefers-reduced-motion`, liens externes. Ne jamais écrire qu'un de ces points est vérifié.
5. **`reports/composants.md`** : inventaire des composants d'interface (boutons, pastilles, encadrés, cartes, titres, états vide, d'erreur et de chargement), avec les classes CSS de `globals.css` / `tokens.css` et leurs usages, et les incohérences repérées (doublons, variantes proches). Lecture seule : pas de refactor.

## Critères d'acceptation (vérifiables, à rapporter un par un)

- `L4-C1` : le script détecte les cinq familles de défauts (a à e) sur la fixture défectueuse et ne signale rien sur la fixture saine (test Vitest).
- `L4-C2` : le script s'exécute sur la sortie réelle (`next build` puis `node scripts/verifier-sortie.mjs`) et son résultat est consigné dans le rapport, chiffres à l'appui.
- `L4-C3` : l'étape CI est ajoutée sans casser les étapes existantes ; elle échoue sur une erreur, pas sur un avertissement.
- `L4-C4` : les deux rapports existent ; la section « Non testé » du premier énumère au moins les points listés ci-dessus.
- `L4-C5` : aucune dépendance ajoutée ; aucun des fichiers interdits modifié.
- `L4-C6` : lint, types, tests et build verts.
