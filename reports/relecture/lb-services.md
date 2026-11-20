# Relecture de la fiche `lb-services`

Résumé :
- Confirmées : 6 affirmations (Service suit les pods par EndpointSlices, Ingress limité à HTTP(S)/TLS, LoadBalancer exige un composant fourni, MetalLB en BGP sur bare metal, annonce des IP aux routeurs, ClusterIP par défaut).
- Non sourcées : 6 (SCTP via LoadBalancer/MetalLB, « Route », port 38412 et usage NGAP de l'AMF, source VMware inexploitable, F5, adresses à réserver).
- Douteuses : 4 (« SCTP compris » dans le résumé, sens du lien « routeur vers Service » étiqueté BGP, « le Service LoadBalancer répartit », Ingress présenté sans mention de son gel).

Pages ouvertes : Kubernetes Services, Kubernetes Ingress, MetalLB BGP (lues en entier ou en grande partie ; pour Services, la section LoadBalancer a été relue par curl). La page VMware n'a pas pu être exploitée (voir plus bas).

Le champ `avisAuteur` est absent de la fiche : aucun passage n'est aujourd'hui étiqueté.

## Tableau de vérification

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Un Service suit les pods qui répondent, sans pools à la main | change.1, epreuve.raisonnement, schema.apres (« endpoints suivis seuls »), diagramme | CONFIRMÉE | Le contrôleur du Service scrute les pods correspondant au sélecteur et met à jour les EndpointSlices ; le trafic est transmis aux endpoints « ready » (page Services). | Aucune. |
| Un Service répartit le trafic entre pods | resume.apres, diagramme (« répartit ») | CONFIRMÉE | Page Services : adresse virtuelle devant un ensemble de pods, trafic envoyé vers les endpoints prêts. La page MetalLB indique que kube-proxy oriente vers un pod. | Aucune. |
| Service ClusterIP | diagramme (svc) | CONFIRMÉE | ClusterIP est le type par défaut. | Aucune. |
| Ingress/Route ne gère que HTTP, HTTPS et TLS ; pas d'autres ports ou protocoles | change.2, piege, epreuve.raisonnement, diagramme (ing) | CONFIRMÉE pour Ingress | Page Ingress : seules les règles HTTP(S) sont prises en charge ; il n'expose pas de ports ou protocoles arbitraires ; la terminaison TLS est possible. Pour les autres services, elle renvoie à NodePort ou LoadBalancer. | Aucune sur Ingress. Voir ligne « Route » ci-dessous. |
| « Route » (OpenShift) ne gère que HTTP/HTTPS/TLS | change.2, resume.apres, diagramme (« Ingress ou Route ») | NON SOURCÉE | Aucune des sources ouvertes ne parle de Route. | Ajouter une source OpenShift réellement ouverte, ou retirer « Route » des champs factuels. Ne peut pas devenir « avis d'auteur » : c'est un fait technique. |
| Le SCTP demande un autre mécanisme que l'Ingress | change.2, piege | CONFIRMÉE (déduction) | Ingress ne gère que HTTP(S) ; les autres protocoles passent par NodePort ou LoadBalancer (page Ingress). Le SCTP n'est pas cité sur la page Ingress. | Reformuler : « Ingress ne gère que HTTP(S) ; le SCTP n'en fait pas partie, il passe par NodePort ou LoadBalancer ». |
| Un Service de type LoadBalancer transporte du SCTP (solution du piège et de l'épreuve) | piege, resume.apres (« SCTP compris »), epreuve.raisonnement, exemple | NON SOURCÉE | Page Services : SCTP est cité uniquement pour le port alloué d'un NodePort (« TCP, UDP ou SCTP »). Pour LoadBalancer, la page ne cite pas le SCTP. La page MetalLB BGP ne cite pas le SCTP non plus (seulement TCP/UDP dans l'exemple de répartition). | Reformuler : « un Service de type LoadBalancer ou NodePort peut porter le SCTP (le protocole du Service est TCP, UDP ou SCTP) » en s'appuyant sur la phrase NodePort, ou ajouter une source (doc MetalLB sur les protocoles, ou page Services « protocol » que je n'ai pas isolée). Tant que non sourcé, retirer « SCTP compris » du résumé. Pas étiquetable « avis d'auteur » : fait technique. |
| MetalLB expose des Services LoadBalancer sur bare metal | change.3 | CONFIRMÉE | La page MetalLB s'inscrit dans « bare metal load-balancer for Kubernetes ». La page Services dit que Kubernetes n'offre pas de composant de répartition : il faut en fournir un. | Aucune. |
| En mode BGP, les IP sont annoncées aux routeurs | change.3, exemple, schema.apres, diagramme (« IP annoncée par MetalLB », « reçoit l'IP en BGP ») | CONFIRMÉE | Chaque nœud ouvre une session BGP avec les routeurs et annonce les IP des services externes. | Aucune sur le fond. Voir ligne sur le sens du lien. |
| Lien `routeur → svclb` étiqueté « BGP » | diagramme.liens | DOUTEUSE | Ce sont les nœuds du cluster qui annoncent les routes au routeur ; BGP ne transporte pas le trafic de données. Le trafic SCTP va du routeur vers les nœuds. | Inverser ou rebaptiser : un lien `svclb → routeur` « annonce BGP », et un lien `routeur → svclb` « trafic SCTP ». Le lien `ran → routeur` « SCTP » est correct. |
| `svclb → amf` « répartit » : le Service LoadBalancer répartit | diagramme.liens, schema.apres | DOUTEUSE | En BGP, les routeurs répartissent entre nœuds (multipath, ECMP, hash par connexion) si leur matériel le permet, puis kube-proxy dirige vers un pod. MetalLB annonce, il ne répartit pas lui-même. | Nuancer le détail : « MetalLB annonce l'IP ; les routeurs puis kube-proxy répartissent ». Ajouter la limite citée par la page : une coupure de session BGP peut casser des connexions existantes. |
| Pods AMF écoutent en SCTP 38412 | diagramme (noeud amf) | NON SOURCÉE | Aucune source ouverte ne cite 38412, NGAP ou l'AMF. | Source à trouver (3GPP TS 38.412 / IANA, non ouverte par moi) ou retirer le numéro de port. Non étiquetable « avis d'auteur ». |
| L'AMF expose NGAP/N2 en SCTP par un Service LoadBalancer annoncé en BGP à la RAN | exemple, epreuve.cas, epreuve.raisonnement | NON SOURCÉE | Rien dans les trois pages ouvertes sur l'AMF, N2 ou la RAN. | Étiqueter l'exemple « avis d'auteur » en l'écrivant comme illustration (« on pourrait exposer... »), ou le sourcer. Le choix d'architecture n'est pas établi par les sources. |
| Source VMware Telco Cloud Platform 2.7 | sources | NON SOURCÉE (source inexploitable) | L'URL redirige (301) vers la page d'accueil techdocs.broadcom.com, sans contenu sur le sujet. | Retirer cette source, ou fournir l'URL actuelle du guide après l'avoir ouverte. |
| Le F5 : virtual servers, pools, persistance configurés sur l'équipement | resume.avant, schema.avant, reflexe | NON SOURCÉE | Aucune source ouverte sur F5. La page Services mentionne la persistance de session (session affinity par IP client), côté Kubernetes seulement. | `reflexe` est déjà un champ d'avis : OK tel quel. Pour `resume.avant` et `schema.avant`, étiqueter « avis d'auteur » (description de l'ancien monde) ou retirer « persistance ». |
| Répartir la charge et supprimer les points uniques reste le but ; adresses à réserver et documenter ; L4/L7 toujours distincts | resteVrai.1 à 3 | NON SOURCÉE | Aucune source dédiée. | Étiqueter « avis d'auteur » (resteVrai) : admis tel quel. |
| Un Service est « un répartiteur logiciel » | change.1 | NON SOURCÉE (formulation) | La page dit que Kubernetes n'offre pas lui-même de composant de répartition pour LoadBalancer ; pour ClusterIP, il décrit un mécanisme d'IP virtuelle. | Reformuler : « Un Service est une adresse virtuelle stable devant un ensemble de pods ; la liste des pods est tenue à jour automatiquement ». |
| Ingress (HTTP) comme voie normale | change.2, diagramme | DOUTEUSE (périmée en partie) | La page Ingress indique que l'API est figée et que le projet recommande Gateway API. | Ajouter une mention dans le diagramme ou `change` : « Ingress reste disponible mais figé ; Gateway API est recommandée ». |

## Liens en échec

Code HTTP testé avec curl en suivant les redirections, user-agent navigateur : aucune URL n'échoue (7 sur 7 répondent 200).
- Kubernetes Services, Kubernetes Ingress, MetalLB BGP, Killercoda, deux playlists YouTube : 200 et contenu attendu pour les trois premiers ; les playlists et Killercoda répondent seulement par un code, contenu non vérifié.
- Attention : l'URL VMware répond 200 après une redirection 301, mais vers la page d'accueil générale du site de documentation de Broadcom. Elle ne soutient aucune affirmation. À traiter comme un lien en échec.

## Verdict sur l'épreuve

- Réalisme du cas : oui. Un architecte télécom connaît l'AMF, N2/NGAP, le SCTP et le sujet de l'exposition vers la RAN ; le réflexe « répartiteur configuré à la main » est crédible.
- Raisonnement attendu : soutenu seulement en partie par la source citée (pages Kubernetes Services et MetalLB BGP).
  - Soutenu : Ingress limité à HTTP(S)/TLS (page Ingress, qui n'est pas la source citée de l'épreuve : à ajouter dans `epreuve.source`) ; le Service suit les pods ; MetalLB annonce en BGP.
  - Non soutenu : que le LoadBalancer transporte le SCTP (aucune des deux pages ne le dit) ; que l'AMF en soit le cas d'usage ; le rôle exact de la répartition (c'est le routeur puis kube-proxy qui répartissent en BGP).
- Action : ajouter l'URL de la page Ingress à `epreuve.source`, corriger le raisonnement sur le SCTP comme indiqué ci-dessus, et laisser le cas AMF présenté comme illustration d'auteur.
