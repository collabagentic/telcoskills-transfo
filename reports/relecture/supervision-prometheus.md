# Relecture : supervision-prometheus

Résumé
- Confirmés : 10 affirmations (règles et clause for, envoi à Alertmanager, regroupement, symptômes vs causes, alerte actionnable, bruit, scrape, notification, regroupement en résumé).
- Non sourcés : 7 (compteurs propriétaires et seuils fixes, « centaines de règles », « CPU normal », exemple SMF/PDU, seuil réglé sur le service réel, Grafana/PromQL, et l'absence d'étiquette `avisAuteur`).
- Douteux : 4 (« intervalle régulier » absent de la page citée, « mail, chat, téléphone », « diagnostiquées dans les tableaux de bord », « /metrics »).

## Lecture des sources
- prometheus.io alerting_rules : lue (200). Ne mentionne pas l'intervalle d'évaluation.
- prometheus.io alertmanager : lue (200).
- sre.google monitoring-distributed-systems : lue (200), via résumé WebFetch (pas de texte intégral).
- Pages complémentaires ouvertes : prometheus.io/docs/prometheus/latest/configuration/configuration/ (100 000 premiers caractères sur 237 000 ; evaluation_interval, défaut 1m) ; prometheus.io/docs/alerting/latest/configuration/ (liste des receivers, 100 000 caractères sur 111 000) ; prometheus.io/docs/instrumenting/exposition_formats/ (lue).
- Playlists YouTube : HTTP 200 seulement après deux redirections (mur de consentement) ; titres lus avec un cookie de consentement, contenu des vidéos non vérifié.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Prometheus évalue les règles d'alerte à intervalle régulier | change.1 | DOUTEUX | La page alerting_rules ne le dit pas. La page de configuration (ouverte) décrit evaluation_interval (défaut 1m) comme la fréquence d'évaluation des règles. | Ajouter aux sources https://prometheus.io/docs/prometheus/latest/configuration/configuration/ |
| La clause « for » impose que la condition dure avant d'alerter | change.1, schéma, diagramme | CONFIRMÉE | for : l'alerte reste « pending » tant que la durée n'est pas atteinte. | Aucune. |
| Alerter de préférence sur les symptômes plutôt que sur chaque cause | change.2, reflexe, epreuve | CONFIRMÉE | Le chapitre SRE recommande de faire porter les pages sur les symptômes et de réserver les causes au diagnostic. | Aucune. |
| Alertmanager regroupe les alertes similaires, par labels, en une notification | change.3, schéma, resume.apres | CONFIRMÉE (nuance) | Le regroupement fusionne des alertes similaires en une notification ; exemple cluster + alertname, défini dans l'arbre de routage. | Écrire « selon les labels choisis dans la configuration ». |
| Prometheus envoie les alertes à Alertmanager | diagramme (prom vers am) | CONFIRMÉE | Les clients comme Prometheus envoient leurs alertes à l'API d'Alertmanager. Sens de la flèche correct. | Aucune. |
| Alertmanager notifie l'astreinte : « mail, chat, téléphone » | diagramme (am vers astreinte) | DOUTEUX | Page Alertmanager : e-mail, PagerDuty, OpsGenie. Page de configuration (ouverte) : Slack, Teams, Telegram, webhook, etc. « Téléphone » n'est pas cité tel quel. Sens de la flèche correct. | Reformuler : « e-mail, messagerie, outil d'astreinte (PagerDuty, Opsgenie) », source : https://prometheus.io/docs/alerting/latest/configuration/ |
| Les pods exposent /metrics ; Prometheus les scrape (flèche prom vers pods) | diagramme, schéma | DOUTEUX (partiel) | Prometheus interroge ses cibles en HTTP (scrape_interval, scrape_config). Le chemin « /metrics » n'est pas nommé sur la page des formats d'exposition. Sens de la flèche (prom vers pods) correct : c'est Prometheus qui tire. | Écrire « exposent leurs métriques en HTTP », ou ajouter une source qui nomme /metrics (aucune ouverte à ce jour). |
| Grafana interroge Prometheus en PromQL (flèche graf vers prom) | diagramme | NON SOURCÉE | Aucune des trois sources ne parle de Grafana. | Ajouter une source Grafana lue, étiqueter « avis d'auteur », ou retirer le nœud. Un tutoriel « Grafana fundamentals » existe sur grafana.com/tutorials/ mais son contenu n'a pas été lu. |
| Les causes se diagnostiquent ensuite dans les tableaux de bord | epreuve.raisonnement | DOUTEUX | Le chapitre SRE traite les données de cause comme aides au diagnostic ; il recommande les tableaux de bord pour les problèmes non critiques et les signaux de base, sans dire « diagnostiquer les causes ». | Reformuler : « les causes servent au diagnostic, une fois l'alerte levée sur le symptôme ». |
| Une alarme doit toujours conduire à une action | resteVrai.1 | CONFIRMÉE | Chapitre SRE : chaque page doit être actionnable. | Aucune ; ajouter la source SRE. |
| Débit, erreurs, latence restent les premiers indicateurs | resteVrai.2 | CONFIRMÉE (nuance) | Quatre signaux d'or : latence, trafic, erreurs, saturation. | Ajouter « et saturation » ou citer les quatre signaux ; étiqueter « avis d'auteur » pour « premiers ». |
| Un seuil se règle sur le service réel, pas sur une valeur par défaut | resteVrai.3 | NON SOURCÉE | Rien de tel dans les sources. | Étiqueter « avis d'auteur » (conseil). |
| Compteurs propriétaires remontés par l'équipementier, seuils fixes, une alarme par cause | resume.avant, schéma.avant, reflexe | NON SOURCÉE | Comparaison avec l'ancien monde, aucune source. | Étiqueter « avis d'auteur » (resume, reflexe) ; admis tel quel. |
| Des centaines de règles sur des causes, qui se déclenchent ensemble ; du bruit, les vraies alertes se perdent | piege | NON SOURCÉE (partielle) | Le chapitre SRE confirme que le bruit fait ignorer les vraies alertes. « Des centaines » n'est pas sourcé. | Étiqueter « avis d'auteur » (piege) et remplacer « des centaines » par « beaucoup de ». |
| Un CPU élevé n'est pas forcément un problème ; un service peut être en panne avec un CPU normal | epreuve.raisonnement | NON SOURCÉE (inférence) | Le chapitre cite un CPU surchargé comme cause possible d'une lenteur ; il ne dit pas ce que la fiche affirme. | Étiqueter « avis d'auteur » ou reformuler : « le CPU est une cause possible, pas ce que l'utilisateur subit ». |
| Pour une SMF : alerte sur le taux d'échec d'établissement de session PDU au-dessus d'un seuil pendant plusieurs minutes, plutôt qu'une alarme par pod redémarré | exemple, epreuve.cas | NON SOURCÉE | Application du principe SRE et de for ; la métrique SMF n'est dans aucune source. | Étiqueter « avis d'auteur » (exemple illustratif) ; ne citer aucun nom de métrique 3GPP sans source. |

