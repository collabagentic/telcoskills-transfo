# Lot telcoskills-l4 — compte rendu

- Fait : script scripts/verifier-sortie.mjs (contrôles a–e sur out/), test Vitest + fixtures (saine et défectueuse), script npm verifier-sortie, étape CI après le Build.
- Fichiers : scripts/verifier-sortie.mjs, tests/verifier-sortie.test.ts, tests/fixtures/sortie-saine/ (2 pages), tests/fixtures/sortie-defectueuse/ (1 page), package.json, .github/workflows/ci.yml, reports/qualite-2026-11-21.md, reports/composants.md.
- Tests : 2 tests Vitest passent (détection des 5 familles, aucune signalisation sur la sortie saine).
- Résultat sur out/ réel : 163 pages, 1993 liens internes, 226 ancres, 0 image, 0 erreur, 0 avertissement.
- Non testé : Lighthouse, affichage 360/390/430 et tablette, clavier/focus, contraste, prefers-reduced-motion, liens externes.
- Limites : analyse par expressions régulières (pas de parseur HTML) ; aucune correction apportée (aucun défaut détecté).
