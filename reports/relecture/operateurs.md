# Relecture de la fiche « operateurs »

Résumé : 11 points confirmés, 6 non sourcés, 5 douteux (22 affirmations examinées).
Toutes les URL de `sources` et de `plusLoin` répondent 200. Aucune n'échoue.
Point structurel : l'épreuve cite la page `olm-architecture`, qui n'est pas dans `sources` alors que c'est elle qui porte les définitions OLM.

Pages ouvertes : kubernetes.io (operator, custom-resources, rbac), olm.operatorframework.io (docs/, docs/concepts/olm-architecture/). Les pages Kubernetes sont longues : seuls les 100 000 premiers caractères ont été lus par l'outil de lecture.

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Un opérateur est un contrôleur qui réconcilie des objets personnalisés | change[1], diagramme | CONFIRMÉE | Page Operator : clients de l'API qui jouent le rôle de contrôleurs pour une ressource personnalisée ; il fait correspondre la réalité aux ressources configurées. | Aucune. |
| Une CRD ajoute à l'API un type d'objet propre à une application | change[0] | CONFIRMÉE | Page custom-resources : extension de l'API, manipulée par kubectl comme un Pod. | Aucune. Nuance : « CRD » est la définition, « ressource personnalisée » est l'objet ; le champ confond les deux. |
| Même boucle de réconciliation que le reste du cluster | pourquoiNouveau | CONFIRMÉE | Page Operator : l'opérateur suit les principes de Kubernetes, notamment la boucle de contrôle. | Aucune. |
| L'opérateur installe (déploie) l'application et la met à jour | exemple, resume, diagramme | CONFIRMÉE | Page Operator : déployer à la demande, gérer les mises à jour du code et des changements associés. Exemple SampleDB : crée PVC, StatefulSet, Job d'initialisation. | Aucune. |
| Un opérateur « répare » | resume.apres | DOUTEUSE | La page Operator cite installation, mise à jour, sauvegarde/restauration, élection de leader, simulation de pannes. Pas de « réparation » ni de failover explicite. | Remplacer « réparer » par « sauvegarder et restaurer », ou retirer. |
| Le contrôleur « tourne dans le cluster » | resume.apres | CONFIRMÉE (réserve) | Page Operator : CRD et contrôleur ajoutés au cluster ; le contrôleur tourne généralement hors du plan de contrôle, par exemple en Deployment. | Aucune. Éviter d'écrire « dans le plan de contrôle ». |
| Les runbooks d'exploitation deviennent du code | resteVrai[0] | CONFIRMÉE (paraphrase) | Page custom-resources : le motif Operator encode la connaissance métier d'une application dans l'API. | Le mot « runbook » n'est pas dans la source ; garder la paraphrase « connaissance d'exploitation ». |
| Un équipementier reste responsable de la qualité de ce qu'il livre | resteVrai[1] | NON SOURCÉE | Aucune page ne parle de responsabilité du fournisseur. | Retirer. |
| Les équipementiers livraient une appliance et une procédure d'exploitation | pourquoiNouveau | NON SOURCÉE | Contexte historique télécom hors des sources. | Retirer, ou ajouter une source télécom réellement ouverte. |
| Kubernetes permet de livrer à la place un contrôleur qui applique la procédure | pourquoiNouveau | CONFIRMÉE | Page custom-resources : le motif Operator encode la connaissance métier. Page Operator : automatisation des tâches d'exploitation. | Aucune. |
| Sur OpenShift, OLM installe et met à jour les opérateurs | change[2], zone « OLM (OpenShift) » | DOUTEUSE | Les pages OLM upstream décrivent OLM comme composant d'Operator Framework, sans mentionner OpenShift. | Écrire « OLM (Operator Lifecycle Manager) installe et met à jour… », ou ouvrir d'abord une page Red Hat sur OLM avant de l'ajouter. Aucune URL OpenShift n'a été ouverte ici. |
| La Subscription exprime le canal suivi | change[2], diagramme | CONFIRMÉE | Page olm-architecture : sert à garder les CSV à jour en suivant un canal d'un package. | Aucune. |
| L'InstallPlan porte les changements | change[2] | CONFIRMÉE | Page olm-architecture : liste calculée des ressources à créer pour installer ou mettre à jour un CSV. | Aucune. |
| Subscription = package + canal + source de catalogue ; CatalogSource = dépôt ; CSV = description de l'application ; InstallPlan = ressources à créer | epreuve.raisonnement | CONFIRMÉE | Page olm-architecture : Subscription indique package, channel et CatalogSource ; CatalogSource est un dépôt de CSV, CRD et packages ; CSV porte les métadonnées ; InstallPlan liste les ressources. | Aucune. Ajouter cette page à `sources`. |
| Lien « Catalogue — choisit → Subscription » | diagramme.liens | DOUTEUSE | Page olm-architecture : c'est la Subscription qui référence le CatalogSource, pas l'inverse. | Inverser : « Subscription — pointe vers → Catalogue ». |
| Lien « Subscription — génère → InstallPlan » | diagramme.liens | CONFIRMÉE | Page olm-architecture : quand une mise à jour est trouvée, un InstallPlan est écrit dans le namespace. | Aucune. |
| Lien « InstallPlan — installe → Opérateur » ; détail « changements à approuver » | diagramme | DOUTEUSE | Page olm-architecture : l'InstallPlan est une liste de ressources ; après approbation, le Catalog Operator crée les ressources ; l'OLM Operator déploie l'application depuis le CSV. L'InstallPlan n'installe pas lui-même ; l'approbation dépend de la stratégie. | Libeller « fait créer » ; détail « ressources à créer (approbation selon la stratégie) ». |
| Opérateur — crée → StatefulSet, Service | diagramme.noeuds | DOUTEUSE (mineure) | Page Operator : l'exemple cite PVC, StatefulSet, Job d'initialisation. Service n'y figure pas. | « StatefulSet, PVC » ou « StatefulSet, Job ». |
| « UPF : 3 instances » | diagramme, exemple | NON SOURCÉE | Illustration. La page Operator donne l'exemple SampleDB, pas un cœur 5G. | Signaler comme exemple fictif dans la légende. |
| Un opérateur agit avec ses propres droits RBAC | piege, epreuve.raisonnement | NON SOURCÉE (partielle) | Page RBAC : Role/ClusterRole et bindings vers des ServiceAccounts (partie ServiceAccount non lue, tronquée). Page olm-architecture : l'OLM Operator crée Deployments, ServiceAccounts, (Cluster)Roles et bindings. Aucune page ne dit « un opérateur agit avec ses propres droits ». | Reformuler : « l'opérateur s'exécute sous un ServiceAccount dont les Roles et ClusterRoles bornent ce qu'il peut faire (RBAC) », après vérification de la section ServiceAccount de la page RBAC. |
| « Lisez ce qu'il demande avant de l'installer » / ne pas le traiter en boîte noire | piege, epreuve | NON SOURCÉE | Conseil de bonne pratique, absent des quatre sources. | Retirer, ou le présenter comme recommandation d'auteur. |
| La Subscription demande l'installation et le maintien à jour | epreuve.cas | CONFIRMÉE (réserve) | Page olm-architecture : la Subscription suit un canal ; l'InstallPlan peut aussi être créé directement par un utilisateur. | Préciser « le cas courant : la Subscription ». |

