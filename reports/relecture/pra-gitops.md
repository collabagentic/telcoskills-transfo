# Relecture de la fiche pra-gitops

Résumé : 6 affirmations confirmées, 11 non sourcées, 2 douteuses (19 points contrôlés).
La fiche ne contient aucun champ `avisAuteur` : tout l'étiquetage reste à faire.
Source ouverte et lisible pour le RTO et le RPO trouvée (documentation AWS Well-Architected, voir plus bas).

## Ce qui a pu être lu

| Page | Lecture |
|---|---|
| opengitops.dev | Lue en entier : les 4 principes (déclaratif, versionné et immuable, tiré automatiquement, réconcilié en continu). Rien sur la reprise d'activité, les données, les secrets ni la dérive. |
| Argo CD, auto_sync | Lue : sync automatique, prune désactivé par défaut, self-heal désactivé par défaut (une modification manuelle ne déclenche rien tant que `selfHeal: true` n'est pas posé). |
| Kubernetes, sauvegarde d'etcd | Lue sur deux passes (la première était tronquée à 100 000 caractères, la section « Backing up » lue à part). Les secrets ne sont pas nommés sur cette page. |
| Kubernetes, page Secrets (ouverte en plus) | Début lu (100 000 premiers caractères sur 133 111) : les Secrets sont stockés non chiffrés par défaut dans etcd. |
| AWS Well-Architected, « Disaster Recovery (DR) objectives » (ouverte en plus) | Lue en entier. Bandeau : « whitepaper à titre historique », le guide à jour est le Well-Architected Framework. |

Je n'ai pas ouvert de page Flux, ni de page 3GPP sur l'AMF et la SMF.

## Tableau des affirmations

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| RTO = durée de reprise acceptable | resteVrai.0, epreuve.raisonnement | CONFIRMÉE | AWS : le RTO est le délai maximal acceptable entre l'interruption et la restauration du service. | Ajouter l'URL AWS (ci-dessous) à `sources` et dans `epreuve.source` à la place de « définitions usuelles ». |
| RPO = perte de données acceptable | resteVrai.0, epreuve.raisonnement | CONFIRMÉE, avec nuance | AWS : le RPO est le temps maximal écoulé depuis le dernier point de récupération, donc une perte exprimée en durée. | Écrire « la perte de données acceptable, exprimée en temps depuis la dernière copie ». « Quantité de données » est moins fidèle. |
| Git ne contient pas vos bases | resteVrai.1 | NON SOURCÉE | OpenGitOps ne parle pas des données. | Étiquetable « avis d'auteur » tel quel (déduction de ce qu'est un dépôt de déclarations). |
| Un PRA qu'on ne teste pas ne vaut rien | resteVrai.2 | NON SOURCÉE | Aucune des sources ouvertes ne le dit. | Étiqueter « avis d'auteur » tel quel (conseil, pas un fait). |
| Le dépôt décrit l'état voulu, un outil le réapplique | change.0, resume.apres | CONFIRMÉE | OpenGitOps (principes 1, 3, 4) : état déclaré, tiré et réconcilié en continu par un agent. | Rien. |
| Un outil GitOps « peut corriger la dérive » | change.0 | DOUTEUSE (trop général) | Argo CD : la correction automatique n'existe qu'avec `selfHeal: true`, désactivé par défaut. OpenGitOps ne décrit pas la dérive. | Reformuler : « un outil comme Argo CD peut, si l'auto-correction (self-heal) est activée, ramener le cluster à l'état du dépôt ». Source : page auto_sync. |
| Reconstruire un cluster = rejouer des manifestes | change.1 | NON SOURCÉE | Aucune source ne traite de la reconstruction d'un cluster. OpenGitOps ne parle pas de reprise. | Étiqueter « avis d'auteur », à condition d'adoucir : « peut se ramener pour l'essentiel à rejouer les manifestes ». |
| Une modification manuelle peut être écrasée | change.2 | CONFIRMÉE | Argo CD avec self-heal : la modification manuelle est annulée pour revenir à l'état de Git. | Préciser « avec l'auto-correction activée ». |
| « La procédure de reprise est un document que l'on déroule » | reflexe | NON SOURCÉE | Description de l'ancien monde. | Étiqueter « avis d'auteur » tel quel. |
| Dossier PRA « testé une fois par an » | resume.avant | NON SOURCÉE | Fréquence invérifiable. | Retirer « une fois par an » (généralisation invérifiable) ou la remplacer par « testées de temps en temps », et étiqueter le reste « avis d'auteur ». |
| « Aussi souvent qu'on veut » | resume.apres | NON SOURCÉE | Rien. | Étiqueter « avis d'auteur ». |
| Les manifestes ne reconstruisent ni les données ni les secrets | piege, epreuve.raisonnement | DOUTEUSE pour les secrets, NON SOURCÉE pour les données | Aucune source sur les données. Pour les secrets, tout dépend de la pratique : un secret chiffré versionné dans Git est bien rejoué. K8s : un Secret est stocké dans etcd, non chiffré par défaut. | Reformuler : « les manifestes ne contiennent pas les données ; les secrets doivent être traités à part (chiffrés dans le dépôt ou gérés hors du dépôt) ». Le conseil devient « avis d'auteur ». |
| Il faut des sauvegardes testées, par exemple d'etcd | piege, epreuve.raisonnement | CONFIRMÉE (sauvegarde d'etcd) | K8s : tous les objets sont dans etcd ; sauvegarder etcd est important pour reprendre un cluster après sinistre ; le snapshot contient tout l'état. Le mot « testées » n'y figure pas. | Garder « sauvegarde d'etcd ». « Testées » relève de l'avis d'auteur. |
| Il faut une gestion des secrets | piege | NON SOURCÉE | La page Secrets de Kubernetes (ouverte) recommande de chiffrer au repos et de limiter l'accès ; elle ne parle pas de reprise. | Étiqueter « avis d'auteur », ou ajouter https://kubernetes.io/docs/concepts/configuration/secret/ pour le chiffrement au repos. |
| Le RPO dépend de la réplication des données, pas de Git | piege, epreuve.raisonnement | NON SOURCÉE | Définition AWS du RPO (fréquence des points de récupération), mais rien sur la réplication ni sur Git. | Étiqueter « avis d'auteur » (déduction). |
| AMF et SMF : cluster recréé, dépôt réappliqué, données d'abonnés et de sessions restaurées depuis leur réplication | exemple, epreuve.cas | NON SOURCÉE | Aucune source n'est ouverte sur l'AMF et la SMF ni sur l'emplacement de l'état de session. | Étiqueter « avis d'auteur » (scénario illustratif) et ne pas affirmer où se trouve l'état d'abonné ou de session ; sinon ajouter une source 3GPP après l'avoir ouverte. |
| Flèches du diagramme : vous vers git (fusion), outil GitOps vers git (lit, pointillé), outil GitOps vers cluster (applique), sauvegardes vers cluster (restaure, pointillé) | diagramme.liens | CONFIRMÉE | Sens cohérent avec OpenGitOps (l'agent tire depuis la source, principe 3) et Argo CD (synchronise le cluster). La flèche « lit » va de l'outil vers Git, ce qui est le bon sens d'un tirage. | Rien. |
| Nœud « Sauvegardes : etcd, données, secrets » | diagramme.noeuds | NON SOURCÉE (hors etcd) | etcd confirmé par K8s ; « données » et « secrets » non. Les secrets font partie du snapshot etcd. | Garder, étiqueté « avis d'auteur » ; ou « etcd, données applicatives ». |
| Outil GitOps : « Argo CD, Flux » | diagramme.noeuds | CONFIRMÉE pour Argo CD, NON SOURCÉE pour Flux | Argo CD : confirmé. Flux : aucune page ouverte. | Garder Argo CD seul, ou ouvrir la documentation de Flux avant de la citer. |

## Source proposée pour le RTO et le RPO

AWS, « Disaster Recovery (DR) objectives » : https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html (ouverte, HTTP lisible, texte complet lu). Elle définit les deux notions et soutient `resteVrai.0` et l'épreuve. Réserve : la page est marquée « historique », la documentation à jour étant le Well-Architected Framework. Je n'ai pas ouvert de page Google SRE ni NIST sur ce sujet.

## Liens

Toutes les URL de `sources` et `plusLoin` répondent en 200. Seules les trois playlists YouTube redirigent (2 redirections, ajout de paramètres de consentement `cbrd` et `ucbcb`), vers la même playlist.

- Titres lus pour les trois playlists : Velero Demos and Deep Dives, GitOps Guide to the Galaxy, Argo CD: Basics to Production Course, conformes aux noms de la fiche.
- Auteur confirmé pour « Cloud With VarJosh » seulement. « VMware Cloud Native Apps » (Velero) et « Red Hat » (GitOps Guide to the Galaxy) non vérifiés.
- Aucun lien en échec.
- Remarque : la page Argo CD de `plusLoin` (documentation générale) répond 200 ; la page `auto_sync` de `sources` aussi.

## Épreuve

- Raisonnement soutenu par la source : en partie. Soutenus : sauvegarde d'etcd et définitions du RTO et du RPO (avec la source AWS à ajouter, car « définitions usuelles » n'est pas une source). Non soutenus : « Git reconstruit les applications, pas les données ni les secrets » (OpenGitOps ne dit rien sur ce point), « gestion des secrets » et « le RPO dépend de la réplication ». À étiqueter « avis d'auteur » ou à reformuler comme dans le tableau.
- `epreuve.source` cite OpenGitOps, qui ne contient rien sur la reprise : le lien ne soutient que « Git décrit l'état voulu ».
- Réalisme du cas : réaliste pour un architecte télécom (site de secours, AMF et SMF, objection « tout est dans Git »). Point à surveiller : il confond deux plans, reconstruction des applications (GitOps) et restauration des données, ce qui est justement l'objet de la question. Ne pas laisser croire que l'état de session de la SMF est « restauré depuis une réplication » sans source.

## Points les plus importants

1. Aucun champ `avisAuteur` n'existe dans la fiche : étiqueter resteVrai.1, resteVrai.2, change.1, reflexe, piege (volet conseil), exemple, resume.apres.
2. Remplacer « définitions usuelles du RTO et du RPO » par l'URL AWS et corriger le RPO (temps, pas quantité).
3. Reformuler « corrige la dérive » (self-heal désactivé par défaut) et « ni les données ni les secrets » (dépend de la pratique) ; retirer « une fois par an ».
