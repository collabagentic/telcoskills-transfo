# Relecture de la fiche changement-pr

Fiche : content/fiches/changement-pr.json (statut brouillon, 2026-11-08). Aucun fichier de content/ ni de src/ n'a été modifié.

## Résumé

- Confirmés : 9
- Non sourcés : 8 (dont 6 étiquetables « avis d'auteur » tel quel, 2 à corriger ou à compléter)
- Douteux : 3 (zone du diagramme, « tests, lint, sécurité », « sinon il signale seulement l'écart » et la partie Flux de l'épreuve)

La fiche ne contient aucun champ `avisAuteur` : tous les passages d'opinion sont donc aujourd'hui non étiquetés.

## Pages ouvertes

| Page | Lecture |
|---|---|
| GitHub, about-protected-branches | Lue (WebFetch, HTTP 200). Couvre vérifications d'état obligatoires, approbations obligatoires, blocage de « request changes ». |
| Argo CD, auto_sync | Lue (WebFetch, HTTP 200). Couvre synchronisation automatique, prune, selfHeal (désactivé par défaut). |
| OpenGitOps | Lue (WebFetch, HTTP 200). Les quatre principes : déclaratif, versionné et immuable, tiré automatiquement, réconcilié en continu. |
| GitLab CI/CD | Lue (WebFetch). Redirige vers https://docs.gitlab.com/ci/ (même sujet). Le résumé obtenu mentionne des pipelines déclenchés par commit ou merge request, des stages dont test et deploy ; il ne mentionne ni lint ni analyse de sécurité (renvoi vers une autre section). Lecture via un modèle de résumé, donc à confirmer visuellement. |
| Playlists YouTube, Learn Git Branching | Seul le code HTTP et le titre de la playlist ont été vérifiés ; le contenu des vidéos n'a pas été vu. |

Rien n'a été tronqué ni bloqué, mais WebFetch renvoie des résumés, pas le texte brut.

## Tableau des affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Des vérifications automatiques doivent réussir avant fusion ; branche principale protégée | piege, epreuve.raisonnement, diagramme (fusion « branche protégée ») | CONFIRMÉE | GitHub : une branche protégée peut exiger des vérifications d'état réussies (ou ignorées/neutres) et un nombre d'approbations avant fusion. | Aucune. Préciser « réussies, ignorées ou neutres » si l'on veut être exact. |
| « elle devient une formalité et le pipeline un simple outil de livraison » | piege | NON SOURCÉE (opinion) | Aucune source ne le dit. | Étiqueter « avis d'auteur » (`avisAuteur.piege`). |
| La relecture porte sur un diff dans une pull request | change.1, schema, diagramme | CONFIRMÉE | GitHub décrit les revues de pull request avec approbations requises. | Aucune. |
| Un relecteur approuve avant fusion | exemple | CONFIRMÉE | GitHub : approbations obligatoires configurables. | Préciser « si la protection l'exige ». |
| Un pipeline tourne sur une pull request / merge request | change.2, diagramme (pr → pipeline « déclenche ») | CONFIRMÉE | GitLab : un pipeline démarre sur commit ou merge request. | Aucune. |
| Pipeline : « tests, lint, sécurité » | diagramme (détail du noeud) | DOUTEUSE | La page GitLab ouverte cite des tests ; lint et sécurité n'y figurent pas (simple renvoi vers une autre section). | Remplacer par « tests, contrôles » ou ajouter une page GitLab réellement ouverte sur le lint et l'analyse de sécurité ; sinon étiqueter comme exemple d'auteur. |
| Flèche pipeline → fusion « si vert » | diagramme | CONFIRMÉE | GitHub : la fusion est bloquée tant que les vérifications obligatoires ne sont pas réussies. | Ajouter « si obligatoire » (sans cela, rien n'empêche de fusionner). |
| « La fusion déclenche le déploiement » | change.3, resume.apres, schema | CONFIRMÉE pour GitOps, NON SOURCÉE dans `sources` | Argo CD : la synchronisation automatique applique ce qui est dans Git ; le pipeline n'a qu'à pousser dans Git. Les pages GitHub/GitLab de `sources` ne le disent pas. | Ajouter à `sources` https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/ (ouverte). Nuancer : « avec un outil GitOps ». |
| « L'historique Git est la trace du changement » | change.3 | CONFIRMÉE (en partie) | OpenGitOps : l'état cible est versionné, avec historique conservé. | Aucune ; Git seul ne rend pas l'historique immuable (réécriture possible) : la protection de branche (force-push) est le garde-fou. |
| Flèche gitops → fusion « lit main » (pointillé) | diagramme | CONFIRMÉE sur le sens, imprécise sur la cible | OpenGitOps : l'agent tire la cible depuis sa source. Le sens (l'agent lit) est correct. Il lit le dépôt, pas l'événement de fusion. | Raccorder au dépôt/branche principale (ou renommer « lit le dépôt »). |
| Flèche gitops → cluster « applique » | diagramme | CONFIRMÉE | Argo CD : synchronise l'état de Git vers le cluster. | Aucune. Manque la flèche de comparaison cluster → outil (détection d'écart), non nécessaire mais utile à l'épreuve. |
| Flèches branche → pr « ouvre » ; pr → pipeline « déclenche » | diagramme | CONFIRMÉE | Cohérent avec GitLab et GitHub. | Aucune. |
| La pull request est dans la zone « Votre poste » | diagramme (zone poste) | DOUTEUSE | Une pull request est un objet de la forge (GitHub la décrit côté dépôt), pas du poste. | Déplacer le noeud « Pull request » dans la zone « Forge » (ou renommer la zone). |
| Zone « Forge (GitLab, GitHub) » | diagramme | CONFIRMÉE | Les deux sources citées sont GitHub et GitLab. Remarque : GitLab dit « merge request », pas « pull request ». | Mentionner « merge request » côté GitLab. |
| Avec selfHeal, l'agent ramène le cluster à l'état de git | epreuve.raisonnement | CONFIRMÉE | Argo CD : selfHeal désactivé par défaut ; activé, la dérive déclenche une synchronisation qui restaure l'état de Git. | Aucune. |
| Sans selfHeal, « il signale seulement l'écart » | epreuve.raisonnement | DOUTEUSE | La page ouverte dit seulement que les modifications directes du cluster ne déclenchent pas de synchronisation par défaut ; elle ne parle pas de signalement. En outre elle prévient d'un cas multi-sources où les changements peuvent persister. | Reformuler : « sans selfHeal, la modification manuelle n'est pas corrigée automatiquement ». N'ajouter « signale l'écart » qu'avec une page Argo ouverte sur l'état OutOfSync. |
| Même comportement pour Flux | epreuve.cas | NON SOURCÉE (aucune page Flux ouverte) | Rien dans les sources de la fiche. | Retirer « ou Flux » du cas, ou ajouter la documentation Flux après l'avoir ouverte. |
| « En GitOps git est la source de vérité » | epreuve.raisonnement | CONFIRMÉE (paraphrase) | OpenGitOps : l'état cible est déclaré et conservé dans un stockage versionné ; les agents le tirent et réconcilient. | Citer OpenGitOps dans `epreuve.source`. |
| « Toute évolution reste relue par un pair » ; « La traçabilité du qui, quoi, pourquoi reste exigée » ; « Un retour arrière reste à prévoir » | resteVrai.1 à 3 | NON SOURCÉES (opinion de métier) | Aucune source. | Étiqueter « avis d'auteur » (`avisAuteur.resteVrai.N`). |
| MOP, CAB, fenêtre de maintenance, exécution à la main | resume.avant, schema.avant, reflexe | NON SOURCÉE (description de « l'ancien monde ») | Aucune source. | Étiqueter « avis d'auteur » (`avisAuteur.resume`, `schema`, `reflexe`). Ne pas généraliser : tous les opérateurs ne fonctionnent pas ainsi. |
| Exemple : changement de configuration d'une fonction du cœur par pull request | exemple | NON SOURCÉE comme fait, plausible comme illustration | Aucune source ne parle de fonction du cœur. | Étiqueter « avis d'auteur » (`avisAuteur.exemple`) ; garder la formule conditionnelle. |

## Liens en échec

Aucun lien n'échoue. Codes obtenus avec curl et un user-agent navigateur (redirections suivies) :

- GitHub about-protected-branches : 200.
- GitLab https://docs.gitlab.com/ee/ci/ : 200 après 1 redirection vers https://docs.gitlab.com/ci/ (même sujet) ; mettre à jour l'URL dans `sources` et `plusLoin`.
- OpenGitOps : 200.
- Learn Git Branching (fr_FR) : 200.
- Argo CD auto_sync : 200.
- Quatre playlists YouTube : 200 après 2 redirections (bandeau de consentement). Titres vérifiés : « GITLAB : tutos et formation », « GitOps Guide to the Galaxy », « Argo CD: Basics to Production Course », « SREcon25 Americas ». Le contenu et le lien entre playlist et auteur déclaré (xavki, Red Hat, Cloud With VarJosh, USENIX) n'ont pas été vérifiés. La playlist SREcon25 est un lien large (conférences SRE) sans rapport direct avec le changement par pull request.

## Verdict sur l'épreuve

Partiellement soutenue.

- Première partie (vérifications obligatoires et branche protégée) : entièrement soutenue par la page GitHub citée.
- Deuxième partie : selfHeal est soutenu par la page Argo CD citée. L'affirmation « sans elle, il signale seulement l'écart » n'est pas soutenue telle quelle, et Flux n'a aucune source. La source de `epreuve.source` ne couvre pas non plus « git est la source de vérité » (OpenGitOps).
- Correction minimale : dans `cas`, ne garder que « Argo CD » ; dans `raisonnement`, remplacer « signale seulement l'écart » par « ne corrige pas automatiquement » ; ajouter OpenGitOps à `source`.
- Réalisme : oui, le cas est réaliste pour un architecte télécom (configuration de CNF sous Git, risque de modification manuelle en urgence). Il pose deux questions en une ; la formulation « fonction du cœur » reste vague mais acceptable.
