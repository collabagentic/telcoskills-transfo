# Relecture de la fiche interfaces-sbi

Fiche : `content/fiches/interfaces-sbi.json` (brouillon, 2026-11-09). Relecture du 2026-11-21. Aucun fichier de `content/` ni de `src/` n'a été modifié.

## Résumé

- **Confirmés : 14.** Les faits sur HTTP/2, JSON, OpenAPI, N2 en SCTP, N3 en GTP-U, les points de référence et les flèches du diagramme sont tous dans les spécifications.
- **Non sourcés : 5.** Ce sont la pile 4G (S1AP, GTP, Diameter), la parenthèse « interface secondaire », « publiée par le 3GPP », « liens câblés » et « point à point » dans `resume.avant`.
- **Douteux : 2.** La citation de l'épreuve (clauses 5.2 et 5.4) ne couvre pas les affirmations sur N2 et N3. Le champ `avisAuteur` n'existe pas dans la fiche.

## Ce qui a été lu

Les archives zip 3GPP ont été téléchargées dans un dossier temporaire hors dépôt (`...\scratchpad\dl`), puis leur docx a été converti en texte. Lecture intégrale possible, avec recherche par clause.

| Spécification | Version lue | Lecture |
|---|---|---|
| TS 29.500 | V20.0.0 (2026-09) | Clauses 5.1 à 5.5 lues. |
| TS 23.501 | V20.3.0 (2026-09) | Clauses 4.2.1, 4.2.6, 4.2.7, 8.2.1.2, 8.3.1 et annexe A lues. |
| TS 38.412 | V19.0.0 (2025-09) | Clauses 4 et 7 lues. |
| Kubernetes, Services (SCTP) | page en ligne | Lue via la page `reference/networking/service-protocols/`. La page `.../service/#protocol-sctp` répond 200, mais l'ancre n'est pas dans la partie lisible (page tronquée). |

Non lus :
- TS 29.244 (PFCP), TS 29.281 (GTP-U), TS 36.413 (S1AP), TS 29.272 (Diameter S6a) et TS 29.274 (GTPv2-C).
- Les pages des MOOC IMT Atlantique, des deux playlists YouTube, de ShareTechnote et de Coursera : seul le code HTTP a été contrôlé (voir plus bas).

Point de vigilance : TS 29.500 est en V20.0.0 et TS 23.501 en V20.3.0. Les numéros de clause cités ci-dessous valent pour ces versions.

