// Génère les 3 autres métiers (cœur réseau, architecte SI, avant-vente), 12 fiches supplémentaires et leurs questions écrites à la main.
// Exécuté une fois après contenu-initial.mjs et questions.mjs, conservé pour traçabilité. Usage : node scripts/reprise/contenu-metiers.mjs
import fs from "node:fs";
import path from "node:path";

const R = path.join(import.meta.dirname, "..", "..", "content") + path.sep;
const K8S = "https://kubernetes.io/docs/";
const hist = [{ date: "2026-11-09", changement: "Première version, brouillon assisté par IA, à relire par l'auteur.", par: "Brouillon assisté par IA", lien: null }];
const base = { statut: "brouillon", misAJour: "2026-11-09", historique: hist, pourquoiNouveau: null, reflexe: null };
const doc = (nom, url, langue = "en") => ({ type: "doc", nom, url, langue, acces: "gratuit" });
const src = (nom, url) => ({ nom, url });
const F = [];
const trans = (f) => F.push({ ...base, genre: "transposition", ...f });
const nouv = (f) => F.push({ ...base, genre: "nouveaute", avant: null, ...f, resume: { avant: null, apres: f.resume } });

trans({
  id: "supervision-prometheus", avant: "compteurs et alarmes", apres: "métriques et alertes sur symptômes",
  resume: { avant: "Des compteurs propriétaires remontés par l'équipementier, des seuils fixes, une alarme par cause possible.", apres: "Des métriques ouvertes interrogées par Prometheus, des alertes sur ce que voit l'utilisateur, regroupées pour limiter le bruit." },
  resteVrai: ["Une alarme doit toujours conduire à une action, sinon elle ne doit pas exister.", "Les compteurs de base (débit, erreurs, latence) restent les premiers indicateurs.", "Un seuil se règle sur le service réel, pas sur une valeur par défaut."],
  change: ["Prometheus évalue les règles d'alerte à intervalle régulier ; la clause « for » impose que la condition dure avant d'alerter.", "On alerte de préférence sur les symptômes (taux d'erreurs vu par l'utilisateur) plutôt que sur chaque cause possible.", "Alertmanager regroupe les alertes similaires, par labels, en une seule notification."],
  reflexe: "Une alarme par cause possible.",
  piege: "Reproduire la logique de l'ancien nœud : des centaines de règles sur des causes, qui se déclenchent ensemble. Résultat : du bruit, et les vraies alertes se perdent. Partez de ce que l'utilisateur ressent, puis creusez vers les causes.",
  exemple: "Pour une SMF, une alerte part si le taux d'échec d'établissement de session PDU dépasse un seuil pendant plusieurs minutes, au lieu d'une alarme par pod redémarré.",
  technos: ["prometheus"], questions: ["q-supervision-prometheus-1", "q-supervision-prometheus-2"],
  plusLoin: [doc("Prometheus : règles d'alerte", "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/"), doc("Alertmanager : documentation", "https://prometheus.io/docs/alerting/latest/alertmanager/")],
  sources: [src("Prometheus : règles d'alerte", "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/"), src("Alertmanager", "https://prometheus.io/docs/alerting/latest/alertmanager/"), src("Google SRE : superviser les systèmes distribués (symptômes et causes)", "https://sre.google/sre-book/monitoring-distributed-systems/")],
});
trans({
  id: "interfaces-sbi", avant: "pile S1AP, GTP et Diameter", apres: "interfaces SBI",
  resume: { avant: "Des interfaces point à point entre nœuds, des protocoles dédiés (SCTP, GTP, Diameter), des liens câblés.", apres: "Des fonctions qui s'appellent en HTTP/2 avec des messages JSON décrits en OpenAPI ; quelques interfaces gardent leur transport d'origine." },
  resteVrai: ["Les procédures du cœur (enregistrement, session, mobilité) restent à connaître.", "La signalisation entre RAN et cœur (N2) reste transportée en SCTP.", "Lire une trace pour comprendre un incident reste le geste de base."],
  change: ["Les fonctions du cœur se parlent par des interfaces de service (SBI) en HTTP/2, avec des messages JSON.", "Chaque service est décrit par une spécification OpenAPI publiée par le 3GPP.", "Les nœuds laissent place à des fonctions (AMF, SMF, UPF) reliées par des points de référence nommés N1, N2, N3, N4."],
  reflexe: "Une interface est un lien dédié entre deux nœuds.",
  piege: "Croire que tout passe en HTTP/2. Les interfaces N2 (NGAP en SCTP) et N3 (GTP-U) gardent leur transport d'origine : elles demandent un traitement réseau particulier dans le cluster (SCTP, interface secondaire).",
  exemple: "L'AMF appelle la SMF pour créer une session PDU par une requête HTTP/2 sur l'interface de service ; la RAN, elle, parle à l'AMF en SCTP sur N2.",
  technos: ["kubernetes"], questions: ["q-interfaces-sbi-1", "q-interfaces-sbi-2"],
  plusLoin: [doc("Kubernetes : Services, protocole SCTP", K8S + "concepts/services-networking/service/#protocol-sctp"), doc("3GPP TS 23.501 : architecture du système 5G", "https://www.3gpp.org/ftp/Specs/archive/23_series/23.501/")],
  sources: [src("3GPP TS 23.501 : architecture du système 5G", "https://www.3gpp.org/ftp/Specs/archive/23_series/23.501/"), src("3GPP TS 29.500 : principes des interfaces de service", "https://www.3gpp.org/ftp/Specs/archive/29_series/29.500/"), src("3GPP TS 38.412 : transport de signalisation NG (SCTP)", "https://www.3gpp.org/ftp/Specs/archive/38_series/38.412/")],
});
trans({
  id: "appliance-cnf", avant: "boîte équipementier", apres: "CNF et son cycle de vie",
  resume: { avant: "Une appliance livrée par l'équipementier, installée par lui, mise à jour par un jeu de procédures.", apres: "Une fonction réseau livrée en conteneurs et en chart Helm, déployée et mise à jour par des commandes versionnées." },
  resteVrai: ["Le fournisseur reste responsable du logiciel et de sa feuille de route.", "Une recette de réception reste nécessaire avant la production.", "Le support et les correctifs se contractualisent toujours."],
  change: ["Le CNF se déploie avec un chart Helm : « helm upgrade » applique une nouvelle version ou de nouvelles valeurs.", "Chaque installation est une release ; les révisions précédentes permettent de revenir en arrière avec « helm rollback ».", "La configuration est dans des fichiers de valeurs versionnés, plus dans une console de l'équipement."],
  reflexe: "La configuration vit dans l'équipement.",
  piege: "Prendre le chart de l'éditeur tel quel. Les valeurs par défaut ne conviennent pas à votre cluster (réseaux secondaires, ressources, stockage) : elles se documentent et se versionnent, comme une configuration d'équipement.",
  exemple: "L'éditeur livre l'UPF sous forme de chart ; votre équipe fixe dans les valeurs les interfaces secondaires et les ressources, puis déploie la version par « helm upgrade ».",
  technos: ["kubernetes", "helm"], questions: ["q-appliance-cnf-1", "q-appliance-cnf-2"],
  plusLoin: [doc("Helm : utiliser Helm", "https://helm.sh/docs/intro/using_helm/"), doc("Helm : helm rollback", "https://helm.sh/docs/helm/helm_rollback/")],
  sources: [src("Helm : helm upgrade", "https://helm.sh/docs/helm/helm_upgrade/"), src("Helm : helm rollback", "https://helm.sh/docs/helm/helm_rollback/"), src("Helm : utiliser Helm", "https://helm.sh/docs/intro/using_helm/")],
});
trans({
  id: "dimensionnement-ressources", avant: "dimensionnement en vCPU et RAM", apres: "requests, limits et CPU pinning",
  resume: { avant: "Des vCPU et de la RAM alloués à une VM, avec un surdimensionnement toléré par l'hyperviseur.", apres: "Une demande (request) pour le placement, une limite (limit) appliquée à l'exécution, et des CPU exclusifs pour les fonctions exigeantes." },
  resteVrai: ["Dimensionner à partir de la charge réelle et de la marge voulue reste le travail.", "Les fonctions de plan usager restent sensibles à la latence et au débit.", "Les ressources d'un nœud restent finies : il faut toujours les compter."],
  change: ["Les « requests » servent à placer le pod sur un nœud ; les « limits » sont appliquées pendant l'exécution.", "Un pod dont requests et limits sont égales, en CPU entiers, peut recevoir des CPU exclusifs (politique static du CPU Manager).", "Les hugepages et l'alignement NUMA (Topology Manager) se demandent eux aussi explicitement."],
  reflexe: "Un vCPU alloué est un vCPU réservé.",
  piege: "Fixer des limites sans en connaître l'effet : une limite mémoire dépassée tue le conteneur, une limite CPU le ralentit. Et sans requests, le placement ne tient pas compte de vos besoins.",
  exemple: "Un UPF qui traite du trafic utilisateur demande des CPU entiers, des hugepages, et un nœud où ses CPU et sa carte réseau relèvent du même NUMA.",
  technos: ["kubernetes"], questions: ["q-dimensionnement-ressources-1", "q-dimensionnement-ressources-2"],
  plusLoin: [doc("Kubernetes : gérer les ressources des conteneurs", K8S + "concepts/configuration/manage-resources-containers/"), doc("Kubernetes : politiques de gestion du CPU", K8S + "tasks/administer-cluster/cpu-management-policies/")],
  sources: [src("Kubernetes : gérer les ressources des conteneurs", K8S + "concepts/configuration/manage-resources-containers/"), src("Kubernetes : politiques de gestion du CPU", K8S + "tasks/administer-cluster/cpu-management-policies/"), src("Kubernetes : hugepages", K8S + "tasks/manage-hugepages/scheduling-hugepages/"), src("Kubernetes : Topology Manager", K8S + "tasks/administer-cluster/topology-manager/")],
});
trans({
  id: "ao-exigences-cnf", avant: "appel d'offres multi-fournisseurs", apres: "exigences CNF et critères d'éligibilité",
  resume: { avant: "Un cahier des charges par fonctionnalités, des critères de conformité à l'équipement, une notation des réponses.", apres: "Un cahier des charges qui exige aussi la façon de livrer et d'exploiter : plateforme conforme, livraison en conteneurs, mises à jour déclaratives." },
  resteVrai: ["Comparer les offres sur une grille pondérée reste la méthode.", "Les exigences de sécurité, de support et de performance restent contractuelles.", "La réversibilité se prévoit dès l'appel d'offres."],
  change: ["On exige que la fonction tourne sur une plateforme Kubernetes conforme, pas sur un matériel imposé.", "On demande la façon de livrer : images de conteneurs, charts, documentation des réseaux secondaires et des ressources.", "On vérifie l'interopérabilité et la portabilité, que les opérateurs placent en priorité dans l'enquête de la CNCF."],
  reflexe: "L'équipementier choisit et impose son infrastructure.",
  piege: "Écrire « compatible cloud natif » sans le rendre vérifiable. Une exigence doit se tester : version de Kubernetes certifiée, formats de livraison, comportement à la mise à jour. Sinon, chaque fournisseur la comprend à sa façon.",
  exemple: "Dans l'appel d'offres d'une SMF, « livrée en chart Helm, déployable sur une plateforme Kubernetes certifiée CNCF, avec la liste des réseaux secondaires requis » remplace « fournie sur serveur dédié ».",
  technos: ["kubernetes", "helm"], questions: ["q-ao-exigences-cnf-1", "q-ao-exigences-cnf-2"],
  plusLoin: [doc("CNCF : groupe de travail CNF", "https://github.com/cncf/cnf-wg"), doc("CNCF : programme de conformité Kubernetes", "https://www.cncf.io/training/certification/software-conformance/")],
  sources: [src("CNCF : micro-enquête telco", "https://www.cncf.io/blog/2022/08/02/cncf-telco-microsurvey-cloud-native-network-functions-with-kubernetes-are-coming-but-interoperability-and-portability-are-priorities"), src("CNCF : programme de conformité logicielle", "https://www.cncf.io/training/certification/software-conformance/"), src("CNCF : groupe de travail CNF", "https://github.com/cncf/cnf-wg")],
});
nouv({
  id: "observabilite-traces", apres: "Les traces distribuées (OpenTelemetry)",
  resume: "Une requête traverse plusieurs services : une trace la suit de bout en bout, avec le temps passé dans chacun.",
  resteVrai: ["Les journaux et les compteurs restent utiles : la trace s'ajoute, elle ne les remplace pas.", "Reconstituer un déroulé d'appel pour comprendre un incident est déjà votre geste."],
  change: ["OpenTelemetry collecte trois signaux : traces, métriques et journaux.", "Le Collector reçoit, traite et exporte la télémétrie vers les outils d'analyse.", "Un identifiant de trace relie entre elles les étapes d'une même requête."],
  pourquoiNouveau: "Quand une session traverse plusieurs fonctions qui s'appellent en HTTP/2, aucun journal pris seul ne montre où le temps est perdu. C'est ce que la trace distribuée apporte, et il n'y avait pas d'équivalent dans l'ancien nœud monolithique.",
  piege: "Tout tracer. La télémétrie coûte du stockage et du réseau : on échantillonne et on choisit ce qui est instrumenté. Le Collector sert aussi à filtrer avant l'export.",
  exemple: "Une création de session PDU traverse l'AMF, la SMF, la PCF et l'UPF ; la trace montre quelle étape ralentit la création de session.",
  technos: ["opentelemetry"], questions: ["q-observabilite-traces-1", "q-observabilite-traces-2"],
  plusLoin: [doc("OpenTelemetry : signaux", "https://opentelemetry.io/docs/concepts/signals/"), doc("OpenTelemetry : Collector", "https://opentelemetry.io/docs/collector/")],
  sources: [src("OpenTelemetry : signaux", "https://opentelemetry.io/docs/concepts/signals/"), src("OpenTelemetry : Collector", "https://opentelemetry.io/docs/collector/")],
});
trans({
  id: "dossier-archi-code", avant: "dossier d'architecture validé en comité", apres: "décisions d'architecture versionnées",
  resume: { avant: "Un dossier produit en début de projet, validé en comité, puis rarement relu.", apres: "Des décisions courtes (ADR) et des schémas décrits en fichiers, versionnés avec le code et relus comme lui." },
  resteVrai: ["Le comité d'architecture garde son rôle : arbitrer et rendre les décisions explicites.", "Une décision se justifie par ses alternatives et ses conséquences.", "Un dossier doit rester lisible par des non-spécialistes."],
  change: ["Chaque décision est un court document (ADR) : contexte, décision, statut, conséquences, avec une date.", "Les ADR vivent dans le dépôt, à côté de ce qu'ils décrivent, et changent par pull request.", "Un schéma décrit en texte se compare version par version, ce qu'un diagramme dessiné ne permet pas."],
  reflexe: "Le dossier validé en comité fait foi pour des années.",
  piege: "Écrire un ADR après coup, pour justifier. Sa valeur vient de ce qu'il est daté et rédigé au moment du choix ; une décision remplacée reste dans l'historique, marquée comme telle.",
  exemple: "Le choix de séparer le plan usager sur une interface secondaire SR-IOV s'écrit en un ADR d'une page, relu en pull request par l'équipe réseau.",
  technos: [], questions: ["q-dossier-archi-code-1", "q-dossier-archi-code-2"],
  plusLoin: [doc("Architecture Decision Records : site de référence", "https://adr.github.io/"), doc("Documenting Architecture Decisions (Michael Nygard)", "https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions")],
  sources: [src("Michael Nygard : Documenting Architecture Decisions", "https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions"), src("ADR : site de référence", "https://adr.github.io/")],
});
trans({
  id: "cmdb-git", avant: "CMDB et inventaire", apres: "Git comme source de vérité et labels",
  resume: { avant: "Une CMDB mise à jour à la main ou par découverte, où l'inventaire retarde sur la réalité.", apres: "L'état voulu est dans Git ; les objets se retrouvent par des labels. L'inventaire se lit dans le cluster, il n'est pas ressaisi." },
  resteVrai: ["Savoir ce qui existe, qui en est responsable et à quoi ça sert reste indispensable.", "Un inventaire faux est pire que pas d'inventaire.", "Les relations entre composants restent à documenter."],
  change: ["Git décrit l'état voulu ; un outil GitOps le réapplique, donc dépôt et cluster ne divergent pas longtemps.", "Les labels (clé/valeur) disent propriétaire, application, version : on sélectionne et on filtre dessus.", "Un objet sans labels cohérents est un objet que l'inventaire ne retrouve pas."],
  reflexe: "L'inventaire se tient dans un outil à part, mis à jour à la main.",
  piege: "Mélanger labels et annotations : les labels servent à sélectionner et regrouper, les annotations à porter des informations non identifiantes. Et sans convention de nommage des labels, chaque équipe invente la sienne.",
  exemple: "Chaque fonction du cœur porte les labels application, version et propriétaire ; une requête sur le propriétaire liste ce qu'une équipe exploite, sans consulter une CMDB.",
  technos: ["kubernetes", "argo-cd"], questions: ["q-cmdb-git-1", "q-cmdb-git-2"],
  plusLoin: [doc("Kubernetes : labels et sélecteurs", K8S + "concepts/overview/working-with-objects/labels/"), doc("OpenGitOps : les principes", "https://opengitops.dev/")],
  sources: [src("Kubernetes : labels et sélecteurs", K8S + "concepts/overview/working-with-objects/labels/"), src("Kubernetes : annotations", K8S + "concepts/overview/working-with-objects/annotations/"), src("OpenGitOps : principes", "https://opengitops.dev/")],
});
trans({
  id: "patch-images", avant: "patch des serveurs", apres: "images immuables et chaîne d'approvisionnement",
  resume: { avant: "Un correctif appliqué serveur par serveur, une fenêtre par lot, un état qui diverge au fil du temps.", apres: "On ne corrige plus un conteneur existant : on reconstruit l'image, on la vérifie, on la redéploie." },
  resteVrai: ["Corriger vite les failles critiques reste une obligation.", "Une recette avant production reste nécessaire.", "Savoir ce qui tourne, et où, reste le point de départ."],
  change: ["Une image se référence par son digest (sha256:…), pas par un tag comme :latest qui peut changer.", "Un SBOM liste les composants d'une image : on sait où se trouve une bibliothèque vulnérable.", "Le correctif est un nouveau déploiement, pas une modification de l'existant."],
  reflexe: "Le serveur patché reste le même serveur.",
  piege: "Utiliser :latest en production : le même tag peut désigner deux contenus différents, donc deux comportements. Le digest, lui, désigne un contenu précis.",
  exemple: "Une faille touche une bibliothèque de l'AMF : le SBOM indique quelles images la contiennent ; on reconstruit, on déploie par digest, et l'ancien état reste récupérable.",
  technos: ["kubernetes"], questions: ["q-patch-images-1", "q-patch-images-2"],
  plusLoin: [doc("Kubernetes : images de conteneurs", K8S + "concepts/containers/images/"), doc("SLSA : niveaux de sécurité de la chaîne logicielle", "https://slsa.dev/")],
  sources: [src("Kubernetes : images de conteneurs", K8S + "concepts/containers/images/"), src("CISA : SBOM", "https://www.cisa.gov/sbom"), src("SLSA", "https://slsa.dev/")],
});
trans({
  id: "lb-services", avant: "load balancer (F5)", apres: "Service, Ingress et MetalLB",
  resume: { avant: "Un F5 devant les serveurs : virtual servers, pools, persistance, tout configuré sur l'équipement.", apres: "Un Service répartit le trafic entre pods ; Ingress ou Route pour le HTTP ; MetalLB pour exposer des adresses en L4, SCTP compris." },
  resteVrai: ["Répartir la charge et supprimer les points uniques reste le but.", "Les adresses de service restent à réserver et à documenter.", "Le L4 et le L7 se distinguent toujours."],
  change: ["Un Service est un répartiteur logiciel : il suit les pods qui répondent, sans pools à maintenir à la main.", "Une Route ou un Ingress ne gère que HTTP, HTTPS et TLS ; le SCTP demande un autre mécanisme.", "MetalLB expose des Services de type LoadBalancer sur du bare metal, notamment en mode BGP."],
  reflexe: "Le répartiteur de charge est un équipement qu'on configure à la main.",
  piege: "Faire passer le SCTP de la signalisation N2 par un Ingress : il ne le transporte pas. Il faut un Service de type LoadBalancer (par exemple avec MetalLB) ou un équivalent.",
  exemple: "L'AMF expose le port NGAP en SCTP par un Service LoadBalancer dont l'adresse est annoncée en BGP aux routeurs de la RAN.",
  technos: ["kubernetes", "metallb"], questions: ["q-lb-services-1", "q-lb-services-2"],
  plusLoin: [doc("Kubernetes : Services", K8S + "concepts/services-networking/service/"), doc("MetalLB : mode BGP", "https://metallb.io/concepts/bgp/")],
  sources: [src("Kubernetes : Services", K8S + "concepts/services-networking/service/"), src("Kubernetes : Ingress", K8S + "concepts/services-networking/ingress/"), src("MetalLB : mode BGP", "https://metallb.io/concepts/bgp/"), src("VMware Telco Cloud Platform 2.7, guide d'architecture", "https://docs.vmware.com/en/VMware-Telco-Cloud-Platform/2.7/telco-cloud-platform-5G-edition-reference-architecture-guide-27/GUID-81109C7A-A6F9-4FEA-A9F3-443D919BF19A.html")],
});
trans({
  id: "chiffrage-slo", avant: "chiffrage et TCO", apres: "coût par SLO et FinOps",
  resume: { avant: "Un chiffrage par équipement et par licence, un TCO sur cinq ans, des marges de sécurité.", apres: "Un coût rattaché à un niveau de service (SLO) : ce qu'on paie pour tenir 99,9 % plutôt que 99 %, mesuré en continu." },
  resteVrai: ["Un chiffrage reste une hypothèse, avec ses marges et ses risques.", "Le TCO reste utile pour comparer des options sur la durée.", "Le client achète un service, pas une technologie."],
  change: ["Un SLO est un objectif mesurable de niveau de service ; son budget d'erreur dit combien d'indisponibilité est tolérée.", "Chaque niveau de disponibilité en plus a un coût d'architecture : on le chiffre en face de l'objectif.", "FinOps rend le coût visible et attribuable par équipe ou par service, en continu."],
  reflexe: "Le chiffrage se fige à la signature.",
  piege: "Vendre un SLO sans pouvoir le mesurer. Un objectif de disponibilité n'a de sens que défini avec son indicateur (SLI) et sa fenêtre de mesure.",
  exemple: "Pour une fonction du cœur, deux options sont chiffrées : trois réplicas sur un site, ou six répartis sur deux sites. Le client voit le coût de chaque objectif de disponibilité.",
  technos: [], questions: ["q-chiffrage-slo-1", "q-chiffrage-slo-2"],
  plusLoin: [doc("Google SRE : objectifs de niveau de service", "https://sre.google/sre-book/service-level-objectives/"), doc("FinOps Foundation : qu'est-ce que le FinOps", "https://www.finops.org/introduction/what-is-finops/")],
  sources: [src("Google SRE : objectifs de niveau de service", "https://sre.google/sre-book/service-level-objectives/"), src("FinOps Foundation : qu'est-ce que le FinOps", "https://www.finops.org/introduction/what-is-finops/")],
});
nouv({
  id: "plateforme-produit", apres: "La plateforme comme produit interne",
  resume: "La plateforme est un produit : elle a des utilisateurs (les équipes), un catalogue de capacités et un responsable qui l'améliore.",
  resteVrai: ["Un service interne a toujours des clients : les équipes d'exploitation et de développement.", "Les engagements de service et le support restent à définir."],
  change: ["Une équipe plateforme propose des capacités en libre-service plutôt que de traiter des tickets.", "On mesure le produit comme tout produit : adoption, satisfaction, délai pour obtenir une capacité.", "Elle ne cache pas Kubernetes : elle réduit la charge cognitive des équipes qui l'utilisent."],
  pourquoiNouveau: "Dans un modèle classique, une équipe d'infrastructure traite des demandes. Ici, la plateforme se conçoit pour ses utilisateurs internes, avec une feuille de route et des retours, comme un produit.",
  piege: "Réduire la plateforme à un outil installé. Sans équipe responsable, sans catalogue et sans retour des utilisateurs, elle redevient un guichet de tickets.",
  exemple: "L'équipe plateforme propose un gabarit « déployer une CNF » (réseaux secondaires, supervision, accès) que les équipes d'exploitation utilisent sans recréer chaque réglage.",
  technos: ["kubernetes"], questions: ["q-plateforme-produit-1", "q-plateforme-produit-2"],
  plusLoin: [doc("CNCF : livre blanc sur les plateformes", "https://tag-app-delivery.cncf.io/whitepapers/platforms/"), doc("CNCF : modèle de maturité des plateformes", "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/")],
  sources: [src("CNCF : livre blanc sur les plateformes", "https://tag-app-delivery.cncf.io/whitepapers/platforms/"), src("CNCF : modèle de maturité des plateformes", "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/")],
});
for (const f of F) fs.writeFileSync(R + `fiches/${f.id}.json`, JSON.stringify(f, null, 2) + "\n");

