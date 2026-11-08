// Génère le contenu initial (brouillon) : métier « infra et virtualisation », 9 fiches, technos.
// Exécuté une fois, conservé pour traçabilité. Usage : node scripts/reprise/contenu-initial.mjs
// Les questions viennent de scripts/reprise/questions.mjs (reprise de l'ancien dépôt).
import fs from "node:fs";
import path from "node:path";

const R = path.join(import.meta.dirname, "..", "..", "content") + path.sep;
const K8S = "https://kubernetes.io/docs/";
const hist = [{ date: "2026-11-08", changement: "Première version, brouillon assisté par IA, à relire par l'auteur.", par: "Brouillon assisté par IA", lien: null }];
const base = { statut: "brouillon", misAJour: "2026-11-08", historique: hist };
const F = [];
const add = (f) => F.push({ ...base, ...f });
const doc = (nom, url, langue = "en") => ({ type: "doc", nom, url, langue, acces: "gratuit" });

add({
  id: "vlan-reseaux-cluster", genre: "transposition", avant: "découpage en VLAN", apres: "réseaux du cluster",
  resume: { avant: "Un VLAN par usage, tagué sur le portgroup de chaque VM. L'isolation passe par le découpage en sous-réseaux.", apres: "Un réseau plat pour les pods, isolé par des règles. Les VLAN reviennent sur les réseaux secondaires (Multus, SR-IOV)." },
  resteVrai: ["Séparer signalisation, données et administration reste une exigence d'architecture.", "Le VLAN et la MTU existent toujours, sur les réseaux secondaires qui portent le plan data.", "Chaque interface demande toujours un plan d'adressage."],
  change: ["Le réseau primaire des pods est plat : l'isolation passe par des NetworkPolicy qui raisonnent en labels, pas en sous-réseaux.", "Les réseaux additionnels (Multus) portent le plan data ; VLAN, MTU et VF SR-IOV se déclarent via NMState.", "L'adressage des interfaces secondaires est géré à part de celui des pods."],
  reflexe: "Isoler, c'est mettre dans un autre sous-réseau.", pourquoiNouveau: null,
  piege: "Appliquer le bon réflexe au mauvais plan. Sur le réseau primaire des pods, découper en sous-réseaux n'isole rien : l'IP d'un pod est éphémère. L'erreur inverse, côté profil cloud-natif, consiste à ignorer les réseaux secondaires, là où le VLAN reste légitime.",
  exemple: "Dans un cœur 5G déployé en CNF, la signalisation reste sur le réseau primaire du cluster. Le trafic utilisateur d'une fonction UPF passe par une interface secondaire attachée en SR-IOV, avec son VLAN et sa MTU.",
  technos: ["kubernetes", "ovn-kubernetes", "multus"], questions: ["q-vlan-reseaux-cluster-1", "q-vlan-reseaux-cluster-2"],
  plusLoin: [{ type: "opensource", nom: "Multus CNI (dépôt et documentation)", url: "https://github.com/k8snetworkplumbingwg/multus-cni", langue: "en", acces: "gratuit" }, doc("Red Hat, OpenShift 4.20 : référence de conception telco core", "https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/scalability_and_performance/telco-core-ref-design-specs")],
  sources: [{ nom: "Red Hat, OpenShift 4.20 : telco core reference design", url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/scalability_and_performance/telco-core-ref-design-specs" }, { nom: "VMware Telco Cloud Platform 2.7, guide d'architecture", url: "https://docs.vmware.com/en/VMware-Telco-Cloud-Platform/2.7/telco-cloud-platform-5G-edition-reference-architecture-guide-27/GUID-81109C7A-A6F9-4FEA-A9F3-443D919BF19A.html" }, { nom: "Tigera : Kubernetes n'a pas de notion native de segment L2 ni de VLAN", url: "https://www.tigera.io/?p=69568" }],
});
add({
  id: "matrice-networkpolicy", genre: "transposition", avant: "matrice de flux", apres: "NetworkPolicy",
  resume: { avant: "Une ligne = IP source, IP destination, port. Validée par le pare-feu, appliquée par une équipe réseau.", apres: "Une règle = des labels, un namespace, un port. Versionnée dans Git, appliquée par le cluster." },
  resteVrai: ["Le moindre privilège sur les flux est inchangé.", "Une matrice de flux explicite reste la référence à documenter et à relire.", "Le port et le protocole comptent toujours (TCP, UDP, SCTP)."],
  change: ["Sans NetworkPolicy, les pods acceptent tout trafic entrant : le défaut est ouvert.", "Une règle désigne des pods par labels et namespaces, plus par adresses IP, car l'IP d'un pod est éphémère.", "Le « default deny » se pose en premier : une policy qui sélectionne tous les pods et n'autorise rien en entrée."],
  reflexe: "Une IP identifie une machine.", pourquoiNouveau: null,
  piege: "Une NetworkPolicy peut être acceptée sans effet : si le plugin réseau du cluster ne gère pas les NetworkPolicy, rien n'est filtré. Autre piège classique : une règle ingress contenant un élément vide ({}) autorise tout le trafic au lieu de tout refuser.",
  exemple: "Pour l'AMF d'un cœur 5G, la règle sélectionne les pods de l'AMF par label et n'ouvre en entrée que le port 38412 en SCTP, le port de la signalisation NGAP (interface N2).",
  technos: ["kubernetes", "ovn-kubernetes"], questions: ["q-matrice-networkpolicy-1", "q-matrice-networkpolicy-2"],
  plusLoin: [doc("Kubernetes : Network Policies", K8S + "concepts/services-networking/network-policies/"), doc("Kubernetes : tutoriel de déclaration d'une NetworkPolicy", K8S + "tasks/administer-cluster/declare-network-policy/")],
  sources: [{ nom: "Kubernetes : Network Policies", url: K8S + "concepts/services-networking/network-policies/" }, { nom: "3GPP TS 38.412 : transport de signalisation NG (SCTP, port 38412)", url: "https://www.3gpp.org/ftp/Specs/archive/38_series/38.412/" }],
});
add({
  id: "pra-gitops", genre: "transposition", avant: "dossier PRA", apres: "GitOps",
  resume: { avant: "Un dossier avec RTO et RPO, des procédures de reprise rédigées, testées une fois par an.", apres: "L'état voulu du cluster est dans Git. Reconstruire, c'est réappliquer ce dépôt, aussi souvent qu'on veut." },
  resteVrai: ["Le RTO mesure le temps de reprise acceptable, le RPO la perte de données acceptable.", "Les données persistantes restent à répliquer et à sauvegarder : Git ne contient pas vos bases.", "Un PRA qu'on ne teste pas ne vaut rien."],
  change: ["Le dépôt Git décrit l'état voulu ; un outil GitOps le réapplique et peut corriger la dérive.", "Reconstruire un cluster, c'est rejouer des manifestes, pas dérouler une procédure à la main.", "Une modification faite à la main dans le cluster peut être écrasée par ce que dit le dépôt."],
  reflexe: "La procédure de reprise est un document que l'on déroule.", pourquoiNouveau: null,
  piege: "Croire que Git suffit. Les manifestes reconstruisent les applications, pas les données ni les secrets : il faut toujours des sauvegardes testées (par exemple de la base etcd) et une gestion des secrets. Le RPO dépend de la réplication des données, pas de Git.",
  exemple: "Un site de secours doit accueillir des fonctions du cœur (AMF, SMF) : le cluster est recréé, le dépôt est réappliqué, puis les données d'abonnés et de sessions sont restaurées depuis leur réplication.",
  technos: ["kubernetes", "argo-cd"], questions: ["q-pra-gitops-1", "q-pra-gitops-2"],
  plusLoin: [doc("OpenGitOps : les principes", "https://opengitops.dev/"), doc("Argo CD : documentation", "https://argo-cd.readthedocs.io/en/stable/")],
  sources: [{ nom: "OpenGitOps : principes", url: "https://opengitops.dev/" }, { nom: "Argo CD : synchronisation automatique et self-heal", url: "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/" }, { nom: "Kubernetes : sauvegarde d'etcd", url: K8S + "tasks/administer-cluster/configure-upgrade-etcd/" }],
});
add({
  id: "changement-pr", genre: "transposition", avant: "procédure de changement", apres: "pull request et pipeline",
  resume: { avant: "Une demande de changement (MOP, CAB), une fenêtre de maintenance, une exécution à la main.", apres: "Une pull request relue, des vérifications automatiques, une fusion qui déclenche le déploiement." },
  resteVrai: ["Toute évolution reste relue par un pair avant de toucher la production.", "La traçabilité du qui, quoi, pourquoi reste exigée.", "Un retour arrière reste à prévoir."],
  change: ["La relecture porte sur un diff de fichiers dans une pull request, pas sur un document.", "Des vérifications automatiques tournent dans un pipeline avant la fusion.", "La fusion déclenche le déploiement : l'historique Git est la trace du changement."],
  reflexe: "Le changement s'exécute à la main, dans une fenêtre.", pourquoiNouveau: null,
  piege: "Une pull request ne protège que si les vérifications sont obligatoires avant fusion et si la branche principale est protégée. Sans cela, elle devient une formalité et le pipeline un simple outil de livraison.",
  exemple: "Le changement de configuration d'une fonction du cœur passe par une pull request sur le dépôt de la plateforme : le pipeline valide les fichiers, un relecteur approuve, puis la plateforme applique la fusion.",
  technos: ["argo-cd"], questions: ["q-changement-pr-1", "q-changement-pr-2"],
  plusLoin: [doc("GitLab CI/CD : documentation", "https://docs.gitlab.com/ee/ci/"), doc("OpenGitOps : les principes", "https://opengitops.dev/")],
  sources: [{ nom: "GitHub : à propos des branches protégées", url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" }, { nom: "GitLab CI/CD", url: "https://docs.gitlab.com/ee/ci/" }, { nom: "OpenGitOps : principes", url: "https://opengitops.dev/" }],
});
add({
  id: "vm-pod", genre: "transposition", avant: "VM et template", apres: "pod et déploiement",
  resume: { avant: "Une VM créée depuis un template, patchée sur place, qui garde son identité pendant des années.", apres: "Un pod est jetable. Un déploiement en maintient N, remplacés par de nouveaux quand l'image change." },
  resteVrai: ["Un point de départ reproductible (le template) a son équivalent : l'image.", "Dimensionner reste nécessaire : CPU et mémoire se demandent explicitement.", "Chaque service a un cycle de vie à piloter."],
  change: ["Un pod est éphémère : il n'est pas réparé, il est remplacé.", "Un Deployment maintient le nombre voulu de pods identiques et remplace progressivement les anciens.", "On ne se connecte pas pour corriger : on change l'image ou la configuration, puis on redéploie."],
  reflexe: "Corriger en SSH sur la machine.", pourquoiNouveau: null,
  piege: "Mettre une application à état dans un Deployment. Une base répliquée, qui demande à chaque réplica un nom réseau stable et son propre volume, relève d'un StatefulSet.",
  exemple: "Un frontal HTTP/2 d'interface SBI, sans état local, se déploie en plusieurs pods identiques ; si l'un tombe, un autre est créé à sa place.",
  technos: ["kubernetes"], questions: ["q-vm-pod-1", "q-vm-pod-2"],
  plusLoin: [doc("Kubernetes : Pods", K8S + "concepts/workloads/pods/"), doc("Kubernetes : Deployments", K8S + "concepts/workloads/controllers/deployment/")],
  sources: [{ nom: "Kubernetes : Pods", url: K8S + "concepts/workloads/pods/" }, { nom: "Kubernetes : Deployments", url: K8S + "concepts/workloads/controllers/deployment/" }, { nom: "Kubernetes : StatefulSets", url: K8S + "concepts/workloads/controllers/statefulset/" }],
});
add({
  id: "actif-passif-replicas", genre: "transposition", avant: "haute disponibilité actif/passif", apres: "réplicas et sondes",
  resume: { avant: "Un nœud actif, un nœud passif en attente, une bascule déclenchée par un cluster ou un opérateur.", apres: "Plusieurs réplicas servent en même temps. Des sondes décident qui reçoit du trafic ; Kubernetes remplace ce qui tombe." },
  resteVrai: ["Éliminer les points de défaillance uniques reste le but de la conception.", "Un quorum se calcule comme avant : 5 membres etcd supportent la perte de 2.", "Une bascule non testée n'existe pas."],
  change: ["On vise plusieurs réplicas actifs plutôt qu'un actif et un passif en attente.", "La sonde de readiness retire un pod du trafic sans le tuer ; la liveness le redémarre.", "Un PodDisruptionBudget limite le nombre de pods indisponibles pendant une opération planifiée."],
  reflexe: "Le passif attend, et on bascule à la main.", pourquoiNouveau: null,
  piege: "Une sonde de readiness mal réglée peut retirer tous les pods du trafic en même temps : le service se retrouve sans destination. Réglez les sondes sur le comportement réel de l'application.",
  exemple: "Les instances d'une fonction du cœur 5G sont répliquées ; un pod dont la sonde de readiness échoue cesse de recevoir du trafic le temps de se rétablir.",
  technos: ["kubernetes"], questions: ["q-actif-passif-replicas-1", "q-actif-passif-replicas-2"],
  plusLoin: [doc("Kubernetes : sondes liveness, readiness et startup", K8S + "tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"), doc("Kubernetes : perturbations et PodDisruptionBudget", K8S + "concepts/workloads/pods/disruptions/")],
  sources: [{ nom: "Kubernetes : sondes liveness, readiness, startup", url: K8S + "tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" }, { nom: "Kubernetes : perturbations (PodDisruptionBudget)", url: K8S + "concepts/workloads/pods/disruptions/" }, { nom: "etcd : FAQ, tolérance aux pannes", url: "https://etcd.io/docs/v3.5/faq/" }],
});
add({
  id: "acces-rbac", genre: "transposition", avant: "gestion des comptes et accès root", apres: "RBAC et comptes de service",
  resume: { avant: "Des comptes nominatifs, du sudo, un accès root partagé pour les urgences.", apres: "Des rôles qui listent ce qu'on peut faire, liés à des personnes ou des applications, dans un périmètre." },
  resteVrai: ["Le moindre privilège et la séparation des rôles restent la règle.", "Les accès se revoient régulièrement.", "Un accès d'urgence doit rester tracé."],
  change: ["Rien n'est autorisé par défaut : une requête sans règle RBAC qui la couvre est refusée.", "Un Role vaut dans un namespace ; un ClusterRole peut valoir pour tout le cluster.", "Un RoleBinding qui référence un ClusterRole n'accorde ses droits que dans son propre namespace."],
  reflexe: "Un accès root partagé règle les urgences.", pourquoiNouveau: null,
  piege: "Lier un ClusterRole avec un ClusterRoleBinding alors qu'on voulait un seul namespace : les droits s'appliquent alors à tout le cluster.",
  exemple: "Un exploitant du cœur 5G reçoit un rôle de lecture sur le namespace de l'UPF ; l'outil de supervision a son propre compte de service, limité à la lecture des métriques.",
  technos: ["kubernetes"], questions: ["q-acces-rbac-1", "q-acces-rbac-2"],
  plusLoin: [doc("Kubernetes : contrôle d'accès RBAC", K8S + "reference/access-authn-authz/rbac/"), doc("Kubernetes : comptes de service", K8S + "concepts/security/service-accounts/")],
  sources: [{ nom: "Kubernetes : contrôle d'accès RBAC", url: K8S + "reference/access-authn-authz/rbac/" }, { nom: "Kubernetes : comptes de service", url: K8S + "concepts/security/service-accounts/" }],
});
add({
  id: "reconciliation", genre: "nouveaute", avant: null, apres: "L'état désiré et la boucle de réconciliation",
  resume: { avant: null, apres: "Vous déclarez l'état voulu. Des contrôleurs comparent en permanence avec l'état réel et agissent pour s'en rapprocher." },
  resteVrai: ["Vous savez déjà décrire une cible et mesurer l'écart avec la réalité : c'est le métier de la supervision.", "Un composant qui tombe doit toujours être remplacé : seul l'acteur change."],
  change: ["Un Deployment qui déclare 3 réplicas alors qu'il en reste 2 voit le troisième recréé sans intervention.", "Les contrôleurs passent par le serveur d'API, seul à lire et écrire dans etcd.", "L'état voulu se modifie dans la déclaration, jamais sur l'objet qu'un contrôleur gère."],
  reflexe: null,
  pourquoiNouveau: "Dans une infrastructure classique, rien ne remet seul une machine dans l'état voulu : une alerte, puis un humain ou un script. Kubernetes fait de cette comparaison permanente son mécanisme central. Aucun équivalent direct dans votre métier d'origine.",
  piege: "Corriger à la main ce qu'un contrôleur gère : il remet l'état déclaré et efface la correction. Le bon geste est de modifier la déclaration.",
  exemple: "Si un pod de l'AMF disparaît, le contrôleur du Deployment en recrée un pour retrouver le nombre voulu ; l'équipe n'est alertée que si la reconstitution échoue.",
  technos: ["kubernetes"], questions: ["q-reconciliation-1", "q-reconciliation-2"],
  plusLoin: [doc("Kubernetes : contrôleurs", K8S + "concepts/architecture/controller/"), doc("Kubernetes : composants", K8S + "concepts/overview/components/")],
  sources: [{ nom: "Kubernetes : contrôleurs", url: K8S + "concepts/architecture/controller/" }, { nom: "Kubernetes : composants d'un cluster", url: K8S + "concepts/overview/components/" }],
});
add({
  id: "operateurs", genre: "nouveaute", avant: null, apres: "Les opérateurs et les ressources personnalisées",
  resume: { avant: null, apres: "La connaissance d'exploitation d'un logiciel (installer, mettre à jour, réparer) s'écrit dans un contrôleur qui tourne dans le cluster." },
  resteVrai: ["Les runbooks d'exploitation existent toujours : ils deviennent du code.", "Un équipementier reste responsable de la qualité de ce qu'il livre."],
  change: ["Une ressource personnalisée (CRD) ajoute à l'API un type d'objet propre à une application.", "Un opérateur est un contrôleur qui réconcilie ces objets et automatise des tâches d'exploitation.", "Sur OpenShift, OLM installe et met à jour les opérateurs : la Subscription exprime le canal suivi, l'InstallPlan porte les changements."],
  reflexe: null,
  pourquoiNouveau: "Les équipementiers livraient une appliance et une procédure d'exploitation. Kubernetes permet de livrer à la place un contrôleur qui applique cette procédure, avec la même boucle de réconciliation que le reste du cluster.",
  piege: "Traiter un opérateur comme une boîte noire. Il agit sur le cluster avec ses propres droits RBAC : lisez ce qu'il demande avant de l'installer.",
  exemple: "Un éditeur de cœur 5G livre un opérateur : vous créez un objet qui décrit la version et le nombre d'instances, et l'opérateur déploie et met à jour les pods.",
  technos: ["kubernetes", "olm"], questions: ["q-operateurs-1", "q-operateurs-2"],
  plusLoin: [doc("Kubernetes : le motif Operator", K8S + "concepts/extend-kubernetes/operator/"), doc("Operator Lifecycle Manager : documentation", "https://olm.operatorframework.io/docs/")],
  sources: [{ nom: "Kubernetes : le motif Operator", url: K8S + "concepts/extend-kubernetes/operator/" }, { nom: "Kubernetes : ressources personnalisées", url: K8S + "concepts/extend-kubernetes/api-extension/custom-resources/" }, { nom: "Operator Lifecycle Manager", url: "https://olm.operatorframework.io/docs/" }, { nom: "Kubernetes : contrôle d'accès RBAC", url: K8S + "reference/access-authn-authz/rbac/" }],
});

fs.mkdirSync(R + "fiches", { recursive: true });
fs.mkdirSync(R + "metiers", { recursive: true });
for (const f of F) fs.writeFileSync(R + `fiches/${f.id}.json`, JSON.stringify(f, null, 2) + "\n");

const technos = [
  { id: "kubernetes", nom: "Kubernetes", url: "https://kubernetes.io/" },
  { id: "ovn-kubernetes", nom: "OVN-Kubernetes", url: "https://ovn-kubernetes.io/" },
  { id: "multus", nom: "Multus CNI", url: "https://github.com/k8snetworkplumbingwg/multus-cni" },
  { id: "argo-cd", nom: "Argo CD", url: "https://argo-cd.readthedocs.io/" },
  { id: "olm", nom: "Operator Lifecycle Manager", url: "https://olm.operatorframework.io/" },
];
fs.writeFileSync(R + "technos.json", JSON.stringify(technos, null, 2) + "\n");

const metier = {
  id: "infra-virtualisation", nom: "Architecte infra et virtualisation", accroche: "VMware · datacenter · stockage",
  amorce: "Votre matrice de flux, version NetworkPolicy.",
  portrait: "Environ vingt ans de datacenter : consolidation de serveurs, virtualisation, migrations à grande échelle. Le métier tient, c'est sa forme qui change.",
  savoirFaire: [
    { id: "sf-vlan", texte: "Je découpe le réseau en VLAN", statut: "transpose", fiche: "vlan-reseaux-cluster" },
    { id: "sf-flux", texte: "Je rédige une matrice de flux", statut: "transpose", fiche: "matrice-networkpolicy" },
    { id: "sf-pra", texte: "Je rédige et teste des plans de reprise (PRA)", statut: "transpose", fiche: "pra-gitops" },
    { id: "sf-changement", texte: "Je prépare des procédures de changement", statut: "transpose", fiche: "changement-pr" },
    { id: "sf-vm", texte: "Je construis des VM depuis des templates", statut: "transpose", fiche: "vm-pod" },
    { id: "sf-ha", texte: "J'organise la haute disponibilité actif/passif", statut: "transpose", fiche: "actif-passif-replicas" },
    { id: "sf-acces", texte: "Je gère les comptes et les accès à privilèges", statut: "transpose", fiche: "acces-rbac" },
    { id: "sf-fournisseurs", texte: "J'arbitre entre fournisseurs", statut: "acquis" },
    { id: "sf-migrations", texte: "Je pilote des migrations à grande échelle", statut: "acquis" },
    { id: "sf-comite", texte: "Je défends une architecture en comité", statut: "acquis" },
    { id: "sf-capacite", texte: "Je dimensionne la capacité d'une plateforme", statut: "acquis" },
  ],
  nouveautes: ["reconciliation", "operateurs"],
  ordre: ["matrice-networkpolicy", "vlan-reseaux-cluster", "vm-pod", "actif-passif-replicas", "reconciliation", "changement-pr", "pra-gitops", "acces-rbac", "operateurs"],
  sources: [{ nom: "Archétype « architecte infra virtualisation / datacenter » (passerelles TelcoSkills, personas)", url: "https://github.com/taoufikbo/telcoskills" }],
  statut: "brouillon",
};
fs.writeFileSync(R + "metiers/infra-virtualisation.json", JSON.stringify(metier, null, 2) + "\n");

fs.writeFileSync(R + "metiers-a-venir.json", JSON.stringify([
  { id: "coeur-reseau", nom: "Ingénieur cœur réseau", accroche: "EPC · IMS · VoLTE" },
  { id: "architecte-si", nom: "Architecte SI", accroche: "TOGAF · ITIL · PRA" },
  { id: "avant-vente", nom: "Avant-vente technique", accroche: "Chiffrage · appels d'offres" },
], null, 2) + "\n");
console.log("fiches :", F.length);