## Tableau des affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Les interfaces de service utilisent HTTP/2 avec JSON | `resume.apres`, `change.1`, `piege`, `epreuve.raisonnement` | CONFIRMÉE | TS 29.500 clause 5.1 : les interfaces de service emploient HTTP/2 (5.2) et JSON (5.4). | Aucune. |
| Messages décrits en OpenAPI | `resume.apres`, `change.2`, `schema.apres` | CONFIRMÉE | TS 29.500 clause 5.5 : OpenAPI sert de langage de description (IDL) des interfaces de service. | Ajouter la clause 5.5 aux sources. Elle n'est pas dans « 5.2 et 5.4 ». |
| « Chaque service est décrit par une spécification OpenAPI **publiée par le 3GPP** » | `change.2` | NON SOURCÉE (en partie) | 29.500 5.5 impose OpenAPI comme IDL. La mention « publiée par le 3GPP » n'est pas dans les clauses lues. | Reformuler : « Les interfaces de service sont décrites avec OpenAPI (TS 29.500, clause 5.5). » Retirer « publiée par le 3GPP », ou ajouter une source ouverte (TS 29.510, annexe A.3, citée en 29.500, non ouverte ici). |
| HTTP/2 repose sur TCP | non écrit dans la fiche | Sans objet | TS 29.500 clause 5.3 : TCP est le transport. | Optionnel : citer 5.3 pour justifier « SCTP ≠ SBI ». |
| La signalisation RAN-cœur (N2) est transportée en SCTP | `resteVrai.2`, `piege`, `exemple`, diagramme `ran→amf` | CONFIRMÉE | TS 38.412 clause 7 : SCTP est le transport du signal NG-C. TS 23.501 clause 8.2.1.2 : SCTP entre l'AMF et le 5G-AN (N2). | Aucune. Citer 23.501 8.2.1.2 et 38.412 clause 7 dans `epreuve.source`. |
| N2 transporte NGAP | `piege`, `epreuve.raisonnement` | CONFIRMÉE | TS 23.501 clause 8.2.1.1 : NGAP est le protocole de la partie contrôle entre 5G-AN et cœur. | Aucune. |
| N3 est en GTP-U | `piege`, `epreuve.raisonnement`, diagramme `ran→upf` | CONFIRMÉE | TS 23.501 clause 8.3.1 : GTP-U sert au tunnel de données sur N3 (RAN-UPF) et N9. | Citer 23.501 8.3.1. |
| N1, N2, N3, N4 sont des points de référence nommés | `change.3` | CONFIRMÉE | TS 23.501 clause 4.2.7 : N1 UE-AMF, N2 RAN-AMF, N3 RAN-UPF, N4 SMF-UPF, N11 AMF-SMF. | Aucune. |
| Les nœuds laissent place à des fonctions (AMF, SMF, UPF) | `change.3`, `schema.apres` | CONFIRMÉE | TS 23.501 clauses 4.2.1 et 4.2.6 : l'architecture est « basée sur les services » et les fonctions du plan de contrôle n'utilisent que des interfaces de service entre elles. | Aucune. |
| « Quelques interfaces gardent leur transport d'origine » | `resume.apres` | CONFIRMÉE | N2 (SCTP) et N3 (GTP-U) : voir les lignes ci-dessus. | Aucune. |
| L'AMF appelle la SMF pour créer une session PDU | `exemple`, `epreuve.raisonnement` | CONFIRMÉE | TS 23.501 cite le message `Nsmf_PDUSession_CreateSMContext` envoyé par l'AMF à la SMF. La clause 4.2.6 déclare l'interface de service de la SMF (Nsmf). | Aucune. Le service nommé peut être ajouté à l'exemple. |
| L'AMF appelle la SMF « par une requête HTTP/2 » | `exemple` | CONFIRMÉE | Conséquence de 29.500 clause 5.1 et de 23.501 clause 4.2.1 (plan de contrôle en interfaces de service). | Aucune. |
| Diagramme : `ran → amf`, « N2 · SCTP » | `diagramme.liens` | CONFIRMÉE | N2 = RAN-AMF, en SCTP. Sens correct : le RAN est client de l'AMF, le lien est bidirectionnel. | Aucune. |
| Diagramme : `amf → smf`, « N11 · HTTP/2 » | `diagramme.liens` | CONFIRMÉE | N11 = AMF-SMF (4.2.7). Réalisée par le service Nsmf en HTTP/2 (29.500 clause 5.1 ; 23.501 annexe A). | Optionnel : écrire « N11 · Nsmf, HTTP/2 », car N11 est un point de référence et Nsmf l'interface de service. |
| Diagramme : `amf → nrf` et `smf → nrf`, « Nnrf » | `diagramme.liens` | CONFIRMÉE | Nnrf est l'interface de service de la NRF (23.501 clause 4.2.6). Les consommateurs appellent la NRF. | Aucune. |
| Diagramme : `smf → upf`, « N4 · PFCP » | `diagramme.liens` | NON SOURCÉE (en partie) | N4 = SMF-UPF confirmé. 23.501 évoque « PFCP over N4 » dans une note, mais PFCP n'est pas défini dans les documents lus (TS 29.244, non ouvert). | Ajouter TS 29.244 aux sources après l'avoir ouverte, ou garder « N4 » seul. |
| Diagramme : `ran → upf`, « N3 · GTP-U » | `diagramme.liens` | CONFIRMÉE | N3 = RAN-UPF, GTP-U. Sens libre : le trafic est bidirectionnel. | Aucune. |
| Diagramme : l'UPF est hors de la zone SBI, la NRF dedans | `diagramme.zones`, `noeuds` | CONFIRMÉE | L'UPF ne porte pas d'interface de service dans la liste de 4.2.6. La NRF y figure (Nnrf). | Aucune. |
| Diagramme : AMF « accès, mobilité », SMF « sessions PDU », NRF « annuaire », UPF « plan usager » | `diagramme.noeuds` | NON SOURCÉE | Descriptions courtes non reprises mot à mot de TS 23.501 (non cherchées). | Étiqueter « avis d'auteur » (`schema`) ou ajouter 23.501 clause 6.2 après lecture. |
| Pile de l'ancien monde : S1AP, GTP, Diameter ; MME, SGW, HSS | `avant`, `schema.avant` | NON SOURCÉE | Rien dans les documents lus. TS 23.501 cite seulement S1AP en référence (36.413) et Diameter pour l'IMS. | Pas étiquetable « avis d'auteur » tel quel : c'est un fait. Ajouter les sources 4G (TS 36.413, 29.274, 29.272) après ouverture, ou retirer les détails, ou reformuler en repère général. |
| « Des liens câblés », « interfaces point à point entre nœuds » | `resume.avant` | NON SOURCÉE | Pas de source. « Point à point » correspond à la notion de point de référence, mais « câblés » est une image. | Étiquetable « avis d'auteur » (`resume`) si « liens câblés » est mis entre guillemets ou remplacé par « liens dédiés ». |
| Les nœuds du plan de contrôle se parlent uniquement par SBI | non écrit tel quel | DOUTEUSE (portée) | TS 23.501 clause 4.2.1 : les NFs du plan de contrôle n'emploient que des interfaces de service entre elles. | Ne pas généraliser à « tout le cœur » : N2, N3, N4, N1 restent. Déjà bien traité dans `piege`. |
| « Demandent un traitement réseau particulier dans le cluster (SCTP, interface secondaire) » | `piege`, `epreuve.raisonnement` | DOUTEUSE | Kubernetes : SCTP exige un plugin réseau qui l'accepte ; le multihoming exige un plugin capable d'attribuer plusieurs interfaces et adresses à un pod. Rien sur « interface secondaire » en général. | Séparer : « SCTP demande un plugin réseau compatible (Kubernetes, service-protocols) » (source) et « une interface secondaire est une pratique courante » (avis d'auteur). N3 (GTP-U) n'est pas concerné par SCTP : la parenthèse est ambiguë. |
| « Les procédures du cœur restent à connaître » ; « lire une trace reste le geste de base » | `resteVrai.1`, `resteVrai.3` | Avis | Opinion pédagogique, pas un fait technique. | Étiqueter « avis d'auteur » (`resteVrai`, `resteVrai.N`). |
| « Une interface est un lien dédié entre deux nœuds » | `reflexe` | Avis | Réflexe attribué à l'ancien monde. | Étiqueter « avis d'auteur » (`reflexe`). |
| Champ `avisAuteur` | racine de la fiche | ABSENT | Aucun champ `avisAuteur` dans le JSON. Les passages d'opinion ne sont donc pas étiquetés. | Ajouter le champ pour `resteVrai`, `resteVrai.2`, `resteVrai.3`, `reflexe`, `resume.avant` et les descriptions du diagramme. |

## Corrections prioritaires (formulations)

1. `epreuve.source` : remplacer « TS 29.500, clauses 5.2 et 5.4 » par « TS 29.500 clauses 5.1, 5.2, 5.4, 5.5 (HTTP/2, JSON, OpenAPI) ; TS 23.501 clauses 8.2.1.2 et 8.3.1 (N2 en SCTP, N3 en GTP-U) ; TS 38.412 clause 7 (SCTP) ; Kubernetes, Services (SCTP) ».
2. `change.2` : « Chaque service est décrit avec OpenAPI (TS 29.500, clause 5.5). »
3. `piege` : scinder en un fait sourcé (SCTP exige un plugin réseau compatible) et un conseil étiqueté « avis d'auteur » (interface secondaire).
4. `avant` et `schema.avant` : sourcer la pile 4G ou la retirer.

## Liens

Tous les liens de `sources`, de `plusLoin` et de `diagramme.source` répondent HTTP 200, sans redirection (testé avec `curl -sL`). Les trois URL 3GPP exposent bien un répertoire de zips. La dernière version a été lue pour chaque spécification.

Limites du contrôle :
- Un code 200 ne prouve pas que la page est pertinente. Seules les pages 3GPP et Kubernetes (service-protocols) ont été lues.
- La page IMT Atlantique est la liste générale des MOOC : elle contient « 5G : principes de l'interface radio et du réseau d'accès », ce qui est peu précis pour un cours sur le cœur 5G.
- Les playlists YouTube, ShareTechnote et Coursera répondent 200, mais leur contenu n'a pas été lu.
- Lien Kubernetes avec ancre `#protocol-sctp` : la page répond, mais l'ancre n'a pas pu être vérifiée dans la partie lisible. L'information existe dans la page `https://kubernetes.io/docs/reference/networking/service-protocols/`, que j'ai ouverte.

## Épreuve

**Raisonnement attendu : partiellement soutenu.**
- Soutenu par la source citée (TS 29.500 5.1, 5.2, 5.4) : HTTP/2 + JSON pour les interfaces de service.
- **Non soutenu par la source citée** : N2 en SCTP et N3 en GTP-U. Ces faits sont dans TS 23.501 (8.2.1.2, 8.3.1) et TS 38.412 (clause 7), qui ne figurent pas dans `epreuve.source`. TS 29.500 ne parle ni de N2, ni de N3, ni de SCTP.
- Le conseil « traitement réseau particulier » n'est que partiellement sourcé (plugin réseau SCTP) ; « interface secondaire » relève de l'avis d'auteur.

**Réalisme du cas.** Le cas est réaliste pour un architecte télécom : l'erreur « tout est en HTTP/2 » est courante, et la question sur l'impact dans le cluster est pertinente (SCTP pour le N2, plugin réseau). Le raisonnement est juste, mais la source citée doit être complétée avant publication.
