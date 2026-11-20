# Relecture : vlan-reseaux-cluster

**Résumé.** Confirmés : 9 points (Red Hat RDS 4.20 et README Multus lus intégralement via le navigateur intégré). Non sourcés : 11 points, dont 8 étiquetables « avis d'auteur » tels quels et 3 à corriger. Douteux : 4 points, dont un important (la signalisation « reste sur le réseau primaire », contredit par la source Red Hat).

**Ce qui a pu être lu.** Red Hat RDS 4.20 : lu en entier (403 pour curl et WebFetch, lu par le navigateur intégré). README Multus : lu. VMware TCP 2.7 : illisible (l'URL redirige en 301 vers l'accueil techdocs.broadcom.com, la page cible n'existe plus à cette adresse). Tigera `?p=69568` : illisible (404). Aucune affirmation ne peut donc être marquée confirmée par VMware ni par Tigera.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Séparer signalisation, données et administration reste une exigence | resteVrai.0 | CONFIRMÉE (partiel) | Red Hat : le réseau segmenté isole OAM, signalisation et stockage. | Ajouter « stockage » ou laisser tel quel ; sinon étiqueter avis d'auteur. |
| VLAN et MTU existent sur les réseaux secondaires qui portent le plan data | resteVrai.1, change.1 | CONFIRMÉE (partiel) | NMState gère VLAN, trunks, MTU sur interfaces secondaires ; trafic UPF/data via SR-IOV VF. La source ne dit pas « le plan data » seul : la signalisation passe aussi par un Multus secondaire (voir ligne douteuse). | Reformuler : « sur les réseaux secondaires (plan data, et selon le cas signalisation) ». |
| Chaque interface demande toujours un plan d'adressage | resteVrai.2 | NON SOURCÉE | Red Hat dit seulement que Whereabouts fournit l'adressage IP des interfaces additionnelles sans DHCP. | Étiquetable avis d'auteur tel quel. |
| Réseau primaire plat, isolation par NetworkPolicy en labels, pas en sous-réseaux | change.0, resume.apres | NON SOURCÉE | Red Hat RDS ne mentionne ni NetworkPolicy sur le primaire, ni « plat », ni labels (seulement MultiNetworkPolicy pour les réseaux additionnels, netdevice uniquement). La seule source utile serait Tigera (404). | Retirer « raisonnent en labels, pas en sous-réseaux » du fait technique, ou source officielle à ouvrir (doc Kubernetes NetworkPolicy, non ouverte ici). En attendant : avis d'auteur. |
| Réseaux additionnels (Multus) portent le plan data | change.1 | CONFIRMÉE | UPF et user plane via interface SR-IOV secondaire ; Multus MACVLAN ou SR-IOV. | RAS. |
| VLAN, MTU et VF SR-IOV se déclarent via NMState | change.1 | DOUTEUSE | NMState : VLAN, MTU, trunks. Mais les VF sont gérés par le SR-IOV Network Operator (SriovNetworkNodePolicy, numVfs) ; NMState sert au MTU du PF, pas à créer les VF. | « VLAN et MTU se déclarent via NMState ; les VF SR-IOV via le SR-IOV Network Operator. » |
| L'adressage des secondaires est géré à part de celui des pods | change.2 | CONFIRMÉE (partiel) | Whereabouts fournit l'IPAM des interfaces additionnelles ; SriovNetwork porte son propre ipam. | RAS, ou citer Whereabouts. |
| Réflexe « Isoler, c'est mettre dans un autre sous-réseau » | reflexe | NON SOURCÉE | Description de l'ancien monde. | Étiqueter avis d'auteur (liste avisAuteur : `reflexe`). |
| Sur le primaire, découper en sous-réseaux n'isole rien ; l'IP d'un pod est éphémère | piege, epreuve.raisonnement | NON SOURCÉE | Rien dans Red Hat ni Multus sur l'éphémérité des IP ni sur l'inefficacité des sous-réseaux. Le fait « IP d'un pod éphémère » est un fait technique vérifiable, pas un avis. | Reformuler en avis (« s'appuyer sur des sous-réseaux est fragile : l'IP change ») avec `avisAuteur: piege`, ou ajouter la doc Kubernetes sur les Pods/Services. Dans l'épreuve, la formule « Non » est trop absolue sans source. |
| L'erreur inverse : ignorer les réseaux secondaires | piege | NON SOURCÉE | Conseil. | Avis d'auteur tel quel. |
| La signalisation reste sur le réseau primaire du cluster | exemple, diagramme (lien ovn→services « signalisation ») | DOUTEUSE | Red Hat, §Signaling workloads : la signalisation (SCTP, REST, gRPC) utilise un Multus secondaire en MACVLAN ou SR-IOV. Autre passage : d'autres fonctions s'appuient sur OVN-Kubernetes. | Corriger : « selon les fonctions, la signalisation passe par un Multus secondaire (MACVLAN ou SR-IOV) ; certaines fonctions cloud-native restent sur OVN-Kubernetes ». Retirer l'étiquette « signalisation » du lien OVN, ou la remplacer par « trafic cluster ». |
| Trafic utilisateur d'une UPF via interface secondaire SR-IOV, avec VLAN et MTU | exemple, epreuve | CONFIRMÉE (partiel) | UPF = fonction data plane centralisée ; DPDK user plane et SR-IOV VF dédiés ; VLAN/MTU via NMState. Le lien explicite « UPF + VLAN » n'est pas écrit. | Assouplir : « par exemple ». |
| Multus attache plusieurs interfaces en appelant plusieurs plugins CNI ; un pod n'a par défaut qu'une interface hors loopback | epreuve.raisonnement | CONFIRMÉE | README Multus : exactement cela. | RAS. |
| Avant : un VLAN par usage, tagué sur le portgroup de chaque VM ; isolation par découpage en sous-réseaux | resume.avant | NON SOURCÉE | VMware illisible (redirection). | Avis d'auteur « ancien monde » (`resteVrai` / `reflexe`) ; sinon retirer la citation VMware tant que non lue. |
| Les VLAN reviennent sur les réseaux secondaires (Multus, SR-IOV) | resume.apres | CONFIRMÉE | NMState : VLAN sur secondaires ; Multus MACVLAN/SR-IOV. | RAS. |
| Schéma avant : VM portgroup tagué VLAN, commutateur trunk 802.1Q, pare-feu règles entre VLAN | schema.avant | NON SOURCÉE | VMware illisible. | Avis d'auteur / représentation pédagogique ; à signaler. |
| Schéma après : OVN-Kubernetes, NetworkPolicy ; Multus, SR-IOV, VLAN | schema.apres | CONFIRMÉE sauf NetworkPolicy (non sourcée) | OVN-K primaire ; secondaires Multus/SR-IOV. | Voir ligne NetworkPolicy. |
| Nœud OpenShift, pod CNF avec eth0 et net1 | diagramme | CONFIRMÉE (illustratif) | README Multus : interfaces additionnelles nommées net0, net1. | RAS (eth0 : convention, non écrit dans les sources). |
| Sens des liens du diagramme | diagramme.liens | OK sauf étiquette | pod→ovn (eth0), pod→multus (net1), multus→commutateur (VLAN) : sens correct. ovn→services « signalisation » : étiquette douteuse. | Corriger l'étiquette. « Multus + SR-IOV (VF) » dans un même nœud : cohérent avec Red Hat. |
| Commutateur « VLAN, MTU, plan data » | diagramme | CONFIRMÉE (partiel) | Red Hat : le matériel réseau connecté doit avoir un MTU égal ou supérieur (jusqu'à 8900). | RAS. |

## Liens en échec

- `https://docs.redhat.com/...telco-core-ref-design-specs` : HTTP 403 en curl et WebFetch (anti-bot) ; lisible par un navigateur. À ne pas considérer comme cassé, mais non vérifiable par script.
- `https://docs.vmware.com/...GUID-81109C7A-...html` : 301 vers `https://techdocs.broadcom.com/` (page d'accueil). Contenu cité introuvable.
- `https://www.tigera.io/?p=69568` : HTTP 404.
- OK (200) : multus-cni, quickstart.md, sriov-network-device-plugin, les deux playlists YouTube (200 ne prouve pas que la playlist a du contenu pertinent ; contenu non lu).

## Verdict sur l'épreuve

- Source citée : Multus README (lu) et Red Hat RDS (lu). Le raisonnement sur Multus est entièrement soutenu. Le point « UPF en SR-IOV avec VLAN et MTU » est soutenu à demi. Le point « l'IP d'un pod est éphémère, donc le découpage n'isole rien » n'a aucune source : il faut le sourcer ou le formuler en avis d'auteur.
- Réalisme : le cas est réaliste pour un architecte télécom (cœur 5G en CNF, UPF, VLAN). Mais la question 1 appelle un « Non » catégorique que les sources ne démontrent pas ; mieux vaut demander « Que garantit-on, et que ne garantit-on pas ? ». Par ailleurs, l'exemple présente la signalisation sur le primaire, alors que la source la place sur un Multus secondaire : l'épreuve risque d'enseigner l'inverse du référentiel Red Hat.

## Corrections prioritaires

1. Exemple et lien du diagramme : la signalisation passe par un réseau secondaire (MACVLAN ou SR-IOV) selon Red Hat.
2. « VF SR-IOV via NMState » : faux attribution, les VF viennent du SR-IOV Network Operator.
3. NetworkPolicy / IP éphémère / isolation par labels : sans source lisible (Tigera 404), à étiqueter avis d'auteur ou à resourcer ; VMware à remplacer ou retirer.
