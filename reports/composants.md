# Inventaire des composants d'interface — lecture seule

Généré dans le cadre du lot L4. Lecture seule : aucun refactor effectué.
Sources : src/composants/*.tsx, classes définies dans src/app/globals.css (430 sélecteurs) et jetons dans src/app/tokens.css.

## Familles de composants

- Boutons : .btn, .btn-principal, .btn-lien, .bouton-ressources, .agrandir, .fenetre-fermer, .corriger, .evitement (lien d'évitement), .retour, .retour-question.
- Pastilles et badges : .pastille, .pastille-relecture, .badge, .badge-gratuit, .pilule-lien, .point-assistant, .point-courant, .point-repondu.
- Encadrés, panneaux, cartes : .encadre, .panneau, .panneau-avant, .panneau-apres, .couche, .couche-chaude, .carte, .carte-aide, .carte-ensemble, .carte-reprise, .tuile, .tuiles.
- Titres et textes : .titre-page, .titre-question, .sous-titre, .sur-titre, .slogan, .accroche, .cockpit-titre, .bloc-titre, .etape-titre, .reprendre-titre, .groupe-nom, .ressource-nom, .phrase-cle, .mono.
- États (vide, erreur, chargement, progression) : .vide, .etat, .etat-lu, .etat-verifie, .etape-faite, .etape-a-venir, .etape-disponible, .etape-estompee, .etape-cible, .etape-suivante, .barre-verifie, .barre-courante, .barre-inactive, .barre-lu, .audit-fini, .audit-pas-fini.

## Composants (src/composants/) et leurs classes

| Composant | Rôle | Classes principales |
| --- | --- | --- |
| EnTete.tsx | en-tête du site | .entete, .logo, .pilule-lien |
| PiedDePage.tsx | pied de page et liens | .pied, .pied-liens, .pied-audit |
| Assistant.tsx | questionnaire d'orientation | .assistant, .assistant-question, .etapes-assistant, .point-assistant, .titre-question, .options-assistant, .option-grande, .navigation-assistant, .sortie-assistant |
| Cockpit.tsx | cockpit d'apprentissage | .cockpit-page, .cockpit-principal, .cockpit-texte, .entete-cockpit, .groupes, .groupe-apercu, .groupe-nom, .groupe-barre |
| CarteTransformation.tsx | carte de transformation (React Flow) | .carte, .carte-aide, .carte-ensemble |
| FilMetro.tsx | ligne de métro à correspondances | .metro, .metro-fil, .metro-ligne, .metro-station, .metro-point, .metro-nom, .metro-branche, .metro-echange, .metro-reste |
| Diagramme.tsx | diagramme d'architecture SVG | .diagramme, .diagramme-defile, .diagramme-svg, .dg-zone, .dg-forme, .dg-lien, .dg-texte, .dg-etiquette, .dg-ton-* |
| SchemaFiche.tsx | chaîne avant → après (schéma simple) | .schema, .schema-chaine, .schema-etape, .schema-boite, .schema-rangee, .schema-fleche |
| AvantApres.tsx | composant signature Avant → Après | .avant-apres, .panneau, .panneau-avant, .panneau-apres, .couche, .couche-chaude |
| Epreuve.tsx | mise à l'épreuve | .epreuve, .epreuve-cas, .epreuve-champ, .epreuve-bilan |
| GesteFiche.tsx | prochain geste | .geste-carte, .geste-principal, .geste-lien, .geste-liste |
| RailFeuille.tsx | rail d'avancement | .rail, .rail-carte, .rail-etapes, .rail-etape, .rail-jauge, .rail-pourcent, .rail-suivant, .rail-lien, .rail-compte |
| Reprise.tsx | reprise de session | .reprise, .reprendre-grand, .reprendre-titre, .reprendre-pourquoi, .carte-reprise |
| Ressources.tsx | ressources d'une fiche | .ressources, .ressources-groupe, .ressource, .ressource-nom, .ressource-meta, .badge, .badge-gratuit |
| NavigationFiche.tsx | navigation d'une fiche | .retour, .suite-fiche, .btn |
| PromptApprendre.tsx | prompt à copier | .prompt, .prompt-texte |
| Maitrise.tsx | « Je maîtrise déjà » | .btn, .couche |
| Agrandir.tsx | agrandir un schéma | .btn, .agrandir, .fenetre-schema, .fenetre-fermer |
| EffacerDonnees.tsx | effacer les données locales | .btn |
| BoutonRessources.tsx | bouton ressources | .bouton-ressources |

## Jetons (src/app/tokens.css)

- Couleurs : --fond, --surface-1/2/3, --filet, --filet-fort, --reflet, --encre, --encre-2, --encre-3, --accent, --accent-texte, --focus, --accent-halo, --accent-lueur, --accent-surface-1/2, --accent-filet, --teinte-forme, --teinte-nouveau, --teinte-lacher, --teinte-decouvrir, --teinte-ok, --ombre-1, --ombre-2, --grille.
- Typographie : --police-texte, --police-mono, tailles -xs à -xxl.
- Espacement (base 4 px) : --e-1 à --e-16.
- Rayons, durées, courbes : --r-s/m/l/pilule, --d-rapide/base/lente, --courbe.
- Thèmes : sombre par défaut, clair via prefers-color-scheme: light, impression toujours en clair.

## Incohérences repérées (lecture seule, non corrigées)

- Doublons de noms proches : .rail-courant et .rail-courante ; .barre-courante et .metro-courante (même notion « courante » dans trois familles).
- Suffixe « fait(e) » décliné différemment : .metro-faite, .etape-faite, .rail-faite.
- « point(s) » surchargé : .point-assistant, .point-courant, .point-repondu, .metro-point, .barre-point, .barre-points.
- « barre » surchargé : .barre-compteur, .barre-courante, .barre-inactive, .barre-lu, .bloc-barre, .groupe-barre, .fiche-barre, .rail-barre.
- Négation vs affirmation : .audit-pas-fini (négation) face à .etape-a-venir (affirmation).
- Préfixes incohérents pour la même zone : .cockpit-* (cockpit-titre, cockpit-texte) face à .entete-cockpit, .entete-feuille, .entete-plan.
