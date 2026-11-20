# Relecture : fiche chiffrage-slo

**Résumé** : 9 affirmations confirmées, 8 non sourcées, 3 douteuses.
Les chiffres (43 200 min, 43,2 min, « 43 min par mois ») sont justes ; le seul point de vigilance est « par mois » (voir ci-dessous).
Aucune URL en échec ; une redirige (Green Software Foundation).

## Ce qui a pu être lu

- sre.google/sre-book/service-level-objectives/ : lue (HTTP 200). Le contenu a été résumé par l'outil de lecture. La page ne contient pas de tableau « 99,9 % = N minutes » : elle renvoie à une annexe.
- finops.org/introduction/what-is-finops/ : lue (HTTP 200). Ne parle ni de SLO, ni de fiabilité, ni d'attribution des coûts par équipe/service.
- Les trois autres URL de `plusLoin` : vérifiées par code HTTP et titre seulement, contenu non lu.

## Recalcul des chiffres

- 30 j x 24 h x 60 min = 43 200 min. Correct.
- 0,1 % x 43 200 = 43,2 min. Correct ; « environ 43 minutes » est correct.
- « 43 min par mois » (diagramme) : exact pour une fenêtre de 30 jours, pas pour un mois civil (31 j = 44,6 min ; 28 j = 40,3 min). Le nœud SLO dit bien « sur 30 jours » : ambigu mais défendable. Recommandé : « 43 min sur 30 jours ».
- Aucun chiffre de coût, aucun pourcentage de gain : rien d'autre à recalculer. Le « cinq ans » du TCO est une convention du « monde d'avant » (voir tableau).
- Les chiffres 43,2 / 43 200 sont un calcul arithmétique, non présents dans la source ; la source ne donne pas ce tableau. Le calcul reste vérifiable par tout lecteur.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Un SLO est un objectif mesurable de niveau de service | change.0 | CONFIRMÉE | SLO = cible que doit atteindre un SLI, mesure quantitative définie avec soin | Aucune |
| Le budget d'erreur dit combien d'indisponibilité est tolérée | change.0, noeud « Budget d'erreur » | CONFIRMÉE (nuance) | Le texte décrit le budget d'erreur comme un taux auquel les SLO peuvent être manqués | Aucune ; reformulation possible : « le budget d'erreur est la part d'écart que l'objectif tolère » |
| SLI = taux de requêtes réussies | diagramme, noeud sli | CONFIRMÉE | La disponibilité est définie comme la fraction de requêtes bien formées qui réussissent | Aucune |
| Un SLO se définit avec son SLI et sa fenêtre de mesure | piege, epreuve.raisonnement | CONFIRMÉE | Les données sont collectées sur une fenêtre de mesure ; SLO = cible sur un SLI | Aucune |
| Lien « SLI mesure SLO » (flèche sli vers slo) | diagramme.liens | DOUTEUSE (sens) | Le SLI est la mesure, le SLO la cible sur ce SLI. « SLI mesure SLO » inverse presque la relation : le SLI mesure le service, le SLO fixe la cible | Remplacer le libellé « mesure » par « sert de base à » ou « alimente » (flèche sli vers slo conservée) |
| Lien « SLO tolère budget » (flèche slo vers budget) | diagramme.liens | CONFIRMÉE | Le budget d'erreur découle du SLO (écart toléré) | Libellé « définit » plus fidèle que « tolère » (le SLO ne tolère pas le budget, il le définit) ; reformulation facultative |
| 99,9 % sur 30 jours = environ 43 min de budget | epreuve.raisonnement, noeud budget | CONFIRMÉE (calcul) | Source non chiffrée : calcul arithmétique correct | Aucune ; ajouter « calcul : 0,1 % de 43 200 min » (déjà présent dans l'épreuve) |
| Un objectif de disponibilité n'a de sens que défini avec SLI et fenêtre | piege | CONFIRMÉE | Voir ligne 4 ; le « n'a de sens que » est une formulation forte mais étiquetée piège (avisAuteur admis) | Étiqueter piege « avis d'auteur » si ce n'est pas déjà fait |
| Chaque niveau de disponibilité en plus a un coût d'architecture | change.1 | DOUTEUSE (trop fort) | La source dit seulement que viser trop haut produit des solutions coûteuses et trop conservatrices ; elle ne dit pas que chaque niveau ajoute un coût | Reformuler : « Viser une disponibilité plus haute coûte plus cher en architecture ; on le chiffre en face de l'objectif » et étiqueter « avis d'auteur » (change.1), ou ajouter une source qui l'établit (non ouverte à ce jour) |
| FinOps rend le coût visible et attribuable par équipe ou par service, en continu | change.2 | DOUTEUSE | La page FinOps parle de responsabilité partagée (« everyone takes ownership of their cost and usage »), de démarche itérative, d'optimisation de la valeur. Elle ne parle pas d'attribution par équipe/service ni de visibilité | Reformuler : « FinOps est une pratique continue où ingénierie, finance et métier se partagent la responsabilité du coût du cloud » (fidèle à la page) ; l'attribution par équipe/service est NON SOURCÉE, à retirer ou à étiqueter « avis d'auteur » |
| Un chiffrage reste une hypothèse, avec ses marges et risques | resteVrai.0 | NON SOURCÉE | Hors des sources | Étiqueter « avis d'auteur » tel quel (conseil) |
| Le TCO reste utile pour comparer des options sur la durée | resteVrai.1 | NON SOURCÉE | Hors des sources | Étiqueter « avis d'auteur » tel quel |
| Le client achète un service, pas une technologie | resteVrai.2 | NON SOURCÉE | Hors des sources | Étiqueter « avis d'auteur » tel quel |
| « Un chiffrage par équipement et par licence, un TCO sur cinq ans, des marges de sécurité » | resume.avant, schema.avant | NON SOURCÉE | Hors des sources ; « cinq ans » est un usage courant, non établi | Étiqueter « avis d'auteur » (resume et schema le sont par convention) ; « sur cinq ans » à nuancer en « sur plusieurs années » ou à retirer le chiffre |
| « Ce qu'on paie pour tenir 99,9 % plutôt que 99 %, mesuré en continu » | resume.apres | NON SOURCÉE | La source ne compare pas les coûts de 99 % et 99,9 % | Étiqueter « avis d'auteur » (resume) ; aucun chiffre de coût n'est avancé, donc acceptable |
| Le chiffrage se fige à la signature | reflexe | NON SOURCÉE | Hors des sources | Étiqueter « avis d'auteur » (reflexe) tel quel |
| Trois réplicas sur un site, ou six sur deux sites, chiffrés en face de chaque objectif | exemple | NON SOURCÉE | La source ne mentionne ni réplicas ni sites ; c'est un cas illustratif, sans chiffre | Étiqueter « avis d'auteur » (exemple) ; ne pas laisser entendre que « trois réplicas » donne un niveau de disponibilité précis |
| Le SLO « impose » une architecture (flèche slo vers archi) | diagramme.liens | NON SOURCÉE | La source ne dit pas qu'un SLO impose une architecture | Étiqueter « avis d'auteur » ; verbe plus prudent : « pèse sur » |
| Flèche archi vers coût, libellée « FinOps » | diagramme.liens | DOUTEUSE (sens) | FinOps n'est pas un lien causal de l'architecture vers le coût ; c'est la pratique qui rend le coût visible | Libellé « détermine » (archi vers coût) et mentionner FinOps dans le détail du nœud Coût, ou « mesuré via FinOps » |

Note : le tableau ci-dessus compte 3 douteuses « de fond » (change.1, change.2, sens de « mesure ») plus 1 de sens (flèche « FinOps ») ; le résumé du haut retient les 3 premières comme douteuses de fond.

## Liens

| URL | Code | Remarque |
|---|---|---|
| sre.google/sre-book/service-level-objectives/ | 200 | OK, lue |
| finops.org/introduction/what-is-finops/ | 200 | OK, lue |
| youtube.com/playlist?list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h | 200 | Titre « Prometheus Fundamentals » ; contenu non lu |
| sre.google/resources/ | 200 | OK, non lue en détail |
| learn.greensoftware.foundation/ | 200 après redirection vers movement.greensoftware.foundation/collections/3086009 | Titre « Courses » ; la cible est cohérente (cours de la fondation) mais l'URL de la fiche redirige : à mettre à jour si l'auteur le souhaite. Le lien avec la fiche (SLO/FinOps) est lointain (compétence cout-energie) |

Aucun lien en échec.

## Épreuve

- Calcul : juste (43 200 min, 43,2 min).
- « Un SLO ne se vend pas sans pouvoir le mesurer, avec SLI et fenêtre » : soutenu par la source (SLI mesure quantitative, fenêtre de mesure). Le « il ne se vend pas » est un conseil, admis.
- Le « budget d'erreur » est soutenu par la source en tant que notion ; le chiffre en minutes vient du calcul, pas de la source, ce que le raisonnement ne précise pas. Suggestion : ajouter « calcul simple, non fourni par la source ».
- Réalisme : cas crédible pour un architecte télécom (SLO de disponibilité sur une fonction du cœur). Un détail manque dans le cas : il n'est pas précisé si l'indisponibilité se mesure en temps ou en requêtes échouées ; le raisonnement répond bien à cette ambiguïté en exigeant le SLI.
- Verdict : épreuve VALIDE, avec la précision ci-dessus (nombre calculé, non cité).

## Points les plus importants

1. change.2 (FinOps « attribuable par équipe ou par service ») n'est pas soutenu par la page FinOps ouverte : à reformuler ou à étiqueter « avis d'auteur ».
2. change.1 (« chaque niveau de disponibilité en plus a un coût ») : plus fort que la source ; reformuler ou étiqueter.
3. Flèches du diagramme : « SLI mesure SLO » (sens trompeur) et « FinOps » entre architecture et coût ; « 43 min par mois » à préciser en « sur 30 jours ».