// Questions écrites à la main (brouillon, sourcées) pour les fiches sans question à reprendre.
const Q = (fiche, n, enonce, options, bonne, explication, source) => {
  const q = { id: `q-${fiche}-${n}`, fiche, enonce, options, bonne, explication, source, statut: "brouillon" };
  fs.writeFileSync(R + `questions/${q.id}.json`, JSON.stringify(q, null, 2) + "\n");
};
Q("dimensionnement-ressources", 1, "Que fait Kubernetes de la « request » CPU ou mémoire d'un conteneur ?",
  ["Elle sert à choisir le nœud où placer le pod", "Elle plafonne la consommation pendant l'exécution", "Elle réserve physiquement des CPU à ce seul pod", "Elle fixe la priorité réseau du pod"], 0,
  "Le scheduler place le pod sur un nœud qui dispose au moins des « requests » demandées. Le plafond appliqué pendant l'exécution est la « limit ».", "Kubernetes : gérer les ressources des conteneurs (kubernetes.io/docs/concepts/configuration/manage-resources-containers/)");
Q("dimensionnement-ressources", 2, "Un pod peut recevoir des CPU exclusifs avec la politique « static » du CPU Manager. Quelle condition faut-il ?",
  ["Que son QoS soit Guaranteed et que ses CPU soient demandés en nombre entier", "Qu'il tourne dans le namespace kube-system", "Qu'il n'ait aucune limite mémoire", "Qu'il soit déployé par un opérateur"], 0,
  "La politique « static » attribue des CPU exclusifs aux conteneurs de pods de classe Guaranteed dont la demande de CPU est un nombre entier.", "Kubernetes : politiques de gestion du CPU (kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/)");
