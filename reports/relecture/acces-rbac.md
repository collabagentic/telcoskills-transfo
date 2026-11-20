# Relecture de la fiche acces-rbac

Pages lues : RBAC (148 638 caractères ; lue en deux passes WebFetch, puis contrôle par curl avec recherche de mots-clés) et comptes de service (112 894 caractères ; 100 000 premiers lus par WebFetch, fin vérifiée seulement par recherche de mots-clés via curl). La fiche n'a pas de champ `avisAuteur`.

**Résumé.** 12 points confirmés. 5 non sourcés (tous étiquetables « avis d'auteur » tels quels, avec un ajout de passage à faire pour le schéma). 3 douteux : « refusé par défaut » (formulé plus fort que la source), « identité OIDC » dans le diagramme, et le sens/étiquette des liens sujet→binding (nuance).

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Rien n'est autorisé par défaut : une requête sans règle qui la couvre est refusée | change.0 | DOUTEUSE | La page dit que les permissions sont purement additives, sans règle de refus. Elle ne formule pas « refusé par défaut » ; c'est une conséquence logique. | Reformuler : « Les permissions RBAC sont purement additives : il n'existe pas de règle de refus ; ce qu'aucune règle n'accorde n'est pas accordé par RBAC. » |
| Un Role vaut dans un namespace ; un ClusterRole peut valoir pour tout le cluster | change.1 | CONFIRMÉE | Role : toujours dans un namespace. ClusterRole : non namespacé, utilisable cluster-wide ou dans des namespaces précis. | Aucune. |
| RoleBinding référençant un ClusterRole : droits limités à son namespace | change.2 | CONFIRMÉE | Le ClusterRole est lié au namespace du RoleBinding. | Aucune. |
| ClusterRole + ClusterRoleBinding : droits sur tout le cluster | piege | CONFIRMÉE | Un ClusterRoleBinding accorde l'accès à l'échelle du cluster. | Aucune. |
| Règles RBAC uniquement additives, pas de refus explicite | epreuve.raisonnement | CONFIRMÉE | La page dit : permissions purement additives, pas de règles « deny ». | Aucune. |
| La requête non autorisée est refusée | epreuve.raisonnement | DOUTEUSE (même point que change.0) | Déduction non écrite dans la page ; elle indique seulement que si RBAC n'autorise pas, un autre mode (ABAC) peut être évalué s'il est configuré. | Écrire « n'est pas autorisée par RBAC », ou ajouter « sauf autre mode d'autorisation configuré ». |
| Moindre privilège et séparation des rôles restent la règle | resteVrai.0 | CONFIRMÉE en partie | Le moindre privilège est recommandé (page RBAC, section jokers ; page comptes de service). « Séparation des rôles » n'est pas dans les sources. | Étiqueter « avis d'auteur » (resteVrai.0). |
| Les accès se revoient régulièrement | resteVrai.1 | NON SOURCÉE | Aucune revue périodique décrite. | Étiquetable « avis d'auteur » tel quel (bonne pratique générale). |
| Un accès d'urgence doit rester tracé | resteVrai.2 | NON SOURCÉE | Pas de procédure break-glass ; seule mention : l'identifiant `system:masters` lié à `cluster-admin` pour l'amorçage. | Étiquetable « avis d'auteur » tel quel. |
| Avant : comptes nominatifs, sudo, root partagé | resume.avant, reflexe, schema.avant | NON SOURCÉE | Hors périmètre des sources. | Étiquetable « avis d'auteur » pour resume.avant et reflexe (reflexe est dans la liste admise). Le champ schema n'est pas dans la liste des passages : retirer le détail « droits sur la machine » ou étendre l'étiquetage. |
| Rôles qui listent ce qu'on peut faire, liés à des personnes ou applications, dans un périmètre | resume.apres, schema.apres | CONFIRMÉE | Rôles = ensembles de permissions ; sujets = utilisateur, groupe, compte de service ; périmètre namespace ou cluster. | Optionnel : « personne, groupe ou compte de service ». |
| Utilisateur : « identité OIDC » | diagramme.noeuds.user | DOUTEUSE | OIDC n'est pas sur la page RBAC (authentification non nommée) ; sur la page comptes de service il n'apparaît que pour la validation de jetons de compte de service. Les comptes utilisateurs sont externes au cluster. | Remplacer par « identité externe au cluster » (sourcé par la page comptes de service), ou « utilisateur ou groupe ». |
| Compte de service : « identité d'un pod » | diagramme.noeuds.sa | CONFIRMÉE | Identité non humaine utilisée par les pods pour s'authentifier à l'API server ; un pod sans compte précisé prend le `default` du namespace. | Aucune. |
| RoleBinding lie sujet et rôle ; référence un Role | diagramme.noeuds.rb, lien rb→role | CONFIRMÉE | Le RoleBinding relie sujets et rôle du même namespace. | Aucune. |
| Role : verbes sur ressources ; get, list vers pods, secrets | diagramme.noeuds.role/res, lien role→res | CONFIRMÉE | Les exemples de la page utilisent get, watch, list sur pods et secrets. | Aucune. |
| ClusterRoleBinding : portée tout le cluster ; ClusterRole : « droits sur tout le cluster » | diagramme.noeuds.crb/cr | CONFIRMÉE pour crb, nuance pour cr | Un ClusterRole peut aussi être limité à un namespace via un RoleBinding (change.2) : « droits sur tout le cluster » est un peu fort pour lui seul. | Détail du ClusterRole : « droits définis sans namespace ». |
| Sens des liens user→rb, sa→rb, sa→crb | diagramme.liens | DOUTEUSE (nuance) | Dans l'objet, c'est le binding qui liste les sujets et référence le rôle ; le sujet ne pointe pas vers le binding. rb→role, crb→cr « référence » sont corrects, role→res aussi. | Garder les flèches (lecture « qui obtient quoi ») mais remplacer « sujet » par « est visé par », ou ajouter une note. Pas d'erreur de fond. |
| Exemple : exploitant 5G en lecture sur le namespace de l'UPF ; outil de supervision avec compte de service limité à la lecture des métriques | exemple | NON SOURCÉE | La page décrit le mécanisme, pas le cas télécom. Le rôle `system:monitoring` cité concerne les endpoints du control plane, pas les métriques d'applications. | Étiquetable « avis d'auteur » tel quel (champ exemple admis). |
| Pour un seul namespace : Role et binding, avec compte de service dédié | epreuve.raisonnement | CONFIRMÉE | La page recommande d'accorder les rôles à un compte de service dédié à l'application plutôt qu'au `default` ; un binding fin est plus sûr mais plus coûteux. | Précision possible : RoleBinding + ClusterRole marche aussi pour un namespace. |

## Liens en échec

Aucun. Les 6 URL (sources et plusLoin : RBAC, comptes de service, playlist YouTube, killercoda.com, kubernetes-goat, tutoriels Vault) répondent HTTP 200 avec curl (redirections suivies). Le contenu des 4 liens plusLoin non-Kubernetes n'a pas été lu.

## Épreuve

- Raisonnement soutenu par la source : oui pour l'essentiel (ClusterRoleBinding à portée cluster, Role + binding pour un namespace, compte de service dédié, règles additives sans refus). Réserve : « la requête est refusée » est une déduction ; ajouter la nuance ci-dessus.
- Réalisme pour un architecte télécom : oui, un outil de supervision limité au namespace de l'UPF est un arbitrage plausible. La source ne couvre pas la lecture des métriques d'application ; le cas n'en dépend pas.
- Variante utile : la réponse pourrait aussi mentionner qu'un ClusterRole lié par un RoleBinding resterait limité au namespace (change.2), alternative légitime au « Role + binding ».
