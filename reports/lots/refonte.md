# Refonte : une feuille de route vivante (résumé)

- L'ancien site est remplacé, pas prolongé : 131 compétences migrées (47 écartées : IA agentique et Sylva), 10 domaines, prérequis et ressources conservés. Rapport : `reports/migration-graphe.md`.
- 7 questions (`content/orientation.json`) recombinent la feuille de route en direct ; moteur pur et testé (`src/lib/parcours.ts`, 38 tests). Sans réponse : vue d'ensemble de 131 blocs qui se resserre au fil des réponses.
- `/roadmap` : questions, carte React Flow ou liste, cockpit (où j'en suis, prochaine étape, objectif). `/competence/<id>` : ressources, prérequis, fiches, « Je maîtrise déjà ».
- Les 21 fiches de transformation sont rattachées à leurs compétences ; les 110 autres compétences ont leurs ressources en attendant une fiche.
- Retirés : métier à choisir, cases à cocher, bilan à trois tuiles, `/metier`, `/plan`.
- Reste : pratique par compétence (117 questions de l'ancien site), landscape des outils, recherche, redirections de l'ancien domaine, mesure, pages légales et Contribuer, test utilisateur.
- À valider par l'auteur : les effets des 7 questions (`content/orientation.json`) sont un brouillon ; l'ordre d'étude (niveau puis poids du domaine) aussi.