Q("ao-exigences-cnf", 1, "Quel programme permet de vérifier qu'une distribution Kubernetes respecte le comportement standard de l'API ?",
  ["La certification CKA des administrateurs", "Le programme « Certified Kubernetes » de conformité logicielle de la CNCF", "Le marquage CE de l'éditeur", "Une certification ISO de l'hébergeur"], 1,
  "Le programme de conformité logicielle de la CNCF certifie que les distributions et offres Kubernetes passent une même suite de tests. Les certifications CKA et CKAD concernent des personnes, pas des produits.", "CNCF : programme de conformité logicielle (cncf.io/training/certification/software-conformance/)");
Q("ao-exigences-cnf", 2, "Dans la micro-enquête telco de la CNCF (2022), quelles priorités ressortent pour les fonctions réseau cloud natives sous Kubernetes ?",
  ["L'interopérabilité et la portabilité", "Le coût du matériel et l'efficacité énergétique", "La taille des images et la vitesse de build", "La réduction du nombre de fournisseurs et la facturation à l'usage"], 0,
  "Le titre même de la synthèse de la CNCF le dit : les CNF sous Kubernetes arrivent, mais l'interopérabilité et la portabilité sont les priorités.", "CNCF : micro-enquête telco (cncf.io/blog/2022/08/02/cncf-telco-microsurvey-cloud-native-network-functions-with-kubernetes-are-coming-but-interoperability-and-portability-are-priorities)");