## Liens en échec
Aucun lien en échec. Tous répondent 200 : prometheus.io (2), sre.google (2), grafana.com (2). Les deux playlists YouTube répondent 200 après 2 redirections vers un écran de consentement ; titres conformes (« PROMETHEUS / GRAFANA : tutos et formation sur l'observabilité », « Prometheus Fundamentals »). Les auteurs xavki et PromLabs ne sont pas vérifiés. Le contenu de grafana.com/docs/learning-journeys/ et de sre.google/resources/ n'a pas été lu (code 200 seulement).

## Épreuve
- Cas : réaliste pour un architecte télécom (SMF, alarmes de causes de type CPU ou pod redémarré).
- Raisonnement : le fond (symptôme plutôt que cause, bruit qui noie les vraies alertes) est soutenu par le chapitre SRE cité. Deux éléments dépassent la source : « un service peut être en panne avec un CPU normal » (inférence, à étiqueter avis d'auteur) et « les causes se diagnostiquent dans les tableaux de bord » (à reformuler). L'exemple PDU est illustratif.
- Verdict : partiellement soutenu. Après correction ou étiquetage de ces deux phrases, l'épreuve est acceptable.

## Remarque
Le champ `avisAuteur` n'existe pas encore dans la fiche : tout l'étiquetage ci-dessus reste à faire. `pourquoiNouveau` est null.
