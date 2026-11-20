# Relecture : dossier-archi-code

Résumé : 6 affirmations confirmées, 8 non sourcées (toutes étiquetables « avis d'auteur » telles quelles ou après une légère retouche), 5 douteuses (dont la date de l'ADR, le sens d'une flèche du diagramme et le « ne permet pas »).
Aucun champ `avisAuteur` n'existe dans la fiche : pour l'instant, rien n'est étiqueté.
Point central : la source unique (Nygard) ne dit ni « daté », ni « pull request », ni « au moment du choix » ; ces trois idées portent le piège, l'épreuve et le diagramme.

## Ce qui a été lu

| Page | Résultat |
|---|---|
| cognitect.com, article Nygard | HTTP 200, lue en entier (corps, « More Reading », pied de page). Via WebFetch, qui résume : les points « absent de l'article » sont à prendre avec cette réserve. |
| adr.github.io | HTTP 200, accueil lu en entier. Page d'accueil seulement : définition (« capture une décision et sa justification »), format Y-statement, liens vers modèles et outils. Pages liées non ouvertes. |
| c4model.com | HTTP 200 (curl). Contenu non lu. |
| Playlist YouTube A Dev' Story | HTTP 200 après 2 redirections (page de consentement `cbrd=1`). Contenu, auteur et langue non vérifiés. |

Ce que dit Nygard (lu) : ADR courts (une à deux pages) ; cinq parties : titre, contexte, décision, statut, conséquences ; stockés dans le dépôt (`doc/arch/adr-NNN.md`), numérotés ; statuts proposé, accepté, déprécié ou remplacé ; un ADR remplacé reste dans le dépôt, marqué comme tel ; Markdown. Il ne dit rien de : date par ADR, pull request, moment de rédaction, comité, schémas en texte, SR-IOV.

## Tableau des affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Décisions courtes (ADR) | resume.apres, change.0 | CONFIRMÉE | Nygard : une à deux pages. | Aucune. |
| ADR versionnés avec le code, dans le dépôt, à côté de ce qu'ils décrivent | resume.apres, change.1, schema.apres | CONFIRMÉE | Nygard : conservés dans le dépôt du projet, `doc/arch`. | Aucune. « à côté de ce qu'ils décrivent » : acceptable (même dépôt). |
| Contenu : contexte, décision, statut, conséquences | change.0, adr.detail, epreuve.raisonnement | CONFIRMÉE | Nygard : ces quatre parties, plus un titre. | Aucune. |
| « avec une date » | change.0, piege, schema.apres[2] (« historique daté »), diagramme (« statut et date »), epreuve.raisonnement (« daté ») | DOUTEUSE | Nygard ne prévoit pas de champ date. Seul l'historique du dépôt date implicitement la décision. | Remplacer « avec une date » par « avec un statut » ; ou écrire « daté par l'historique du dépôt » en avis d'auteur. Retirer « et date » du nœud `accepte`. |
| Une décision remplacée reste dans l'historique, marquée comme telle | piege, epreuve.raisonnement, noeud `rempl` | CONFIRMÉE | Nygard : l'ancien ADR n'est pas supprimé, il est marqué remplacé, avec référence au remplaçant. | Aucune. « Lien vers le nouveau » est aussi conforme. |
| Statuts proposé puis accepté | noeud `accepte`, lien `pr`→`accepte` | CONFIRMÉE (statuts) | Nygard : proposé, accepté, remplacé. | Aucune sur les statuts. |
| Les ADR changent / sont relus par pull request ; « fusion » = acceptation | change.1, resume.apres, schema.apres, exemple, epreuve.raisonnement, diagramme (`pr`, lien « fusion ») | NON SOURCÉE | Nygard ne mentionne pas la pull request. | Étiqueter « avis d'auteur » (pratique courante, non issue de la source). Retirer de epreuve.raisonnement, ou l'y marquer comme avis. |
| Un ADR s'écrit au moment du choix, pas après coup | piege, epreuve.raisonnement | DOUTEUSE | Nygard ne précise pas le moment de rédaction. | Reformuler en avis d'auteur : « À mon avis, un ADR écrit après coup perd de sa valeur ». Ne pas attribuer à la source. |
| Schéma décrit en texte, comparable version par version | change.2, resume.apres | NON SOURCÉE | Aucune des deux pages ne traite des schémas en texte. C4 non lu. | Avis d'auteur ; ou ouvrir c4model.com et y chercher une source avant de la citer. |
| « ce qu'un diagramme dessiné ne permet pas » | change.2 | DOUTEUSE | Trop fort : un format dessiné versionné se compare aussi, moins bien. | « se compare plus facilement qu'un diagramme dessiné » (avis d'auteur). |
| Comité d'architecture garde son rôle ; décision justifiée par alternatives et conséquences ; dossier lisible par non-spécialistes | resteVrai.0 à 2 | NON SOURCÉE | Nygard : conséquences oui ; « alternatives » et comité absents. | Étiqueter `avisAuteur: resteVrai`. Garder « alternatives » en avis (non sourcé). |
| « Le dossier validé en comité fait foi pour des années » ; avant : rédigé au lancement, archive rarement relue | reflexe, resume.avant, schema.avant | NON SOURCÉE | Description de « l'ancien monde », absente des sources. | Étiqueter `avisAuteur` (reflexe, schema). Passage d'opinion admis. |
| ADR d'une page | exemple | CONFIRMÉE (cohérent) | Nygard : un à deux pages. | « d'une à deux pages » pour coller à la source. |
| Séparer le plan usager sur interface secondaire SR-IOV : exemple relu par l'équipe réseau | exemple, epreuve.cas | NON SOURCÉE (illustratif) | Aucune source ne parle de SR-IOV ; ici c'est un cas, pas un fait. | Étiqueter `avisAuteur: exemple`. Aucun fait technique SR-IOV n'est affirmé. |
| Sens des flèches du diagramme | diagramme.liens | DOUTEUSE sur une flèche | `besoin`→`adr` (rédige), `adr`→`pr` (propose), `pr`→`accepte` (fusion) : sens cohérents. `accepte`→`rempl` « remplacé par » : se lit « ADR accepté est remplacé par ADR remplacé », contradictoire (le nœud d'arrivée est l'ancien ADR). | Relabelliser en « devient » ou « marqué remplacé », ou inverser la flèche et renommer le nœud d'arrivée « Nouvel ADR ». |

## Liens

- Tous répondent en HTTP 200 : adr.github.io, cognitect.com, c4model.com, playlist YouTube.
- À signaler : la playlist YouTube passe par 2 redirections (consentement) ; son contenu n'a pas été vérifié, ni le nom d'auteur « A Dev' Story » ni la langue « fr ».
- c4model.com : 200, mais l'attribution à Simon Brown et le type « cours » ne sont pas vérifiés par une lecture du contenu.
- Aucun lien en échec.

## Épreuve

- Source citée : Nygard, ouverte et lue. Elle soutient : court document, contexte, décision, statut, conséquences ; décision remplacée conservée et marquée.
- Elle ne soutient pas : « relu en pull request », « daté », « s'écrit au moment du choix, non après coup pour justifier ». Trois éléments sur quatre du raisonnement attendu hors source.
- Verdict : raisonnement partiellement soutenu. Correction : réécrire le raisonnement en deux temps, la partie sourcée (contenu, statut, remplacement), puis un conseil d'auteur explicitement étiqueté (pull request, moment de rédaction). Ou ajouter une source qui traite de ces points, après l'avoir ouverte.
- Réalisme du cas : réaliste pour un architecte télécom (plan usager, interface secondaire SR-IOV pour une fonction réseau conteneurisée, équipe réseau en relecteur). Il ne demande aucun fait que la source doive soutenir.
