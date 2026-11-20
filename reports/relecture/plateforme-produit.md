# Relecture : plateforme-produit

Résumé : 8 affirmations confirmées, 8 non sourcées (6 étiquetables « avis d'auteur » tel quel, 2 à corriger ou sourcer), 1 douteuse (« ne cache pas Kubernetes »). La fiche n'a pas de champ `avisAuteur` : il est à ajouter. Quatre des six `plusLoin` n'ont aucun rapport avec le sujet.

## Ce qui a été lu

- Livre blanc plateformes CNCF (`tag-app-delivery.cncf.io/whitepapers/platforms/`) : HTTP 200, page lue en entier via WebFetch (du début au tableau des capacités, puis pied de page). Pas de troncature signalée.
- Modèle de maturité (`.../platform-eng-maturity-model/`) : HTTP 200, page lue en entier. Le PDF téléchargeable et l'image de la courbe d'adoption ne sont pas dans le texte.
- Les deux URL de `sources` sont les seules que j'ai lues. Les autres `plusLoin` : seuls le code HTTP et le titre de page ont été vérifiés.
- Remarque de méthode : WebFetch renvoie un résumé produit par un modèle, pas le texte brut. Les paraphrases ci-dessous reposent sur ces résumés.

## Tableau des affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| La plateforme est un produit, avec utilisateurs internes, catalogue de capacités, un responsable qui l'améliore | resume.apres | CONFIRMÉE | Livre blanc : plateforme conçue pour ses utilisateurs internes, améliorée par leurs retours, avec feuille de route ; portails avec catalogues de services. Maturité (Investment, niveau 3) : rôles de product management. | Aucune. Ajouter le modèle de maturité en appui de « responsable ». |
| Capacités en libre-service | change[0], schema | CONFIRMÉE | Les utilisateurs obtiennent une ressource via CLI, portail ou API, sans intervention manuelle. | Aucune. |
| « plutôt que de traiter des tickets » | change[0] | NON SOURCÉE | Le livre blanc ne parle pas de tickets. Le modèle de maturité décrit au niveau 1 des processus manuels passés de personne à personne. | Étiqueter l'opposition tickets / libre-service « avis d'auteur », ou la reformuler en « plutôt que des processus manuels » (maturité, niveau 1 de l'aspect Interfaces). |
| On mesure adoption, satisfaction, délai pour obtenir une capacité | change[1] | CONFIRMÉE | Livre blanc : adoption (utilisateurs actifs, rétention), satisfaction (NPS, enquêtes), délai demande-livraison d'une ressource. | Aucune. |
| « Elle ne cache pas Kubernetes » | change[2] | DOUTEUSE | Le livre blanc dit que la plateforme masque la complexité d'architecture et les détails des fournisseurs pour réduire la charge cognitive. Il ne traite pas de l'exposition de Kubernetes. Il demande aussi une couche aussi fine que possible, optionnelle et composable. | Retirer « ne cache pas Kubernetes ». Écrire : « Elle réduit la charge cognitive des équipes en masquant une partie de la complexité (livre blanc CNCF). » Si l'auteur tient à la nuance Kubernetes, l'étiqueter « avis d'auteur ». |
| « réduit la charge cognitive des équipes » | change[2], epreuve.raisonnement | CONFIRMÉE | Objectif central cité par le livre blanc. | Aucune. |
| Les engagements de service et le support restent à définir | resteVrai[1] | NON SOURCÉE | Aucun des deux textes ne le dit (SLO seulement au niveau 4 des mesures, hors sujet). | Étiquetable « avis d'auteur » tel quel : c'est un conseil, pas un fait. |
| Un service interne a toujours des clients (exploitation, développement) | resteVrai[0] | NON SOURCÉE | Le livre blanc parle d'utilisateurs internes, pas de « clients ». | Étiquetable « avis d'auteur » tel quel. |
| Modèle classique : une équipe d'infrastructure traite des demandes | pourquoiNouveau (1re phrase) | NON SOURCÉE | Le livre blanc critique les mandats descendants sans retours, pas l'infra « classique ». | Étiquetable « avis d'auteur » (comparaison avec l'ancien monde). |
| Conçue pour ses utilisateurs, avec feuille de route et retours, comme un produit | pourquoiNouveau (2e phrase) | CONFIRMÉE | Livre blanc : recueillir des retours (entretiens, formulaires, usage), publier une feuille de route. | Aucune. |
| Sans équipe responsable, sans catalogue, sans retour : « guichet de tickets » | piege, epreuve.raisonnement | NON SOURCÉE (en partie) | Seule la partie « sans retours, adoption et valeur compromises » est dans le livre blanc. Le lien « équipe / catalogue manquants donne un guichet de tickets » n'y est pas. | Étiqueter « avis d'auteur » (piege est déjà dans la liste). Pour l'épreuve, voir plus bas. |
| Gabarit « déployer une CNF » (réseaux secondaires, supervision, accès) | exemple, epreuve.raisonnement | NON SOURCÉE | Le livre blanc cite gabarits de projet et golden paths. Aucune mention de CNF ni de réseaux secondaires. | Étiquetable « avis d'auteur » (exemple est dans la liste), à condition de présenter le contenu du gabarit comme une illustration. |
| Portail = catalogue de capacités ; Gabarits = chemins balisés ; Feuille de route = adoption, retours | diagramme (noeuds) | CONFIRMÉE | Livre blanc : portails avec catalogues et gabarits ; golden path = workflow réutilisable avec gabarit ; feuille de route issue des retours. | Aucune. |
| Nœud « Opérateurs : exploitation automatisée » | diagramme (noeud ops) | NON SOURCÉE | Rien sur les opérateurs Kubernetes dans les deux sources. Le terme est ambigu : il peut se lire comme des opérateurs humains, voisins des « Exploitation » côté utilisateurs. | Retirer, ou ajouter une source ouverte sur les opérateurs Kubernetes. À défaut, renommer en « Automatisation » et étiqueter « avis d'auteur ». |
| Flèches : exp et dev vers portail (« demande ») | diagramme (liens) | CONFIRMÉE | Sens cohérent avec le libre-service via portail ou API. | Aucune. |
| Flèches : portail vers gab (« applique »), gab vers cluster (« déploie »), ops vers cluster (« exploite ») | diagramme (liens) | NON SOURCÉE | Le sens est plausible (le portail propose des gabarits, un gabarit déploie). Le livre blanc ne décrit pas ce flux. « applique » est ambigu : c'est plutôt le portail qui expose le gabarit, et le gabarit qui s'applique. | Étiqueter le schéma « avis d'auteur » (le champ `schema` est dans la liste). Ajouter une flèche des utilisateurs vers la feuille de route (retours), absente alors que la légende parle d'une équipe « qui écoute ses utilisateurs ». |
| Schéma : Équipes, Capacités, Équipe plateforme (feuille de route, retours) | schema | CONFIRMÉE | Cohérent avec le livre blanc. | Aucune. |

Note : le modèle de maturité n'est cité par aucune affirmation de la fiche. Il peut être rattaché à « responsable », « adoption », « retours » et « libre-service » (aspects Investment, Adoption, Measurement, Interfaces).

## Liens en échec

Aucun lien ne renvoie une erreur : les six URL de `sources` et `plusLoin` répondent HTTP 200 (curl, user-agent navigateur). Les deux playlists YouTube ajoutent des paramètres de consentement dans l'URL finale, sans changer la page.

Hors sujet (la page répond mais n'a aucun rapport avec « plateforme comme produit ») :
- Playlist Ansible de xavki : tutoriels d'automatisation, aucun lien avec le produit interne.
- Documentation Kubernetes sur les interruptions (PDB) : hors sujet.
- SREcon25 Americas : au mieux très indirect, sans épisode désigné.
- Ressources Google SRE : très général, sans lien avec la plateforme comme produit.
À retirer ou à remplacer. Seule la page de maturité CNCF est pertinente. Toutes sont `acces: gratuit`.

## Verdict sur l'épreuve

- Source : livre blanc CNCF, correcte et lue.
- Soutenu par la source : « capacités en libre-service qui réduisent la charge cognitive ».
- Non soutenu : « sans équipe responsable, sans catalogue et sans retour des utilisateurs, elle redevient un guichet de tickets » et le gabarit CNF. La réponse attendue présente comme conditions de la source ce qui est un avis d'auteur.
- Correction : bâtir le raisonnement sur ce que dit la source (interface en libre-service via portail ou API, retours recueillis, feuille de route publiée, adoption et délai de livraison mesurés), et ne garder le « guichet de tickets » qu'en conclusion étiquetée.
- Réalisme : le cas est réaliste pour un architecte télécom (cluster Kubernetes installé, onboarding de CNF toujours par tickets). La question « que manque-t-il ? » reste ouverte et la source ne suffit pas à y répondre seule. Le cas ne porte pas sur le télécom au-delà de l'exemple.

## Avis sur le classement « decider »

Je recommande « comprendre ». La fiche définit un concept (plateforme = produit), donne des critères de mesure et un piège, mais n'aide à arbitrer aucune option : ni quand créer une équipe plateforme, ni quelle couche construire ou acheter, ni quel niveau de maturité viser. Le livre blanc fournit pourtant de quoi décider (couche aussi fine que possible, optionnelle, niveaux de maturité). Pour justifier « decider », il faudrait ajouter un choix explicite : par exemple « plateforme minimale (wiki, gabarits) ou portail complet ? », avec les critères du modèle de maturité. L'épreuve, qui demande ce qui manque dans une situation existante, relèverait plutôt de « diagnostiquer ».

## Actions suggérées

1. Ajouter `avisAuteur` pour : resteVrai, change.0 (partie tickets), pourquoiNouveau, piege, exemple, schema.
2. Corriger change.2 (retirer « ne cache pas Kubernetes »).
3. Retirer ou sourcer le nœud « Opérateurs », ajouter la flèche de retours.
4. Reformuler le raisonnement de l'épreuve.
5. Nettoyer les `plusLoin` hors sujet.
6. Passer la catégorie à « comprendre », sauf ajout d'un arbitrage.