## Liens en échec

Aucun. Code 200 pour toutes les URL de `sources` (4) et de `plusLoin` (6, dont 2 communes avec `sources`), ainsi que pour la page olm-architecture. Les deux listes de lecture YouTube répondent 200, contenu non vérifié (aucune affirmation n'en dépend).

## Verdict sur l'épreuve

- Source : la page olm-architecture n'est pas dans `sources`. À ajouter : https://olm.operatorframework.io/docs/concepts/olm-architecture/ (ouverte, 200).
- Raisonnement : la première partie (Subscription, package/canal/source, CatalogSource, CSV, InstallPlan) est entièrement soutenue. La seconde (droits RBAC propres, boîte noire, lire ce qu'il demande) ne l'est pas : la page indique seulement que l'OLM Operator crée ServiceAccounts, Roles et bindings.
- Réalisme : cas plausible pour un architecte télécom. La question « que vérifiez-vous avant de l'installer ? » attend une bonne pratique que la source ne fournit pas ; limiter la réponse attendue à ce que la source soutient (permissions RBAC créées avec l'opérateur, stratégie d'approbation de l'InstallPlan) ou assumer le conseil comme recommandation d'auteur.
- Verdict : acceptable après deux corrections (ajouter la source, adosser ou assumer la partie RBAC).
