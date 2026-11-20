# Relecture sourcée, lot A1 (catégorie « comprendre », première moitié)

Fiches : `reconciliation`, `vm-pod`, `actif-passif-replicas`, `operateurs`. Chaque fiche a son rapport détaillé dans ce dossier. Rien n'a été modifié dans `content/` : les corrections ci-dessous sont **proposées**, à trancher par l'auteur.

## Bilan chiffré

| Fiche | Points examinés | Confirmés | Non sourcés | Douteux | Liens en échec |
| --- | --- | --- | --- | --- | --- |
| reconciliation | 15 | 5 | 7 | 3 | 0 |
| vm-pod | 21 | 11 | 7 | 3 | 0 |
| actif-passif-replicas | 13 | 5 | 6 | 2 | 0 |
| operateurs | 22 | 11 | 6 | 5 | 0 |
| **Total** | **71** | **32 (45 %)** | **26 (37 %)** | **13 (18 %)** | **0** |

Réserves : les pages Kubernetes n'ont été lues que sur leurs 100 000 premiers caractères ; le contenu des playlists YouTube et du cours Linux Foundation n'est pas vérifié (un code 200 ne prouve pas qu'elles existent encore). J'ai recontrôlé moi-même deux sources ajoutées par les agents (page ReplicaSet : maintient un nombre stable de pods ; page OLM : la Subscription suit un canal pour garder les CSV à jour) : elles disent bien ce que les rapports affirment.

## Ce que montre le lot

1. **Le cœur technique tient, les habillages non.** Les mécanismes Kubernetes sont confirmés ; ce qui n'est pas sourcé, ce sont les phrases sur « le monde d'avant » (VM patchée, actif/passif, appliance de l'équipementier) et les conseils de bonne pratique.
2. **Quatre sources manquent à la liste** (toutes ouvertes, répondent 200) : ReplicaSet, Deployment, OLM architecture (déjà citée dans l'épreuve mais absente de `sources`), et la page Deployments exacte pour `vm-pod`.
3. **Deux erreurs de diagramme à corriger quoi qu'il arrive** : dans `operateurs`, « Catalogue choisit Subscription » est inversé (la Subscription référence le catalogue) ; dans `vm-pod`, « Registre tire Deployment » est faux (c'est le kubelet du nœud qui tire l'image).
4. **Des affirmations plus fortes que leur source** : « seul à lire et écrire dans etcd », « jamais sur l'objet qu'un contrôleur gère », « les pods sont jamais réparés », « aucun équivalent dans votre métier » (qui contredit la fiche elle-même).

## Corrections proposées, par ordre de priorité

**À corriger avant toute relecture (faux ou inversé)**
- `operateurs` : inverser le lien du diagramme en « Subscription — pointe vers → Catalogue » ; « InstallPlan installe » devient « fait créer » avec le détail « ressources à créer (approbation selon la stratégie) ».
- `vm-pod` : remplacer « Registre tire Deployment » par un lien dont le sujet est le nœud (kubelet) ; remplacer « jamais réparés » par « remplacés plutôt que réparés ».
- `reconciliation` : restreindre « une correction manuelle est effacée » aux objets dérivés (pod, ReplicaSet) ; la dernière question de l'épreuve n'a sinon pas de réponse sourcée.

**À sourcer (ajouter une source déjà ouverte)**
- `reconciliation` : ajouter ReplicaSet et Deployment à `sources` et à `epreuve.source`, plus la page des composants pour le scheduler.
- `operateurs` : ajouter la page OLM architecture à `sources`.
- `vm-pod` : adresse exacte de Deployments (kubernetes.io/docs/concepts/workloads/controllers/deployment/) dans `epreuve.source` ; ajouter le Service headless à l'explication du DNS par pod.

**À retirer ou à présenter comme avis de l'auteur (jugements non sourcés)**
- `operateurs` : « un équipementier reste responsable », « les équipementiers livraient une appliance », « lisez ce qu'il demande avant de l'installer », « sur OpenShift ».
- `reconciliation` : « aucun équivalent direct dans votre métier », « un composant qui tombe doit toujours être remplacé », « l'équipe n'est alertée que si la reconstitution échoue ».
- `actif-passif-replicas` : la phrase « réglez les sondes sur le comportement réel de l'application » (aucune source) : la page des sondes parle plutôt d'`initialDelaySeconds` et de `startupProbe`. L'effet « tous les pods retirés, plus de destination » est une déduction logique, à marquer comme telle. Rien dans les trois sources ne couvre l'actif/passif lui-même : sourcer ou retirer.
- `vm-pod` : le frontal HTTP/2 « sans état local » (exemple et cas) est une hypothèse, à sourcer via 3GPP ou à présenter comme exemple.

**Décisions qui vous reviennent**
1. Les phrases du « monde d'avant » : les retirer (fiche plus courte, entièrement sourcée) ou les garder comme **avis d'auteur** étiqueté ? C'est le cœur du ton « votre X, version Y » ; je recommande de les garder, étiquetées, car elles portent la pédagogie de transposition.
2. Les conseils de bonne pratique (« lisez ce qu'il demande ») : même question.
3. Faut-il imposer à toutes les fiches un champ distinguant « fait sourcé » et « avis d'auteur » ? Ce serait la réponse structurelle, mais cela change le schéma.

## Suite

Appliquer les corrections que vous validez, passer les fiches en « relu » dans le JSON, puis lot A2 (`lb-services`, `vlan-reseaux-cluster`, `matrice-networkpolicy`, `acces-rbac`).

## Corrections appliquées (2026-11-20), après la décision de l'auteur

Décision : garder les phrases du « monde d'avant » et les conseils, **étiquetés « avis d'auteur »**. Nouveau champ `avisAuteur` dans les fiches (règle de build 16 : les passages désignés existent), étiquette visible sur le site, compte dans l'audit.

- `reconciliation` : sources ReplicaSet et Deployment ajoutées, « seul à lire et écrire dans etcd » et « jamais sur l'objet… » restreints, alerte non sourcée retirée de l'exemple, question finale de l'épreuve rendue sourçable (où modifier le nombre voulu). Avis : `resteVrai`, `pourquoiNouveau`.
- `vm-pod` : lien du diagramme « Registre tire Deployment » remplacé par « Deployment cite l'image du registre », « jamais réparés » nuancé, CPU et mémoire dits facultatifs, Service headless et adresse Deployments ajoutés à l'épreuve. Avis : `resteVrai.0`, `resteVrai.2`, `change.2`, `exemple`.
- `actif-passif-replicas` : conseil sur les sondes reformulé d'après la page (initialDelaySeconds, startupProbe), déduction « plus de destination » signalée comme telle, « heartbeat » retiré, « garde ≥ 2 » remplacé par « protège ». Avis : `resteVrai.0`, `resteVrai.2`, `change.0`, `piege`.
- `operateurs` : lien inversé corrigé (Subscription cible le catalogue), « InstallPlan fait créer », mention d'OpenShift retirée, « réparer » remplacé, source OLM architecture ajoutée. Avis : `resteVrai.1`, `pourquoiNouveau`, `piege`.

Restent ouverts : aucune source ne couvre l'actif/passif (`actif-passif-replicas`), le frontal HTTP/2 « sans état » reste une hypothèse étiquetée (`vm-pod`), et la relecture par l'auteur des quatre fiches (« relu » n'est posé que par lui). Le texte « avant » du résumé de `vm-pod` n'est pas étiqueté (le champ `resume` n'est pas désignable) : il décrit une pratique, pas un fait Kubernetes.
