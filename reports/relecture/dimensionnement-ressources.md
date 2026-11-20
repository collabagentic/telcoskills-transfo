# Relecture : dimensionnement-ressources

## Résumé
- Confirmés : 11 affirmations (requests = placement, limites CPU/mémoire, conditions des CPU exclusifs, pool partagé, hugepages demandées explicitement, flèches du diagramme sauf une).
- Non sourcés : 7 (UPF et ses besoins, carte SR-IOV, « 1 Gio réservées », « 64 vCPU », reflexe « vCPU alloué = réservé », « surdimensionnement toléré par l'hyperviseur », resteVrai). Tous peuvent passer en « avis d'auteur » ou en exemple illustratif, sauf les besoins de l'UPF et SR-IOV, qui sont des faits à sourcer ou à adoucir.
- Douteux : 5 (« tue le conteneur » trop fort, « sans requests » imprécis, conditions des CPU exclusifs incomplètes, NUMA « se demande explicitement » et flèche CPU exclusifs/carte, plus une épreuve dont la source ne couvre pas la 3e partie).

Constat transversal : la fiche n'a AUCUN champ `avisAuteur`. Aucun passage d'opinion n'est donc étiqueté aujourd'hui ; les verdicts « avis d'auteur » ci-dessous supposent que ce champ soit ajouté.

## Pages lues
Ouvertes via WebFetch (résumé ; les 4 pages ont été tronquées après 100 000 caractères) puis relues en texte brut via curl (user-agent navigateur) pour les passages décisifs : gérer les ressources des conteneurs (limites, planification, hugepages), politiques de gestion du CPU (conditions de la politique static, pool partagé), hugepages (WebFetch seul), Topology Manager (rôle, scopes, politiques, prérequis CPU/Memory Manager).
Non lue : la page « Pod Quality of Service Classes » (jamais ouverte). La définition de Guaranteed (requests = limits, CPU et mémoire) vient de la page CPU et des exemples de la page Topology Manager. Pages `plusLoin` « drain » et playlist YouTube : seul le code HTTP a été vérifié, contenu non lu.

## Tableau

| Affirmation | Où (champ) | Verdict | Ce que dit la source | Correction proposée |
|---|---|---|---|---|
| Les requests servent à placer le pod sur un nœud | change.1, resume.apres, schema, diagramme sched, epreuve | CONFIRMÉE | Le kube-scheduler s'appuie sur les requests pour choisir le nœud (manage-resources). | Aucune. |
| Le scheduler place le pod sur un nœud qui dispose « au moins des requests » | epreuve.raisonnement | CONFIRMÉE | Le scheduler veille à ce que la somme des requests des conteneurs placés reste inférieure à la capacité du nœud. | Préciser « somme des requests déjà placées + celle du pod » si l'on veut être exact. |
| Les limits sont appliquées à l'exécution (plafond) | change.1, resume, schema | CONFIRMÉE | Le kubelet applique les limites ; le conteneur ne doit pas les dépasser. | Aucune. |
| Une limite CPU « ralentit » le conteneur | piege, epreuve | CONFIRMÉE | Limite CPU appliquée par throttling : accès au CPU restreint, conteneur non tué. | Aucune. |
| Une limite mémoire dépassée « tue le conteneur » | piege, epreuve.raisonnement | DOUTEUSE | Appliquée par OOM kill du noyau, de façon réactive : le noyau « peut » tuer, seulement sous pression mémoire ; un conteneur peut dépasser sans être tué tout de suite. | « Un conteneur qui dépasse sa limite mémoire s'expose à être tué par le noyau (OOM kill), quand la mémoire du nœud est sous pression ; une limite CPU, elle, ralentit le conteneur sans le tuer. » Même correction dans l'épreuve. |
| « Sans requests, le placement ne tient pas compte de vos besoins » | piege | DOUTEUSE | Avec une limite mais sans request, Kubernetes copie la limite comme request. Seul un conteneur sans request ni limit pèse zéro pour le scheduler. | « Sans requests ni limits, le scheduler ne compte rien pour ce conteneur ; avec une limite seule, la request en est copiée. » |
| Pod à requests = limits, CPU entiers : CPU exclusifs, politique static | change.2 | DOUTEUSE (incomplet) | Seuls les conteneurs d'un pod Guaranteed avec requests CPU entières reçoivent des CPU exclusifs ; la politique static du kubelet doit être activée, avec une réservation CPU > 0. Guaranteed vaut pour CPU ET mémoire. | « Avec la politique static du CPU Manager, un conteneur d'un pod Guaranteed (requests = limits pour CPU et mémoire) qui demande un nombre entier de CPU reçoit des CPU exclusifs. » |
| CPU exclusifs : « QoS Guaranteed, CPU entiers » | schema.apres | CONFIRMÉE | Idem. | Optionnel : ajouter « static » dans le détail. |
| Pod d'outils Burstable dans le pool partagé (« CPU restants ») | diagramme outils, partage | CONFIRMÉE | Les pods BestEffort et Burstable tournent dans le pool partagé (CPU hors réservés et hors exclusifs). | Aucune. |
| Pod UPF requests = limits → CPU exclusifs (flèche upf→excl « obtient ») | diagramme | CONFIRMÉE | Voir condition ci-dessus (sous réserve de CPU entiers). | Ajouter « CPU entiers » au détail du nœud UPF. |
| Les hugepages se demandent explicitement | change.3, exemple | CONFIRMÉE | Ressource `hugepages-<taille>` dans requests/limits, requests = limits, pas de surallocation ; pré-allocation sur le nœud. | Optionnel : ajouter ces faits. |
| L'alignement NUMA (Topology Manager) « se demande explicitement » | change.3 | DOUTEUSE | Le Topology Manager est un composant du kubelet réglé par politique (none, best-effort, restricted, single-numa-node), pas une demande du pod. Il aligne les ressources pour lesquelles un Hint Provider fournit des hints (CPU, Device, Memory Manager) ; pour aligner mémoire et hugepages, le Memory Manager doit être activé ; il traite les pods de toutes les classes QoS. | « L'alignement NUMA est une politique du kubelet (Topology Manager), qui s'appuie sur le CPU Manager, le Memory Manager et le Device Manager ; elle se configure sur le nœud. » |
| Carte réseau (SR-IOV) sur le même NUMA que les CPU | exemple, diagramme nic, epreuve | NON SOURCÉE | Les pages lues parlent de « devices » et de ressources alignées sur un même nœud NUMA ; carte réseau et SR-IOV ne figurent pas dans le texte lu. | Reformuler en « périphériques » et sourcer, ou étiqueter l'exemple « avis d'auteur ». Ne pas écrire SR-IOV sans source ouverte. |
| Flèche excl ↔ nic « NUMA » (pointillé, double sens) | diagramme | DOUTEUSE | Ce n'est pas le CPU exclusif qui s'aligne avec la carte : le Topology Manager coordonne CPU et devices. | Ajouter un nœud « Topology Manager » ou renommer le lien « alignés par le Topology Manager ». |
| Flèche upf→hp « mémoire » | diagramme | CONFIRMÉE | Les hugepages se demandent dans la spec du conteneur. | Aucune. |
| Flèches sched→outils/upf « place », outils→partage « utilise » | diagramme | CONFIRMÉE | Sens cohérents avec les sources. | Aucune. |
| Hugepages « 1 Gio réservées » | diagramme hp | NON SOURCÉE | 1Gi est une taille possible et 2 × 1 GiB un exemple de pré-allocation ; « réservées » n'est pas le terme de la source (pré-allouées par le nœud, demandées par le pod). | « Hugepages (ex. 1 Gio), pré-allouées sur le nœud » ou retirer le chiffre ; marquer illustratif. |
| « Nœud de calcul (64 vCPU) » | diagramme zone | NON SOURCÉE | Valeur d'exemple. | Marquer « exemple » dans la légende ou retirer le chiffre. |
| Un UPF demande des CPU entiers, des hugepages, NUMA | exemple, epreuve | NON SOURCÉE | Aucune page lue ne parle de l'UPF ; elles décrivent seulement les mécanismes. | Étiqueter « avis d'auteur » ou reformuler : « une fonction de plan usager exigeante peut demander… ». Ne pas l'énoncer comme une exigence établie de l'UPF. |
| Fonctions de plan usager sensibles à la latence et au débit | resteVrai.2 | NON SOURCÉE | Hors des pages lues. | « Avis d'auteur » : acceptable tel quel. |
| Dimensionner reste un travail de charge réelle et de marge ; ressources du nœud finies | resteVrai.1, .3 | NON SOURCÉE | Opinion générale ; la finitude est cohérente avec capacité/allocatable. | « Avis d'auteur » : acceptable tel quel. |
| « Un vCPU alloué est un vCPU réservé » | reflexe | NON SOURCÉE | Croyance de l'ancien monde ; sur Kubernetes, un conteneur peut consommer plus que sa request si le nœud a de la ressource. | « Avis d'auteur » ; le présenter comme croyance, pas comme fait. |
| VM : vCPU/RAM alloués, « surdimensionnement toléré par l'hyperviseur » | resume.avant, schema.avant | NON SOURCÉE | Aucune source sur l'hyperviseur. | « Avis d'auteur », ou ajouter une source hyperviseur réellement ouverte. |

## Liens (curl, user-agent navigateur, redirections suivies)
Les 6 URL répondent 200 : manage-resources-containers, cpu-management-policies, scheduling-hugepages, topology-manager, safely-drain-node, playlist YouTube. Seule la playlist ajoute des paramètres de consentement (`cbrd`, `ucbcb`) : même playlist, pas de page sans rapport. Aucun lien en échec. Contenu de la playlist et de la page drain non lu ; la playlist k6 relève du test de charge et la page drain n'est pas liée au dimensionnement : pertinence à juger par l'auteur.

## Épreuve
- Les deux premiers points (rôle de la request, limite mémoire dépassée) sont soutenus par la source citée, avec la réserve : « tue » doit devenir « peut tuer ».
- Le troisième point (CPU entiers, hugepages, NUMA, UPF) n'est PAS soutenu par la source citée (`manage-resources-containers`). Les pages cpu-management-policies, scheduling-hugepages et topology-manager le soutiennent pour les mécanismes ; ajouter-les à `epreuve.source`, ou limiter la question aux deux premiers points. Les besoins de l'UPF restent hors source.
- Réalisme : cas crédible pour un architecte télécom (UPF, plan usager), mais « que demande-t-il de plus » porte sur l'UPF et non sur Kubernetes ; à reformuler en « quels réglages Kubernetes pour ce type de charge ».
- Verdict : à corriger avant publication.

## Constats secondaires
- Champ `avisAuteur` absent : l'ajouter (resteVrai, resteVrai.1-3, reflexe, exemple, resume.avant, schema.avant).
- La source du diagramme ne cite que la page manage-resources ; il en faut au moins quatre (pool partagé, hugepages, Topology Manager).
