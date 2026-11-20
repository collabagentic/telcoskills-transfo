# Relecture : actif-passif-replicas

**Résumé.** 13 affirmations examinées : 5 confirmées, 6 non sourcées, 2 douteuses.
Les trois sources répondent (HTTP 200) ; la source etcd ne couvre que le quorum, et aucune source ne couvre l'actif/passif ni le « Service ».
Points clés : « Réglez les sondes sur le comportement réel », l'effet « tous les pods retirés » et le « ≥ 2 » du diagramme ne sont pas dits tels quels.

Pages ouvertes : sondes (k8s, lue en entier), perturbations/PDB (k8s), FAQ etcd v3.5. Les pages ont été lues le 2026-11-20.

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| 5 membres etcd supportent la perte de 2 | resteVrai | CONFIRMÉE | La FAQ etcd le donne (quorum = n/2+1, 5 membres tolèrent 2 pannes). | Aucune. |
| La sonde de readiness retire un pod du trafic sans le tuer | change, schéma, diagramme, exemple, epreuve | CONFIRMÉE | Un pod « unready » ne reçoit plus de trafic des Services ; l'application n'est pas tuée. | Aucune. |
| La liveness redémarre le conteneur | change, schéma | CONFIRMÉE | En cas d'échec, le kubelet tue le conteneur et le redémarre. | Précision possible : « le conteneur », pas « le pod ». |
| Le PDB limite les pods indisponibles pendant une opération planifiée | change, diagramme | CONFIRMÉE | Il limite les pods d'une application répliquée à l'arrêt lors de perturbations volontaires. | Aucune. « Planifiée » est une paraphrase acceptable de « volontaire ». |
| Un pod dont la readiness échoue cesse de recevoir du trafic le temps de se rétablir | exemple, epreuve.raisonnement | CONFIRMÉE | Il reçoit de nouveau du trafic quand la sonde réussit à nouveau. | Aucune. |
| Une bascule peut être « déclenchée par un cluster ou un opérateur » ; « le passif attend, et on bascule à la main » | resume.avant, reflexe | NON SOURCÉE | Aucune des trois sources ne parle d'actif/passif ni de bascule manuelle. | Retirer « à la main » (contradictoire avec « par un cluster ») ou reformuler : « Le passif attend ; la bascule est déclenchée par un cluster HA ou un opérateur. » Marquer comme connaissance générale, ou ajouter une source HA (non ouverte à ce jour). |
| Éliminer les points de défaillance uniques reste le but ; une bascule non testée n'existe pas | resteVrai | NON SOURCÉE | Rien dans les sources listées. | Retirer, ou reformuler comme principe de conception sans source ; la page PDB recommande seulement de répliquer pour plus de disponibilité. |
| Plusieurs réplicas actifs plutôt qu'un actif et un passif ; Kubernetes remplace ce qui tombe | resume.apres, change | NON SOURCÉE (partielle) | La page PDB dit « répliquez votre application pour une meilleure disponibilité ». Le remplacement automatique des pods n'y est pas décrit. | Reformuler : « Kubernetes recommande de répliquer l'application pour la disponibilité » (page disruptions). Retirer « remplace ce qui tombe » ou citer la page sur les contrôleurs de charge de travail (non ouverte). |
| « Le Service répartit le trafic » ; flèches Service vers pods | schéma, diagramme | NON SOURCÉE | Les pages ouvertes mentionnent les Services comme destinataires du trafic, mais pas leur rôle de répartition. | Ajouter une source sur les Services, à ouvrir et vérifier, ou retirer « répartit ». |
| « Une sonde de readiness mal réglée peut retirer tous les pods du trafic en même temps : le service se retrouve sans destination » | piège, epreuve.cas, epreuve.raisonnement | DOUTEUSE | La page décrit le retrait d'un pod unready, mais ne traite ni du cas où tous échouent ni du risque d'un réglage trop strict. | Reformuler : « Un pod dont la readiness échoue ne reçoit plus de trafic. Si tous échouent ensemble, aucun pod n'est éligible : c'est une conséquence logique, que la page ne décrit pas. » À marquer comme déduction, pas comme citation. |
| « Réglez les sondes sur le comportement réel de l'application » (et « pas sur un comportement idéal ») | piège, epreuve.raisonnement | DOUTEUSE | La page donne des repères précis (initialDelaySeconds, startupProbe pour démarrage lent, readiness et liveness indépendantes) mais pas cette formule. | Remplacer par ce que la page dit : « Utilisez initialDelaySeconds ou une startupProbe pour attendre avant la première sonde ; readiness et liveness ne dépendent pas l'une de l'autre. » Retirer « pas sur un comportement idéal ». |
| Diagramme : « garde ≥ 2 » (PDB vers le pod C), 3 réplicas | diagramme.liens | NON SOURCÉE (conforme à l'exemple de la page) | L'exemple de la page impose au moins 2 pods disponibles sur 3, mais c'est un exemple, pas une valeur par défaut. | Libeller « exemple : garde ≥ 2 sur 3 » ; la flèche vers un seul pod (C) est trompeuse, un PDB vise l'ensemble des pods sélectionnés. |
| Diagramme : « heartbeat » entre actif et passif | diagramme.liens | NON SOURCÉE | Non couvert (actif/passif absent des sources). | Retirer ou sourcer à part. |

## Liens en échec

Aucun. Sources et plusLoin : 8 URL testées (3 sources, 5 plusLoin hors doublons), toutes en HTTP 200 (curl, redirections suivies). Le contenu des playlists YouTube et du cours Linux Foundation n'a pas été relu.

## Verdict sur l'épreuve

- **Soutien par la source :** partiel. Le premier pas (un pod unready ne reçoit pas de trafic) est soutenu par la page des sondes. « Si tous échouent, le service se retrouve sans destination » est une déduction non écrite dans la source, et « se règlent sur le comportement réel » n'y figure pas. À reformuler comme indiqué plus haut, avec la mention « déduction » pour le deuxième pas.
- **Réalisme :** le cas est plausible pour un architecte télécom (passage d'un couple actif/passif à des réplicas sur une fonction du cœur 5G ; readiness trop stricte qui échoue ensemble sur un pic de charge ou une dépendance externe indisponible). À préciser : la page cite justement les dépendances externes après démarrage comme cause de readiness en échec, ce qui rend le scénario plus fidèle. La question « sur quoi réglez-vous les sondes ? » appelle une réponse que la source soutient mieux si elle est cadrée sur startupProbe, initialDelaySeconds et l'indépendance readiness/liveness.
- Réserve : « fonction du cœur 5G » n'est sourcée nulle part ; c'est un contexte d'exemple, non une affirmation technique, mais le champ `exemple` l'affirme sans source de répliques de NF.