Q("dossier-archi-code", 1, "Que contient classiquement un enregistrement de décision d'architecture (ADR) ?",
  ["Le code source de la fonctionnalité et ses tests", "Le contexte, la décision, son statut et ses conséquences", "Le planning détaillé et le budget du projet", "La liste des incidents d'exploitation"], 1,
  "Un ADR est un court document qui décrit le contexte, la décision prise, son statut et ses conséquences.", "Michael Nygard, Documenting Architecture Decisions (cognitect.com/blog/2011/11/15/documenting-architecture-decisions)");
Q("dossier-archi-code", 2, "Où vit un ADR dans une approche « architecture as code » ?",
  ["Dans un document partagé unique, remplacé à chaque version", "Dans le dépôt, à côté de ce qu'il décrit, modifié par pull request", "Dans l'outil de ticketing uniquement", "Dans la CMDB, sans historique"], 1,
  "Les ADR se conservent dans le dépôt du projet : ils sont versionnés et relus comme le code.", "Michael Nygard, Documenting Architecture Decisions (cognitect.com/blog/2011/11/15/documenting-architecture-decisions)");
Q("cmdb-git", 1, "À quoi servent les labels Kubernetes ?",
  ["À chiffrer les données d'un objet", "À identifier et sélectionner des groupes d'objets par attributs clé/valeur", "À fixer les limites de CPU d'un pod", "À choisir le plugin réseau du cluster"], 1,
  "Les labels sont des paires clé/valeur attachées aux objets ; les sélecteurs s'en servent pour retrouver et regrouper des objets.", "Kubernetes : labels et sélecteurs (kubernetes.io/docs/concepts/overview/working-with-objects/labels/)");
