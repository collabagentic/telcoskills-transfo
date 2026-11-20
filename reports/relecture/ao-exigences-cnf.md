# Relecture : ao-exigences-cnf

Résumé : 5 affirmations confirmées / 9 non sourcées (dont 6 étiquetables « avis d'auteur » tels quels) / 4 douteuses.

## Lecture des sources
- Micro-enquête CNCF (août 2022) : lue en entier (WebFetch, HTTP 200, article complet). 77 répondants, mai-juin 2022.
- Programme de conformité logicielle : lu (HTTP 200). La liste des produits certifiés n'apparaît pas dans l'extraction. La page ne mentionne ni CKA ni CKAD, ni Helm, ni charts.
- github.com/cncf/cnf-wg : lu (HTTP 200). Dépôt devenu simple redirection (un fichier README) : le groupe a été transféré à Linux Foundation Networking (Cloud Native Telecom Initiative). Aucun contenu sur charts, images, réseaux secondaires, exigences.
- Sylva et les deux playlists YouTube : seul le code HTTP et le titre de page ont été relevés ; le contenu n'a pas été lu.

## Affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Les opérateurs placent l'interopérabilité et la portabilité en priorité dans l'enquête CNCF | change.2 | DOUTEUSE | Le titre de l'article parle de priorités. Interopérabilité : 2e préoccupation (42,86 %) derrière le réseau (57,14 %). La portabilité est citée comme motivation (fin du verrouillage fournisseur), sans chiffre propre. Échantillon de 77, non représentatif de l'avis de l'article lui-même | Reformuler : « L'enquête CNCF 2022 (77 répondants) cite l'interopérabilité parmi les premières préoccupations (42,86 %) et la portabilité comme motivation. » Retirer « que les opérateurs placent en priorité » ou l'atténuer |
| Certifier les CNF garantit surtout l'interopérabilité entre CNF (non utilisé dans la fiche, utile) | (aucun) | CONFIRMÉE (disponible) | 66,67 % y voient l'avantage principal de la certification de CNF | Optionnel : source possible pour étayer l'exigence d'interopérabilité |
| Exiger une plateforme Kubernetes conforme/certifiée | change.1, exemple, schema, diagramme e2, raisonnement | CONFIRMÉE | Le programme certifie des logiciels basés sur Kubernetes, vérifiés avec Sonobuoy | Aucune |
| « pas sur un matériel imposé » | change.1 | NON SOURCÉE | Découplage matériel/logiciel et fin du verrouillage cités par l'enquête, sans parler d'AO | Étiqueter « avis d'auteur » |
| Le programme certifie que des distributions passent une même suite de tests | epreuve.raisonnement | CONFIRMÉE (nuance) | Conformité vérifiée par Sonobuoy, résultats soumis par pull request. La page parle de « logiciels/produits », pas de « distributions » au sens strict | Remplacer « distributions » par « produits logiciels basés sur Kubernetes » |
| CKA et CKAD concernent des personnes, pas des produits | epreuve.raisonnement | NON SOURCÉE | La page de conformité ne cite ni CKA ni CKAD ; elle ne traite que de produits | Soit retirer, soit ajouter une source ouverte sur CKA/CKAD (non ouverte ici), soit étiqueter « avis d'auteur » |
| « version de Kubernetes certifiée » comme critère testable | piege | DOUTEUSE | Les éditeurs doivent fournir la dernière version au moins une fois par an ; aucune version minimale. Le programme certifie le produit à une version | Dire « version/produit certifié, avec la version indiquée dans le dépôt de conformité » plutôt que « version certifiée » en général |
| Exiger formats de livraison (images, charts), documentation des réseaux secondaires et ressources | change.2 | NON SOURCÉE | Rien dans la micro-enquête ni la conformité. cnf-wg ne contient plus rien. L'enquête cite seulement CNI personnalisés, NAT par défaut, API/CRD incompatibles | Étiqueter « avis d'auteur » (conseil de rédaction) ; pour un appui factuel, citer les problèmes d'intégration de l'enquête (CNI 57,14 %, CRD 42,86 %) |
| « livrée en chart Helm ... réseaux secondaires » | exemple, raisonnement | NON SOURCÉE | Illustration | Déjà un exemple : étiqueter « avis d'auteur » (exemple) |
| Un AO classique exige conformité à l'équipement, notation, cahier par fonctionnalités | resume.avant, reflexe | NON SOURCÉE | Description de l'ancien monde | Étiqueter « avis d'auteur » |
| resteVrai (grille pondérée, sécurité/support/performance contractuels, réversibilité dès l'AO) | resteVrai.1-3 | NON SOURCÉE | Pas dans les sources | Étiqueter « avis d'auteur » (pratique d'achat) |
| Exiger aussi « mises à jour déclaratives » | resume.apres, diagramme e3 | NON SOURCÉE | Aucune source ouverte ne le traite | Avis d'auteur, ou retirer du diagramme comme fait |
| « images signées » (livraison) | diagramme e1 | NON SOURCÉE | La signature d'images n'apparaît dans aucune source ouverte | Retirer « signées » ou le sourcer ; ne pas l'étiqueter fait technique |
| « API standard » (interopérabilité) | diagramme e4 | NON SOURCÉE | L'enquête cite l'incompatibilité des API/CRD fournisseurs comme problème (42,86 %), pas « API standard » comme exigence | Reformuler : « éviter les API/CRD propriétaires incompatibles » avec la source enquête, ou avis d'auteur |
| Sens des flèches : ao -> e1..e4 -> preuves -> verdict (« note ») | diagramme.liens | CONFIRMÉE (cohérent) | Sens logique correct : l'AO pose les exigences, les preuves les vérifient, la note donne l'éligibilité | Aucune |
| Source du diagramme = micro-enquête | diagramme.source | DOUTEUSE | L'enquête ne traite pas d'appel d'offres, de preuves ni de notation ; elle ne soutient pas le schéma dans son ensemble | Remplacer par « schéma d'auteur » ou ajouter l'étiquette avis d'auteur |
| Sources de plusLoin : Sylva « projet de pile cloud native pour les télécoms (LF Europe) » | plusLoin | NON VÉRIFIÉE | Seul le titre « Sylva, Linux Foundation Projects Site » a été lu | Ne pas détailler la description ou la vérifier |

Note : le champ `avisAuteur` n'existe pas dans la fiche. Il faut l'ajouter pour les champs étiquetés ci-dessus.

## Liens (HTTP, redirections suivies)
- Micro-enquête CNCF : 200 (slash final ajouté).
- Conformité logicielle : 200.
- github.com/cncf/cnf-wg : 200, mais dépôt de redirection (contenu déplacé vers github.com/lfn-cnti/bestpractices, github.com/cnti-testcatalog/testsuite et github.com/lfn-cnti/certification, URL lues dans le README du dépôt et non ouvertes). Le libellé « groupe de travail CNF » est périmé : à reformuler ou remplacer.
- sylvaproject.org : 200.
- Playlist Sylva presentations : 200 (titre confirmé).
- Playlist Cloud Native Telco Day 2026 - Europe : 200 (titre confirmé).

Aucun lien en échec.

## Épreuve
Verdict : partiellement soutenue.
- Le cas (un fournisseur répond « compatible cloud natif ») est réaliste pour un architecte télécom.
- Le raisonnement tient sur la partie « programme de conformité = produits testés par la suite Sonobuoy ». Ne sont pas soutenus par la source citée : la distinction CKA/CKAD (absente de la page), le « chart Helm » et les « réseaux secondaires » (conseil d'auteur), la précision « distributions ».
- À faire : citer la micro-enquête pour la raison de l'exigence (interopérabilité, CRD/API incompatibles) et étiqueter le reste « avis d'auteur ».
