# Relecture : observabilite-traces (nouveauté, sans « avant »)

**Résumé**
- Confirmés : 5 affirmations (trois signaux, Collector reçoit/traite/exporte, trace = chemin d'une requête, backends multiples, export vers outils d'analyse).
- Non sourcés : 8 (identifiant de trace, échantillonnage, coût stockage/réseau, filtrage au Collector, HTTP/2, parcours AMF/SMF/PCF/UPF, OTLP, « pas d'équivalent dans le monolithe »).
- Douteux : 3 (« filtre » seul dans le schéma, « échantillonne » attribué au Collector, ordre/sens des flèches du diagramme).

## Ce qui a été lu
- https://opentelemetry.io/docs/concepts/signals/ : lue (HTTP 200). Définit traces (chemin d'une requête), métriques (mesure au runtime), journaux (enregistrement d'un événement), baggage ; profils en cours de développement. Ne mentionne ni identifiant de trace, ni échantillonnage, ni Collector (les mots n'apparaissent que dans le menu de navigation).
- https://opentelemetry.io/docs/collector/ : lue (HTTP 200). Collector = manière indépendante des fournisseurs de recevoir, traiter et exporter ; vers un ou plusieurs backends ; cite le « filtrage de données sensibles », retries, batching, chiffrement ; OTLP cité côté exporteurs. Pas d'échantillonnage dans le corps de la page, aucune affirmation de coût. Un lien Benchmarks existe, non ouvert.
- Limite : les pages ont été lues via un résumé automatique complété par un contrôle curl des mots-clés ; pas de lecture intégrale mot à mot. Les pages « Traces », « Sampling » et « Context propagation » existent dans le menu de la doc mais n'ont PAS été ouvertes : je ne peux pas les proposer comme sources.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| OpenTelemetry collecte trois signaux : traces, métriques, journaux | change[0], epreuve.raisonnement | DOUTEUSE (incomplète) | La page liste traces, métriques, journaux et baggage ; profils en développement | Écrire « les signaux principaux sont traces, métriques et journaux (la page cite aussi le baggage) » ; ou « au moins trois signaux ». « Trois » seul est inexact |
| Le Collector reçoit, traite et exporte la télémétrie | change[1] | CONFIRMÉE | Collector : recevoir, traiter, exporter, vers un ou plusieurs backends | Aucune |
| Trace = parcours d'une requête / suit une requête de bout en bout | resume.apres, epreuve.raisonnement | CONFIRMÉE | « Chemin d'une requête dans l'application » | Aucune (« avec le temps passé dans chacun » : voir ligne suivante) |
| La trace donne le temps passé dans chaque service / montre quelle étape ralentit | resume.apres, exemple, epreuve, schema | NON SOURCÉE | La page signaux ne parle pas de durée par étape | Étiqueter « avis d'auteur » (resume, exemple), ou ajouter la page Traces d'OpenTelemetry après l'avoir ouverte. Non rédhibitoire : c'est la définition courante, mais elle n'est pas dans les sources actuelles |
| Un identifiant de trace relie les étapes d'une même requête | change[2] | NON SOURCÉE | Absent des deux pages | Source à ajouter (page Traces ou Context propagation, à ouvrir) ; à défaut retirer ou reformuler en « la trace relie les étapes d'une requête » (couvert par la définition) |
| Le Collector filtre avant l'export | piege, schema.apres[1], diagramme (collector) | DOUTEUSE | Seul le « filtrage de données sensibles » est cité | Reformuler : « le Collector peut aussi filtrer des données (par exemple sensibles) avant de les envoyer » |
| On échantillonne ; le Collector échantillonne | piege, diagramme collector.detail | NON SOURCÉE / DOUTEUSE | Échantillonnage absent des deux pages ; le diagramme l'attribue au Collector | « On échantillonne » : conseil, étiqueter « avis d'auteur » ; « le Collector échantillonne » : retirer du diagramme ou citer la page Sampling après ouverture |
| La télémétrie coûte du stockage et du réseau | piege, epreuve.raisonnement | NON SOURCÉE | Aucune affirmation de coût dans les pages | Étiqueter « avis d'auteur » (raisonnement de bon sens) ; ne pas le présenter comme fait de la doc |
| On choisit ce qui est instrumenté | piege | NON SOURCÉE | Absent | « Avis d'auteur » |
| Le Collector rassemble ce qu'émettent les services ; OTLP entre services et Collector | diagramme (lien « OTLP »), légende | CONFIRMÉE (partielle) | OTLP cité comme protocole des exporteurs vers un Collector | OK ; la mention du Collector comme intermédiaire est fidèle |
| Collector exporte vers Traces / Métriques / Journaux, stockages distincts | diagramme (bt, bm, bl) | NON SOURCÉE | La page dit « un ou plusieurs backends », sans découpage par signal | Reformuler en « vos outils d'analyse » ou étiqueter l'exemple « avis d'auteur » (schéma) |
| Sens des flèches | diagramme.liens | Cohérent | a->b->c (requête) ; a, b, c -> collector (OTLP) ; collector -> 3 backends : sens plausible et conforme au flux décrit | Détail : « Applications (SDK OpenTelemetry) » : la mention SDK n'est pas sourcée dans les deux pages ; ajouter « instrumentés » seul ou citer une page SDK ouverte |
| « Une session traverse plusieurs fonctions qui s'appellent en HTTP/2 » | pourquoiNouveau | NON SOURCÉE | Hors périmètre des sources (fait 5G SBA) | Le champ est avisAuteur : admis comme avis, mais « HTTP/2 » est un fait technique 3GPP : citer une spec 3GPP ouverte, ou retirer « HTTP/2 » |
| « Aucun journal pris seul ne montre où le temps est perdu » | pourquoiNouveau | NON SOURCÉE | Absent | « Avis d'auteur » tel quel |
| « Pas d'équivalent dans l'ancien nœud monolithique » | pourquoiNouveau | NON SOURCÉE, invérifiable | Absent | Retirer ou adoucir (« on y avait surtout des journaux et des compteurs ») en avis d'auteur : l'affirmation absolue est fausse en général (traces d'appel, traces de signalisation existent) |
| Parcours AMF -> SMF -> PCF -> UPF pour une création de session PDU | exemple, epreuve.cas | NON SOURCÉE | Aucune source télécom dans la fiche | Ajouter une source 3GPP réellement ouverte (TS 23.502, procédure d'établissement de session PDU) ou formuler « exemple illustratif » en avis d'auteur. Note : l'UPF n'est pas appelée en HTTP/2 (interface N4/PFCP avec la SMF) ; l'exemple « tout en HTTP/2 » est donc inexact pour l'UPF |
| Les journaux et compteurs restent utiles ; la trace s'ajoute | resteVrai[0] | Avis d'auteur admis | (couvert par la page : signaux complémentaires) | Aucune |
| Reconstituer un déroulé d'appel est déjà votre geste | resteVrai[1] | Avis d'auteur admis | n/a | Aucune |

## Liens
Tous répondent HTTP 200 (sources et plusLoin).
- opentelemetry.io/docs/concepts/signals/ et /docs/collector/ : 200, sans redirection.
- Playlist Wireshark Masterclass (Chris Greer) : 200, titre conforme.
- Playlist OpenTelemetry Bootcamp (Aspecto) : 200, titre conforme.
- sharetechnote.com : 200, titre « Home | ShareTechnote ».
- À noter : Wireshark Masterclass et ShareTechnote n'ont pas de rapport direct avec OpenTelemetry (analyse de paquets, références 4G/5G) ; pertinents seulement comme compléments télécom. Contenus des vidéos non vérifiés.

## Épreuve
Verdict : **partiellement soutenue**.
- Soutenu par la source : trois signaux (traces, métriques, logs) avec leurs définitions ; le Collector reçoit/traite/exporte.
- Non soutenu : « la trace montre quelle étape ralentit » (durée par étape absente de la page signaux) ; « tout tracer coûte du stockage et du réseau », « on échantillonne », « le Collector peut filtrer » (filtrage cité seulement pour les données sensibles).
- La source citée (signaux + Collector) ne contient ni échantillonnage ni coût : le « piège » repose sur un fait hors source. Il faut soit ajouter la page Sampling d'OpenTelemetry (à ouvrir), soit présenter le piège comme avis d'auteur dans le raisonnement.
- Réalisme : le cas est crédible pour un architecte télécom (latence de création de session PDU en cœur 5G). Il manque deux points : demander « quels signaux » est mal posé (ce sont toutes les réponses trois signaux, la seule vraie question est « lequel localise la lenteur »), et il suppose que l'UPF est instrumentée en OpenTelemetry alors qu'elle parle PFCP et non HTTP/2.

## Sans « avant »
Le contenu tient avec ses sources seules pour la définition (signaux, Collector). Les arguments « pourquoi nouveau » reposent sur de l'avis d'auteur et sur un fait 3GPP non sourcé ; à étiqueter ou sourcer avant de passer de brouillon à relu.