Q("cmdb-git", 2, "Où mettre une information utile mais non identifiante, par exemple un lien vers un ticket ?",
  ["Dans une annotation", "Dans un label de sélection", "Dans le nodeSelector du pod", "Dans le nom du namespace"], 0,
  "Les annotations portent des métadonnées non identifiantes ; les labels servent à identifier et sélectionner.", "Kubernetes : annotations (kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)");
Q("chiffrage-slo", 1, "Un SLO de 99,9 % de disponibilité sur 30 jours tolère environ combien d'indisponibilité ?",
  ["Environ 43 minutes", "Environ 7 heures", "Environ 4 minutes", "Environ 72 heures"], 0,
  "30 jours font 43 200 minutes ; 0,1 % de ce total fait 43,2 minutes. C'est le budget d'erreur de l'objectif.", "Google SRE : objectifs de niveau de service (sre.google/sre-book/service-level-objectives/)");
Q("chiffrage-slo", 2, "Que désigne un SLI ?",
  ["Une pénalité financière prévue au contrat", "Un indicateur mesuré du niveau de service, par exemple la proportion de requêtes réussies", "Le plan de reprise du service", "La liste des clients concernés"], 1,
  "Un SLI (service level indicator) est la mesure sur laquelle s'appuie le SLO : proportion de requêtes réussies, latence, etc.", "Google SRE : objectifs de niveau de service (sre.google/sre-book/service-level-objectives/)");
