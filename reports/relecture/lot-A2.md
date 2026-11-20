# Relecture sourcée, lot A2 (catégorie « comprendre », seconde moitié)

Fiches : `lb-services`, `acces-rbac`, `matrice-networkpolicy`, `vlan-reseaux-cluster`. Rapports détaillés dans ce dossier. Même méthode que le lot A1 : relecture sourcée par des sous-agents, puis corrections appliquées avec les passages d'opinion étiquetés « avis d'auteur » (décision de l'auteur du 2026-11-20).

## Bilan chiffré (d'après les rapports)

| Fiche | Confirmés | Non sourcés | Douteux | Liens en échec |
| --- | --- | --- | --- | --- |
| lb-services | 6 | 6 | 4 | 0 (la source VMware redirige vers un accueil sans contenu) |
| acces-rbac | 12 | 5 | 3 | 0 |
| matrice-networkpolicy | environ 11 | 5 | 3 | 0 |
| vlan-reseaux-cluster | 9 | 11 | 4 | 0 (VMware redirigé, Tigera 404) |

Réserves : certaines pages ont été lues en partie ; le contenu des playlists vidéo n'est vérifié que par code HTTP ; la documentation Red Hat bloque les lectures automatiques et n'a été lue que par le navigateur intégré.

## Ce que montre le lot

1. **Deux sources mortes** (VMware, Tigera) soutenaient des affirmations sur « l'ancien monde » : retirées, les affirmations deviennent des avis d'auteur étiquetés.
2. **Des faits techniques sans source** ne pouvaient pas devenir des avis : le SCTP porté par un Service LoadBalancer, « Route » d'OpenShift, la signalisation « sur le réseau primaire » (Red Hat dit le contraire pour plusieurs fonctions). Ils sont reformulés d'après ce que les pages disent.
3. **Le port 38412 n'est pas dans la TS 38.412** : il est attribué par l'IANA (registre ouvert, « ng-control », SCTP). Source IANA ajoutée.
4. **Un diagramme erroné par fiche** : lien « BGP » ambigu (`lb-services`), pair RAN présenté comme pod passerelle alors que c'est un gNB externe (`matrice-networkpolicy`), signalisation sur OVN (`vlan-reseaux-cluster`), identité « OIDC » non sourcée (`acces-rbac`).

## Corrections appliquées

- `lb-services` : Route retiré, Ingress limité à HTTP et HTTPS d'après sa page, Gateway API mentionnée (l'API Ingress est figée), SCTP déclaré comme protocole du port d'un Service, exemple AMF reformulé comme illustration étiquetée, source VMware retirée, libellés de diagramme corrigés.
- `acces-rbac` : « refusé par défaut » remplacé par « permissions purement additives, pas de règle de refus », identité « externe » au lieu d'OIDC, ClusterRole « droits sans namespace ».
- `matrice-networkpolicy` : policies dites additives, `ipBlock` réservé aux IP externes, « default deny » devenu une base (avis), pair NG-RAN (gNB) externe, « sélectionne » au lieu de « protège », piège SCTP (le plugin CNI doit le gérer), source IANA ajoutée.
- `vlan-reseaux-cluster` : signalisation par Multus secondaire ou OVN selon les fonctions, NMState (VLAN, MTU) distinct du SR-IOV Network Operator (VF), sources illisibles retirées, source Multus ajoutée.

Nouveau : les clés `resume` et `schema` peuvent être étiquetées avis d'auteur (le côté « avant » décrit une pratique, pas un fait Kubernetes) ; l'étiquette s'affiche sous les cartes avant/après et au titre du schéma.

## Restent ouverts

- À sourcer : SCTP porté par un Service LoadBalancer (`lb-services`), nom « N2 » (`matrice-networkpolicy`, TS 23.501), NetworkPolicy en labels sur le réseau primaire (`vlan-reseaux-cluster`).
- Relecture par l'auteur des huit fiches « comprendre » (A1 et A2) : « relu » n'est posé que par lui.
- Les schémas du côté « avant » (VM, pare-feu, root partagé) sont étiquetés comme avis d'auteur, pas supprimés.
