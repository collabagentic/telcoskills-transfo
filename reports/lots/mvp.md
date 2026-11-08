# Lots 1 à 5 (MVP, première passe) — résumé

- Design : jetons dans `src/app/tokens.css` (sombre par défaut, clair équivalent, accent orange, Geist et Geist Mono), couches et lumière, test de contraste et de couleurs en dur (`tests/tokens.test.ts`). Voir `DESIGN.md`.
- Contenu : schémas Zod, chargeur et 9 règles du §5 qui font échouer le build ; 1 métier (architecte infra et virtualisation), 9 fiches (7 transpositions, 2 nouveautés), 18 questions reprises de l'ancien dépôt. Tout est `brouillon`, à relire.
- Écrans : accueil (phrase qui se transforme, sélecteur de métier, bandeau « Reprendre »), bilan en direct (3 tuiles, phrase « Votre métier tient »), plan (reprise, jauge, impression, fin de plan), fiche (Avant → Après, vérification, historique, corriger).
- Stockage local `ts:bilan` ; `calculerBilan` et `calculerPlan` sont des fonctions pures testées. 28 tests, lint, types et build verts.
- Les 3 autres métiers sont ajoutés (cœur réseau, architecte SI, avant-vente) : voir `reports/metiers.md`.
- Pas encore faits : page Sources et méthode, Contribuer, À propos, pages légales, mesure d'audience, captures automatiques (E10-3), test utilisateur (E13).
- Points à décider : le dépôt GitHub est privé, donc les liens « Corriger cette fiche » ne marchent pas pour un tiers avant son ouverture ; les temps de lecture mesurés sont tous de 2 min (fiches courtes) ; `PRFAQ.md` cite encore « 11 cases sur 14 ».