Q("plateforme-produit", 1, "D'après le livre blanc plateformes de la CNCF, qu'apporte avant tout une plateforme interne ?",
  ["Des capacités en libre-service qui réduisent la charge cognitive des équipes", "Le remplacement de toutes les équipes d'exploitation", "L'interdiction d'utiliser Kubernetes directement", "Un budget d'infrastructure illimité"], 0,
  "Une plateforme interne propose des capacités en libre-service pour que les équipes se concentrent sur leur métier plutôt que sur l'infrastructure sous-jacente.", "CNCF : livre blanc sur les plateformes (tag-app-delivery.cncf.io/whitepapers/platforms/)");
Q("plateforme-produit", 2, "Comment juge-t-on le succès d'une plateforme gérée comme un produit ?",
  ["Par le nombre de tickets traités", "Par l'adoption et la satisfaction de ses utilisateurs internes", "Par le nombre d'outils installés", "Par la taille de l'équipe plateforme"], 1,
  "Un produit se mesure à son usage et à la satisfaction de ses utilisateurs, ici les équipes internes.", "CNCF : modèle de maturité des plateformes (tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/)");

// Technos ajoutées
const technos = JSON.parse(fs.readFileSync(R + "technos.json", "utf8"));
for (const t of [
  { id: "prometheus", nom: "Prometheus", url: "https://prometheus.io/" },
  { id: "helm", nom: "Helm", url: "https://helm.sh/" },
  { id: "opentelemetry", nom: "OpenTelemetry", url: "https://opentelemetry.io/" },
  { id: "metallb", nom: "MetalLB", url: "https://metallb.io/" },
]) if (!technos.some((x) => x.id === t.id)) technos.push(t);
fs.writeFileSync(R + "technos.json", JSON.stringify(technos, null, 2) + "\n");

