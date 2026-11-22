# Lot telcoskills-l2 — Assistant et restitution

Fait : écran d'entrée avant toute réponse (« N questions · environ 2 minutes · sans compte · vos réponses restent dans votre navigateur » + bouton « Commencer ») ; écran final « Ce que vous maîtrisez déjà » (masqué si vide) puis « Par où commencer » (au plus 3 priorités, chacune avec raison et lien fiche/compétence) ; bouton « Voir toute ma feuille de route » → /cockpit ; fonction pure priorites().
Fichiers : src/composants/Assistant.tsx, src/lib/parcours.ts, tests/parcours.test.ts, src/composants/assistant.css (nouveau).
Déjà présent, non modifié : aperçu des domaines qui se resserre, « ‹ Précédente » (conserve les réponses), stockage local (clé ts:parcours) sans migration, « Recommencer ».
Tests : 4 tests priorites ajoutés (aucune/quelques/toutes réponses, déterminisme) ; 75 tests verts ; lint, types, build verts.
Non testé (fait ensuite par l'opérateur) : mobile 360/390/430, clavier, thème clair et sombre.
Limites : pas de score ni de pourcentage ; durée « environ 2 minutes » écrite sobrement ; note : la spec cite « ts:bilan » mais le code utilise « ts:parcours » (inchangé, aucune migration).
