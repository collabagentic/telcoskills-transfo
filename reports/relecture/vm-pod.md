# Relecture de la fiche vm-pod

Résumé : 21 affirmations techniques contrôlées contre les trois pages Kubernetes de `sources` (Pods, Deployments, StatefulSets), toutes lues en entier.
Confirmées : 11. Non sourcées : 7. Douteuses : 3.
Liens : 8 sur 8 répondent (HTTP 200). L'épreuve est soutenue par la source, avec une adresse Deployments à compléter.

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Un pod est éphémère, remplacé plutôt que réparé | change, resume.apres | CONFIRMÉE | Pods : les pods sont conçus comme des entités relativement éphémères et jetables ; les mises à jour passent par un template mis à jour, pas par la modification des pods existants. | Aucune. |
| Un Deployment maintient le nombre voulu de pods identiques | change, resume.apres | CONFIRMÉE | Deployments : `.spec.replicas` fixe le nombre de réplicas ; le contrôleur ramène l'état réel vers l'état voulu. Les réplicas sont issus du même template. | Aucune. |
| … et remplace progressivement les anciens | change | CONFIRMÉE | Deployments : un changement du template crée un nouveau ReplicaSet monté peu à peu pendant que l'ancien descend (rolling update). | Aucune. |
| On change l'image ou la configuration, puis on redéploie | change | CONFIRMÉE | Deployments : le rollout se déclenche si et seulement si le template de pod change (labels, images). | Aucune. |
| On ne se connecte pas pour corriger (pas de SSH) | change, reflexe, diagramme | NON SOURCÉE | Aucune des trois pages ne parle de SSH ni de pratique d'exploitation. Pods dit seulement que certains champs se modifient en place. | Reformuler en pratique recommandée, ou ajouter une source sur `kubectl exec` / débogage (à ouvrir avant d'écrire l'URL), ou « retirer » la mention absolue. |
| Pods « remplacés, jamais réparés » | schema, diagramme (noeud Pods) | DOUTEUSE | Pods : le kubelet peut redémarrer un conteneur dans le même pod, et certains champs (image, par exemple) se modifient en place. Le remplacement est la règle des contrôleurs, pas une loi. | « remplacés, pas réparés sur place » ou « remplacés par le Deployment ». Retirer « jamais ». |
| Dimensionner : CPU et mémoire se demandent explicitement | resteVrai | DOUTEUSE | Pods : requests et limits sont facultatifs ; le scheduler s'appuie sur les requests, le kubelet applique les limits. | « se déclarent (requests et limits), ce qui est recommandé mais facultatif ». |
| Le template a pour équivalent l'image | resteVrai | NON SOURCÉE | Les pages lues ne rapprochent pas template de VM et image. Le template de pod (`.spec.template`) existe, mais c'est autre chose. | Reformuler « l'équivalent du template de VM est l'image, référencée par le template de pod » comme analogie pédagogique assumée, ou ajouter une source sur les images (non ouverte à ce jour). |
| Chaque service a un cycle de vie à piloter | resteVrai | NON SOURCÉE | Affirmation générale, absente des sources. | Retirer, ou remplacer par un constat vérifiable (rollout, rollback, scaling, trois pages Deployments). |
| Une VM patchée garde son identité pendant des années | resume.avant, schema | NON SOURCÉE | Hors périmètre des sources Kubernetes (côté VM, aucune source). | Ajouter une source côté virtualisation, ou marquer comme point de départ du lecteur, sans chiffre (« des années » à retirer). |
| Template cloné donne la VM, qui est patchée sur place | diagramme | NON SOURCÉE | Même remarque : le côté « avant » n'a aucune source. | Idem. |
| Image construite, versionnée, poussée dans un registre | diagramme | NON SOURCÉE | Les pages lues ne décrivent pas la construction ni le registre. | Ajouter une source sur les images (page Images de kubernetes.io à ouvrir), ou retirer « push ». |
| Lien « Registre tire Deployment » | diagramme | DOUTEUSE | Ce n'est pas le Deployment qui tire l'image : le Deployment crée des pods via un ReplicaSet, et le kubelet du noeud tire l'image. | Faire pointer le lien vers « Pods » ou reformuler « les noeuds tirent l'image ». |
| Le Deployment crée les pods | diagramme (lien « crée ») | CONFIRMÉE | Deployments : il crée un ReplicaSet qui crée les pods. Simplification acceptable. | Optionnel : ajouter « via un ReplicaSet » dans le détail. |
| Si un pod tombe, un autre est créé à sa place | exemple, epreuve.raisonnement | CONFIRMÉE | Deployments : le contrôleur ramène l'état réel vers l'état voulu. Pods : un pod peut être perdu (éviction, panne de noeud). | Aucune. |
| Une application à état n'a pas sa place dans un Deployment | piege | CONFIRMÉE | Deployments : usage typique pour une charge qui ne maintient pas d'état. StatefulSets : à utiliser pour identité stable et stockage stable ; Deployment ou ReplicaSet pour le sans état. | Aucune. |
| Une base répliquée relève d'un StatefulSet | piege, epreuve | CONFIRMÉE avec nuance | StatefulSets : adapté aux applications à identifiants réseau stables et stockage persistant stable. Les bases ne sont pas nommées dans le corps de la page. | Écrire « une base répliquée qui exige… » (déjà le cas), ne pas généraliser à toute base. |
| Chaque réplica a un nom réseau stable | piege, epreuve | CONFIRMÉE | StatefulSets : nom `nom-ordinal`, DNS par pod via un Service headless que l'utilisateur crée. | Ajouter « avec un Service headless » dans le raisonnement. |
| Chaque réplica a son propre volume qui le suit au redémarrage | piege, epreuve | CONFIRMÉE | StatefulSets : `volumeClaimTemplates` crée les PVC ; au (re)scheduling, les volumes du pod sont remontés ; les PV survivent à la suppression. | Aucune. |
| Un Deployment traite ses pods comme interchangeables | epreuve | CONFIRMÉE | StatefulSets : pods issus du même spec mais non interchangeables, contrairement au Deployment (contraste explicite). | Aucune. |
| Frontal HTTP/2 d'interface SBI sans état local | exemple, epreuve.cas | NON SOURCÉE | Aucune source ne mentionne SBI ni HTTP/2 (norme 3GPP). Le caractère « sans état » est une hypothèse du cas, plausible mais non établie. | Ajouter une source 3GPP sur la SBI (non ouverte à ce jour), ou écrire « supposé sans état » dans le cas. |

## Liens en échec

Aucun. Les 8 URL de `sources` et `plusLoin` répondent HTTP 200 (3 pages kubernetes.io, 5 playlists YouTube). Réserve : YouTube renvoie 200 même pour certaines playlists supprimées ou vides ; le contenu des playlists n'a pas été vérifié. Les playlists Docker et Podman (xavki) sont éloignées du sujet VM vers pod.

## Verdict sur l'épreuve

- Raisonnement : soutenu par la source citée (StatefulSets) pour l'identité stable, le nom ordonné, le DNS propre, `volumeClaimTemplates` et le volume qui suit le pod. La phrase sur le Deployment est soutenue par le contraste « non interchangeables » de la page StatefulSets. Seul manque : le Service headless, nécessaire au DNS par pod.
- Cas : réaliste pour un architecte télécom (fonctions réseau sans état derrière une SBI, bases de sessions ou de données avec état). Il suppose que le frontal est sans état, sans source : à écrire comme hypothèse. Une base répliquée en production passe souvent par un opérateur qui crée lui-même des StatefulSets ; ce n'est pas dit dans les sources, donc à ne pas affirmer.
- Source : « Deployments » sans adresse. Adresse exacte, ouverte et vérifiée (HTTP 200) : https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