// Métiers
const metier = (m) => fs.writeFileSync(R + `metiers/${m.id}.json`, JSON.stringify({ ...m, statut: "brouillon" }, null, 2) + "\n");
const sf = (id, texte, fiche) => (fiche ? { id, texte, statut: "transpose", fiche } : { id, texte, statut: "acquis" });
const SOURCE_PERSONAS = [{ nom: "Archétypes des passerelles TelcoSkills (personas construits à partir de CV et d'offres publics)", url: "https://github.com/taoufikbo/telcoskills" }];

metier({
  id: "coeur-reseau", nom: "Ingénieur cœur réseau", accroche: "EPC · IMS · VoLTE", amorce: "Votre pile S1AP, GTP et Diameter, version interfaces SBI.",
  portrait: "Environ vingt ans de télécom : EPC, IMS, VoLTE, signalisation. Vous connaissez les procédures du cœur mobile mieux que n'importe quelle plateforme.",
  savoirFaire: [
    sf("sf-interfaces", "Je lis et je dépanne la signalisation (S1AP, GTP, Diameter)", "interfaces-sbi"),
    sf("sf-versions", "Je valide et déploie les versions de l'équipementier", "appliance-cnf"),
    sf("sf-vlan", "Je conçois les interfaces et les VLAN de mes nœuds", "vlan-reseaux-cluster"),
    sf("sf-redondance", "J'organise la redondance de mes nœuds de cœur", "actif-passif-replicas"),
    sf("sf-supervision", "Je supervise avec des compteurs et des alarmes", "supervision-prometheus"),
    sf("sf-dimensionnement", "Je dimensionne en vCPU et en RAM", "dimensionnement-ressources"),
    sf("sf-changement", "Je prépare des changements en fenêtre de maintenance", "changement-pr"),
    sf("sf-ao", "Je rédige les exigences techniques d'un appel d'offres", "ao-exigences-cnf"),
    sf("sf-procedures", "Je connais les procédures du cœur mobile (attachement, session, mobilité)"),
    sf("sf-deroule", "Je reconstitue un déroulé d'appel à partir des traces"),
    sf("sf-recette", "Je mène la recette d'une fonction avec l'équipementier"),
    sf("sf-incident", "J'analyse un incident de bout en bout"),
  ],
  nouveautes: ["reconciliation", "operateurs", "observabilite-traces"],
  ordre: ["interfaces-sbi", "vlan-reseaux-cluster", "appliance-cnf", "actif-passif-replicas", "dimensionnement-ressources", "reconciliation", "supervision-prometheus", "observabilite-traces", "changement-pr", "operateurs", "ao-exigences-cnf"],
  sources: SOURCE_PERSONAS,
});
metier({
  id: "architecte-si", nom: "Architecte SI", accroche: "TOGAF · ITIL · PRA", amorce: "Votre dossier PRA, version GitOps.",
  portrait: "Plus de vingt ans de systèmes d'information : dossiers d'architecture, ITIL, PRA, arbitrage entre fournisseurs. Le cloud natif change la forme de vos livrables, pas leur utilité.",
  savoirFaire: [
    sf("sf-pra", "Je rédige et teste des plans de reprise (PRA)", "pra-gitops"),
    sf("sf-flux", "Je rédige des matrices de flux", "matrice-networkpolicy"),
    sf("sf-changement", "Je gouverne les changements (CAB, MOP)", "changement-pr"),
    sf("sf-vm", "Je définis des VM et des templates", "vm-pod"),
    sf("sf-patch", "Je planifie le patch des serveurs", "patch-images"),
    sf("sf-lb", "Je dimensionne les load balancers", "lb-services"),
    sf("sf-dossier", "Je rédige des dossiers d'architecture validés en comité", "dossier-archi-code"),
    sf("sf-cmdb", "Je tiens la CMDB et l'inventaire", "cmdb-git"),
    sf("sf-acces", "Je gère les comptes et les accès à privilèges", "acces-rbac"),
    sf("sf-fournisseurs", "J'arbitre entre fournisseurs"),
    sf("sf-itil", "J'applique les processus ITIL"),
    sf("sf-comite", "Je défends une architecture devant un comité"),
    sf("sf-capacite", "Je dimensionne la capacité d'un service"),
  ],
  nouveautes: ["reconciliation", "operateurs", "plateforme-produit"],
  ordre: ["pra-gitops", "matrice-networkpolicy", "dossier-archi-code", "changement-pr", "vm-pod", "reconciliation", "patch-images", "lb-services", "cmdb-git", "acces-rbac", "operateurs", "plateforme-produit"],
  sources: SOURCE_PERSONAS,
});
metier({
  id: "avant-vente", nom: "Avant-vente technique", accroche: "Chiffrage · appels d'offres", amorce: "Votre chiffrage, version coût par SLO.",
  portrait: "Plus de vingt ans entre direction de projet, avant-vente et exploitation. Vous savez cadrer un besoin et chiffrer une solution ; ce sont les objets chiffrés qui changent.",
  savoirFaire: [
    sf("sf-chiffrage", "Je chiffre une solution et son TCO", "chiffrage-slo"),
    sf("sf-ao", "Je réponds à des appels d'offres multi-fournisseurs", "ao-exigences-cnf"),
    sf("sf-dossier", "Je rédige le dossier d'architecture de la solution", "dossier-archi-code"),
    sf("sf-dimensionnement", "Je dimensionne les ressources d'une offre", "dimensionnement-ressources"),
    sf("sf-equipementier", "Je présente une offre d'équipementier", "appliance-cnf"),
    sf("sf-cadrage", "Je cadre un besoin client"),
    sf("sf-relation", "J'anime la relation avec le client et les fournisseurs"),
    sf("sf-vision", "Je garde une vision de bout en bout d'un service télécom"),
    sf("sf-risques", "J'identifie les risques d'un projet"),
  ],
  nouveautes: ["reconciliation", "plateforme-produit"],
  ordre: ["chiffrage-slo", "ao-exigences-cnf", "appliance-cnf", "dimensionnement-ressources", "dossier-archi-code", "reconciliation", "plateforme-produit"],
  sources: SOURCE_PERSONAS,
});
fs.writeFileSync(R + "metiers-a-venir.json", "[]\n");
console.log("fiches ajoutées :", F.length);
