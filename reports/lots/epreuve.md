# Lot « fiche en cockpit » (2026-11-20)

- Fiche en mise en page Pilotage : ligne de métro à correspondances collée en haut, feuille de route à gauche, lecture au centre, prochain geste à droite (repli en une colonne sous 62 rem).
- Le quiz (QCM « Vérifier », 42 questions) est remplacé par une **mise à l'épreuve** : un cas, l'apprenant écrit son raisonnement (15 caractères au moins), le raisonnement attendu et sa source s'affichent ensuite, puis « Je l'avais » / « À revoir ».
- « Vérifié » devient « Acquis » (stockage migré sans perte : `verifie` → `acquis`, clé et version inchangées).
- Chaque fiche a une catégorie (`categorie` : comprendre, pratique, integrer, diagnostiquer, decider) et un prompt à copier, gabarit à blancs pour poser la bonne question à l'IA de son choix ; le format de réponse demandé suit la catégorie.
- Contenu : les 21 épreuves sont rédigées en cas concrets (situation télécom, plusieurs points à raisonner), chaque raisonnement attendu reprenant seulement ce que disent la fiche et sa source ; elles restent des brouillons à relire. `content/questions/` est supprimé ; la règle « exactement 2 questions » est remplacée par le schéma `epreuve`.
- Contrôles : types, lint, 65 tests, build verts. Aperçu vérifié sur ordinateur et téléphone (étapes lire, prompt, épreuve, acquise).
- Reste : catégorie « diagnostiquer » sans fiche (à écrire : dépanner Kubernetes), canevas propres à chaque catégorie, rappel espacé d'une fiche acquise, relecture des 21 épreuves.
