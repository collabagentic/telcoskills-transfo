# Relecture : cmdb-git

Fiche : content/fiches/cmdb-git.json (brouillon, 2026-11-09). Aucun fichier de content/ ni de src/ modifié.

**Résumé** : 9 affirmations confirmées, 8 non sourcées (toutes étiquetables « avis d'auteur » sauf 3 à reformuler), 3 douteuses.

## Ce qui a pu être lu

- kubernetes.io labels : lu sur les 100 000 premiers caractères (sur 109 855). Définition, sélecteurs, syntaxe, exemples, renvoi vers les annotations : lus. Les 9 855 derniers caractères non lus. La page « recommended labels » (liée) n'a pas été ouverte.
- kubernetes.io annotations : lue en entier.
- opengitops.dev : lue (quatre principes). Aucune mention de dérive, de source de vérité ni d'inventaire.
- YouTube (3 playlists) : titres vérifiés par curl, contenu des vidéos non vu.

## Tableau

| Affirmation | Où | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Les labels sont des paires clé/valeur servant à sélectionner et regrouper les objets | change.1, epreuve.raisonnement, piege | CONFIRMÉE | Labels : paires clé/valeur, servent à organiser et sélectionner des sous-ensembles ; le sélecteur est la primitive de regroupement | Aucune |
| Les annotations portent des informations non identifiantes et ne servent pas à sélectionner | piege, epreuve.raisonnement | CONFIRMÉE | Annotations : métadonnées non identifiantes, non utilisées pour identifier ni sélectionner | Aucune |
| On sélectionne et on filtre sur les labels | change.1 | CONFIRMÉE | Sélecteurs égalité/ensemble, requêtes et watches efficaces | Aucune |
| Git décrit l'état voulu | change.0, diagramme (git « état voulu ») | CONFIRMÉE | OpenGitOps : état voulu déclaratif, versionné, immuable | Aucune |
| Un outil GitOps « lit » Git puis « applique » au cluster (flèches git -> gitops -> cluster) | diagramme liens | CONFIRMÉE | Principes 3 et 4 : les agents tirent (pull) l'état voulu depuis la source et l'appliquent. Sens des flèches correct | Aucune |
| Un outil GitOps réapplique l'état voulu | change.0, diagramme (« réapplique ») | CONFIRMÉE | Réconciliation continue : l'agent observe l'état réel et tente d'appliquer l'état voulu | Aucune |
| « Donc dépôt et cluster ne divergent pas longtemps » | change.0 | DOUTEUSE | OpenGitOps dit que l'agent tente de réconcilier ; rien sur la durée de la divergence, et aucun mot sur la dérive. Formulation trop forte (un échec de synchronisation, une pause ou une exclusion laissent diverger) | Reformuler : « un outil GitOps compare en continu l'état réel à l'état voulu et tente de le rétablir ». Retirer « ne divergent pas longtemps » ou l'étiqueter avis d'auteur |
| Les labels disent propriétaire, application, version | change.1, exemple, schema, epreuve | DOUTEUSE (partielle) | La page labels donne release, environment, tier, partition, track comme exemples courants et renvoie aux « recommended labels » ; aucun label « propriétaire » dans la partie lue. Le mécanisme (clé/valeur choisies par l'utilisateur) est confirmé, le jeu application/version/propriétaire est un choix de l'auteur. Les annotations citent d'ailleurs les contacts des responsables comme exemple d'information non identifiante | Reformuler « par exemple application, version, propriétaire (clés au choix de l'équipe) ». Pour « propriétaire » : étiqueter avis d'auteur, et noter qu'un contact nominatif relève plutôt d'une annotation. Si l'on veut une source pour application/version, ouvrir la page des labels recommandés (non ouverte ici) |
| Sans convention de nommage des labels, chaque équipe invente la sienne | piege, epreuve.raisonnement | NON SOURCÉE | La page décrit la syntaxe des clés, les préfixes et les préfixes réservés ; elle ne recommande pas de convention d'équipe dans la partie lue. Le préfixe des clés est un mécanisme pour éviter les collisions | Étiquetable « avis d'auteur » tel quel (piege est dans la liste). Dans epreuve.raisonnement, qui est présenté comme attendu, signaler le passage comme avis ou le retirer |
| Un objet sans labels cohérents est un objet que l'inventaire ne retrouve pas | change.2 | NON SOURCÉE | Conséquence logique des sélecteurs, non énoncée | Étiquetable « avis d'auteur » (change.2) |
| « L'inventaire se lit dans le cluster, il n'est pas ressaisi » | resume.apres, diagramme.legende | NON SOURCÉE | Aucune des trois sources ne parle d'inventaire. Les labels permettent des requêtes, pas un inventaire complet (un objet absent du cluster ou non labellisé n'y figure pas ; l'état voulu est dans Git, l'état réel dans le cluster) | Étiqueter « avis d'auteur » (resume) et nuancer : « l'état réel se lit dans le cluster par requête sur les labels » |
| Une CMDB est mise à jour à la main ou par découverte, l'inventaire retarde | resume.avant, schema.avant, diagramme avant (saisie -> alimente -> cmdb -> dérive -> écart) | NON SOURCÉE | Comparaison avec l'ancien monde, sans source | Étiqueter « avis d'auteur » (resume, schema). Les nœuds du diagramme « à la main, par lots » et « retard sur la réalité » énoncent un fait général : atténuer (« souvent ») ou rattacher au bloc avisAuteur. Flèche « cmdb dérive écart » : verbe ambigu, préférer « se décale » |
| Savoir ce qui existe, qui est responsable, à quoi ça sert reste indispensable ; un inventaire faux est pire que pas d'inventaire ; les relations restent à documenter | resteVrai.0, .1, .2 | NON SOURCÉE | Opinion de métier | Étiqueter « avis d'auteur » (resteVrai, resteVrai.N). Aucun fait technique invérifiable |
| Chaque fonction du cœur porte application, version, propriétaire ; une requête sur le propriétaire liste ce qu'une équipe exploite, sans CMDB | exemple | NON SOURCÉE (illustration) | Une requête par sélecteur de labels est possible (confirmé) ; le « sans consulter une CMDB » et la portée « ce qu'une équipe exploite » dépendent de la couverture des labels | Étiquetable « avis d'auteur » (exemple). Ajouter « si les labels sont posés partout » |
| « L'inventaire se tient dans un outil à part, mis à jour à la main » (réflexe) | reflexe | NON SOURCÉE | Réflexe prêté au lecteur | Étiquetable « avis d'auteur » (reflexe) |
| « Les labels servent à sélectionner et regrouper » (nuance : pas d'identification unique) | piege | CONFIRMÉE | Pas d'unicité garantie, on attend beaucoup d'objets avec les mêmes labels | Aucune |
| Titres des trois playlists vidéo | plusLoin | CONFIRMÉE (titres) | Titres corrects ; contenu non vu | Voir point 3 des liens |

## Liens

Tous répondent 200, sans redirection vers une page sans rapport.

- kubernetes.io (labels, annotations), opengitops.dev : 200, directs.
- 3 playlists YouTube : 200 après 2 redirections (consentement YouTube, paramètres cbrd/ucbcb), titres corrects.
- Point d'attention (pertinence) : la playlist « NETCONF YANG Tutorial with Cisco real time examples » (NetworkEvolution) traite de NETCONF/YANG et non de CMDB, Git ou labels. Pertinence faible pour cette fiche : à retirer de plusLoin ou à justifier. Contenu des vidéos non vérifié.
- `sources` contient l'URL des annotations, mais `plusLoin` ne la reprend pas : cohérent. En revanche `sources` est utile aussi pour les « labels recommandés » (URL non ouverte, donc non proposée ici).

## Épreuve

- Source citée : la page labels. Elle soutient : labels = paires clé/valeur, sélecteurs pour retrouver et regrouper, labels distincts des annotations non identifiantes. Elle ne soutient pas : « application, version, propriétaire » comme exemples (ce sont des exemples de la fiche) ni la phrase sur la convention de nommage. L'opposition labels/annotations est soutenue par la page labels (une phrase) et par la page annotations, qui n'est pas citée dans epreuve.source : l'ajouter.
- Raisonnement attendu : soutenu aux trois quarts. Retirer ou marquer comme avis la dernière phrase (« convention de nommage »), ou la reformuler en « les clés de labels sont libres, mieux vaut les convenir » avec avis d'auteur.
- Réalisme du cas : plausible pour un architecte télécom (retrouver les fonctions du cœur exploitées par une équipe). La question « qu'évitez-vous de mélanger ? » oriente vers la réponse labels/annotations, ce qui est acceptable pour une épreuve de repérage. Un architecte ajouterait sans doute le namespace comme autre découpage, que le raisonnement ne mentionne pas ; non bloquant.
- Verdict : à corriger légèrement (source annotations, dernière phrase).

## Points les plus importants

1. « Dépôt et cluster ne divergent pas longtemps » (change.0) : OpenGitOps ne dit rien de la dérive ; reformuler en « tente de rétablir ».
2. « Les labels disent propriétaire, application, version » : choix d'auteur, pas dans la source ; étiqueter avis et noter que les contacts nominatifs sont plutôt des annotations.
3. « L'inventaire se lit dans le cluster » : aucune source ne parle d'inventaire ; étiqueter avis et nuancer ; plus la playlist NETCONF/YANG hors sujet.
