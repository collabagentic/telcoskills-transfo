# Relecture de la fiche « reconciliation »

Résumé : 15 affirmations techniques examinées : 5 confirmées, 7 non sourcées, 3 douteuses.
Pages ouvertes : controller/ et components/ (les deux sources listées), plus replicaset/ et deployment/ (candidates à l'ajout, lues sur les 100 000 premiers caractères seulement).
Liens : tous répondent HTTP 200 (curl, user-agent navigateur). Aucun échec.

## Tableau

| # | Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|---|
| 1 | Vous déclarez l'état voulu ; des contrôleurs comparent avec l'état réel et agissent pour s'en rapprocher | resume.apres, schema, epreuve.raisonnement | CONFIRMÉE | controller : le `spec` est l'état désiré, les contrôleurs font converger l'état courant vers lui, boucle non terminante | Aucune |
| 2 | Un Deployment à 3 réplicas avec 2 restants voit le troisième recréé sans intervention | change[0], exemple, epreuve.cas | NON SOURCÉE | Aucune des deux sources listées ne parle de réplicas ni de recréation (components : rien ; controller : Deployment cité seulement comme créateur de Pods) | Ajouter https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/ (ouverte) : un ReplicaSet crée et supprime des Pods pour atteindre le nombre souhaité. Ajouter https://kubernetes.io/docs/concepts/workloads/controllers/deployment/ (ouverte) : le contrôleur Deployment amène l'état réel à l'état désiré, exemple à 3 réplicas |
| 3 | Les contrôleurs passent par le serveur d'API | change[1] | CONFIRMÉE | controller : la majorité des contrôleurs intégrés envoient des messages à l'API server ; components : ils surveillent l'état via l'apiserver | Nuancer « les contrôleurs » en « la plupart des contrôleurs intégrés » (certains agissent sur un système externe) |
| 4 | Le serveur d'API est « seul » à lire et écrire dans etcd | change[1] | NON SOURCÉE | components : etcd est le magasin des données de l'API server ; la page ne dit pas qu'il est le seul à y accéder | Reformuler : « etcd stocke les données de l'API server », ou retirer « seul à lire et écrire » |
| 5 | L'état voulu se modifie dans la déclaration, jamais sur l'objet qu'un contrôleur gère | change[2] | NON SOURCÉE | Aucune page lue ne le formule ; deployment/ dit seulement de ne pas gérer à la main les ReplicaSets possédés par un Deployment | Reformuler : « ne gérez pas à la main les ReplicaSets d'un Deployment » (deployment/), ou retirer « jamais » |
| 6 | Une correction manuelle sur ce qu'un contrôleur gère est effacée ; le contrôleur remet l'état déclaré | piege, epreuve.cas, epreuve.raisonnement | DOUTEUSE | controller est muet sur la correction manuelle ; deployment/ déconseille seulement de gérer les ReplicaSets possédés. Probablement vrai pour un objet dérivé, mais « ce qu'un contrôleur gère » est trop large (un changement du `spec` du Deployment est conservé, c'est précisément le bon geste) | Restreindre à « une modification faite sur un objet dérivé (Pod, ReplicaSet) est écrasée », la sourcer via deployment/ ; sinon retirer de l'épreuve |
| 7 | Dans une infrastructure classique, rien ne remet seul une machine dans l'état voulu | pourquoiNouveau | NON SOURCÉE | Hors périmètre des sources (affirmation sur le monde d'avant) | Reformuler en « souvent » ou retirer : c'est un jugement, pas un fait Kubernetes |
| 8 | Kubernetes fait de la comparaison permanente son mécanisme central | pourquoiNouveau | CONFIRMÉE | controller : boucle de contrôle non terminante, plusieurs contrôleurs simples | Aucune |
| 9 | « Aucun équivalent direct dans votre métier d'origine » | pourquoiNouveau | DOUTEUSE | Non sourcé et contredit resteVrai[0] (la supervision compare cible et réalité) | Retirer, ou « équivalent partiel : la supervision détecte, mais ne corrige pas seule » |
| 10 | « Un composant qui tombe doit toujours être remplacé : seul l'acteur change » | resteVrai[1] | NON SOURCÉE | Aucune source ; controller note d'ailleurs que le cluster peut ne jamais se stabiliser | Retirer ou reformuler (jugement pédagogique) |
| 11 | Le contrôleur du Deployment recrée un pod de l'AMF ; l'équipe n'est alertée que si la reconstitution échoue | exemple | DOUTEUSE | Recréation : voir ligne 2. « Alertée que si la reconstitution échoue » : aucune source, dépend de la supervision en place | Retirer la partie sur l'alerte ; garder « le contrôleur recrée un pod » avec la source replicaset/ |
| 12 | Le contrôleur du ReplicaSet crée un pod | epreuve.raisonnement | NON SOURCÉE | replicaset/ (ouverte) : il crée et supprime des Pods pour atteindre le nombre souhaité ; absent des sources listées. change[0] dit « Deployment » et l'épreuve « ReplicaSet » : cohérent (le Deployment gère des ReplicaSets) mais la fiche ne l'explique pas | Ajouter replicaset/ à `sources` et à epreuve.source ; ajouter une phrase sur la hiérarchie Deployment, ReplicaSet, Pods |
| 13 | Le scheduler choisit un nœud pour le pod | epreuve.raisonnement | CONFIRMÉE | components : le kube-scheduler affecte à un nœud approprié les Pods pas encore liés | Citer components/ dans epreuve.source (aujourd'hui seule controller est citée ; controller ne nomme pas le scheduler) |
| 14 | Diagramme : lien « apply » de Vous vers API server | diagramme.liens | NON SOURCÉE | « apply » (kubectl apply) n'apparaît dans aucune page lue | Remplacer par « déclare » ou sourcer |
| 15 | Diagramme : API server « stocke l'état voulu » ; watch vers le contrôleur ; le contrôleur observe et agit sur pods, nœuds, volumes | diagramme | CONFIRMÉE (stockage via etcd, watch, observe/agit) | components : etcd stocke les données de l'API server ; le contrôleur surveille via l'apiserver et agit. « volumes » n'est pas cité (pods, nœuds : oui) | Détail mineur : retirer « volumes » ou le sourcer |

## Liens en échec

Aucun. Les 2 URL de `sources` et les 7 de `plusLoin` (3 playlists YouTube, page LFS158, dépôt GitHub, plus les 2 pages Kubernetes) répondent 200. Limite : un 200 sur YouTube ne garantit pas que la playlist soit encore disponible ; titres et auteurs non vérifiés.

## Épreuve

- Raisonnement soutenu par la source citée : partiellement. controller soutient la boucle de contrôle et le passage par l'API. Elle ne soutient ni le ReplicaSet qui crée le pod, ni le scheduler (c'est components), ni l'effacement d'une correction manuelle.
- La dernière question (« que devient une correction manuelle ») n'a pas de réponse sourcée : deployment/ déconseille seulement de gérer les ReplicaSets possédés.
- Réalisme : le cas (3 réplicas déclarés, 2 existants, un pod réapparaît) est réaliste pour un architecte télécom (CNF de type AMF). Il est un peu trop guidé : il nomme déjà « Deployment » et « réplicas ».
- Verdict : à corriger avant validation (sources de l'épreuve, restriction de la question finale).

## Trois points prioritaires

1. Le comportement central (recréation du pod manquant, ReplicaSet, Deployment) n'est dans aucune source listée : ajouter replicaset/ et deployment/.
2. « Seul à lire et écrire dans etcd » et « jamais sur l'objet que gère un contrôleur » dépassent les sources : reformuler.
3. « Aucun équivalent dans votre métier » contredit resteVrai ; « alerté seulement si échec » n'est pas sourcé.
