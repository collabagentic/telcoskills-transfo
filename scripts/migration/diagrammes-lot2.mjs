// Lot 2 : des diagrammes d'architecture pour les compétences Kubernetes, OpenShift, réseau, stockage et performance.
// Usage : node scripts/migration/diagrammes-lot2.mjs, puis les tests (règle 15).
import { n, rangee, colonne, centrer, zone, diagramme, flux, etoile, competence } from "./outils-diagramme.mjs";

const ok = { ton: "ok" };
const chaud = { ton: "chaud" };
const froid = { ton: "froid" };
const faible = { ton: "faible" };

// ───────────── Kubernetes et OpenShift ─────────────

// Workloads : quel contrôleur pour quelle charge
{
  const w = { largeur: 190 };
  const r1 = rangee([n("dep", "Deployment", "sans état", w), n("rs", "ReplicaSet", "N réplicas", w), n("p1", "Pods", "interchangeables", { ...w, ...ok })], { y: 40, gap: 60 });
  const r2 = rangee([n("sts", "StatefulSet", "identité stable", w), n("p2", "Pods nommés", "db-0, db-1, db-2", { ...w, ...ok }), n("vol", "Volumes", "un PVC par pod", { ...w, ...froid })], { y: 140, gap: 60 });
  const r3 = rangee([n("ds", "DaemonSet", "un pod par nœud", w), n("p3", "Pods d'agent", "logs, métriques", { ...w, ...ok })], { y: 240, gap: 60 });
  const r4 = rangee([n("job", "Job, CronJob", "tâche jusqu'à la fin", w), n("p4", "Pod éphémère", "termine puis s'arrête", { ...w, ...ok })], { y: 340, gap: 60 });
  competence(
    "k8s-workloads",
    diagramme({
      legende: "Quel contrôleur pour quelle charge de travail",
      noeuds: [...r1, ...r2, ...r3, ...r4],
      liens: [["dep", "rs", "gère"], ["rs", "p1", "crée"], ["sts", "p2", "ordonne"], ["p2", "vol", "monte"], ["ds", "p3", "place"], ["job", "p4", "lance"]],
    }),
  );
}

// Services : de l'appelant aux pods
{
  const interne = rangee([n("ci", "Client du cluster", "un autre pod"), n("dns", "CoreDNS", "résout le nom du Service")], { x: 20, y: 40, gap: 70 });
  const externe = rangee([n("ce", "Client externe", "navigateur, API"), n("ing", "Ingress ou Route", "HTTP, HTTPS, TLS", chaud)], { x: 20, y: 220, gap: 70 });
  const service = rangee([n("svc", "Service", "adresse stable (ClusterIP)", chaud)], { x: 440, y: 130 });
  const pods = rangee([n("pods", "Pods prêts", "endpoints à jour", ok)], { x: service[0].x + service[0].w + 70, y: 130 });
  competence(
    "k8s-services",
    diagramme({
      legende: "Un Service donne une adresse stable à des pods qui changent",
      noeuds: [...interne, ...externe, ...service, ...pods],
      liens: [["ci", "dns", "nom"], ["dns", "svc", "IP stable", { decalageEntree: -12 }], ["ce", "ing", "HTTPS"], ["ing", "svc", "route", { decalageEntree: 12 }], ["svc", "pods", "répartit"]],
    }),
  );
}

// Stockage : du pod au disque
{
  const d = flux({
    legende: "Du pod au disque : PVC, PV, StorageClass",
    noeuds: [n("pod", "Pod", "monte le volume"), n("pvc", "PVC", "demande : 10 Gio, RWO", chaud), n("pv", "PV", "volume lié", chaud), n("backend", "Stockage", "Ceph, SAN, disque local", froid)],
    etiquettes: ["réclame", "se lie à", "adossé à"],
    extra: [["sc", "pv", "crée à la demande", { sortie: "h", entree: "b" }]],
  });
  const pv = d.noeuds.find((k) => k.id === "pv");
  d.noeuds.push({ id: "sc", texte: "StorageClass", detail: "provisionne à la demande", x: Math.round(pv.x + pv.w / 2 - 100), y: pv.y + 110, w: 200, h: 56, ton: "froid" });
  d.hauteur = Math.max(d.hauteur, pv.y + 110 + 56 + 20);
  competence("k8s-stockage", d);
}

// RBAC, quotas et multi-tenance
{
  const equipes = colonne([n("ea", "Équipe A"), n("eb", "Équipe B")], { x: 20, y: 70, gap: 120 });
  const a = rangee([n("ra", "Role", "droits de l'équipe"), n("qa", "ResourceQuota", "plafonne CPU et mémoire"), n("npa", "NetworkPolicy", "isole le trafic")], { x: 230, y: 70, gap: 40 });
  const b = rangee([n("rb", "Role", "droits de l'équipe"), n("qb", "ResourceQuota", "plafonne CPU et mémoire"), n("npb", "NetworkPolicy", "isole le trafic")], { x: 230, y: 230, gap: 40 });
  competence(
    "k8s-rbac",
    diagramme({
      legende: "Un cluster partagé : un namespace par équipe, avec ses droits, son quota, son isolation",
      zones: [zone("nsa", "Namespace équipe A", a, "chaud"), zone("nsb", "Namespace équipe B", b, "chaud")],
      noeuds: [...equipes, ...a, ...b],
      liens: [["ea", "ra", "travaille dans"], ["eb", "rb", "travaille dans"]],
    }),
  );
}

// Helm
{
  const haut = rangee([n("reg", "Registre de charts", "OCI, versionnés"), n("chart", "Chart", "templates + values.yaml", chaud), n("up", "helm upgrade", "fusionne les valeurs", chaud), n("cl", "Cluster", "release n", ok)], { x: 20, y: 40, gap: 50 });
  const bas = rangee([n("vals", "Vos valeurs", "values.yaml dans Git")], { y: 190 });
  centrer(bas, "vals", haut[2].x + haut[2].w / 2);
  const hist = rangee([n("hist", "Révisions", "historique, rollback", faible)], { y: 190 });
  centrer(hist, "hist", haut[3].x + haut[3].w / 2);
  competence(
    "helm",
    diagramme({
      legende: "Helm : un chart, vos valeurs, une release versionnée",
      noeuds: [...haut, ...bas, ...hist],
      liens: [["reg", "chart", "tire"], ["chart", "up", "templates"], ["vals", "up", "paramètre", { sortie: "h", entree: "b" }], ["up", "cl", "applique"], ["cl", "hist", "rollback", { style: "pointille", sortie: "b", entree: "h" }]],
    }),
  );
}

// GitOps
{
  const git = rangee([n("git", "Dépôt Git", "manifests par environnement", chaud)], { x: 20, y: 130 });
  const argo = rangee([n("argo", "Argo CD", "compare voulu et réel", chaud)], { x: 300, y: 130 });
  const cl = colonne([n("prod", "Cluster de production", "état réel", ok), n("secours", "Cluster de secours", "état réel", ok)], { x: 580, y: 60, gap: 90, w: 220 });
  competence(
    "gitops",
    diagramme({
      legende: "GitOps : le dépôt décrit l'état voulu, l'outil réconcilie les clusters",
      noeuds: [...git, ...argo, ...cl],
      liens: [["argo", "git", "lit", { style: "pointille" }], ["argo", "prod", "applique", { sortie: "d", entree: "g" }], ["argo", "secours", "self-heal", { sortie: "d", entree: "g" }]],
    }),
  );
}

// Installation OpenShift
competence(
  "ocp-install",
  flux({
    legende: "Installation OpenShift sans connexion (agent) : de la description au cluster",
    noeuds: [n("conf", "install-config.yaml", "décrit le cluster", chaud), n("inst", "openshift-install", "génère l'ISO agent"), n("srv", "Serveurs", "démarrent sur l'ISO"), n("cp", "Plan de contrôle", "3 nœuds, etcd", chaud), n("wk", "Workers", "rejoignent le cluster", ok)],
    etiquettes: ["lit", "ISO", "forment", "ajoutent"],
  }),
);

// Opérateurs et OLM
{
  const plat = rangee([n("cvo", "Cluster Version Operator", "pilote la plateforme", chaud), n("ops", "Opérateurs de plateforme", "réseau, console, etcd")], { x: 36, y: 60, gap: 70 });
  const opt = rangee([n("olm", "OLM", "catalogue, abonnements", chaud), n("opt", "Opérateurs optionnels", "SR-IOV, MetalLB, NMState")], { x: 36, y: 200, gap: 70 });
  const cluster = rangee([n("cl", "Cluster", "état conforme", ok)], { x: 700, y: 130 });
  competence(
    "ocp-operators",
    diagramme({
      legende: "OpenShift : des opérateurs de plateforme et des opérateurs installés par OLM",
      zones: [zone("socle", "Socle OpenShift", plat), zone("ajoutes", "Ajoutés par vous", opt, "chaud")],
      noeuds: [...plat, ...opt, ...cluster],
      liens: [["cvo", "ops", "met à jour"], ["olm", "opt", "installe"], ["ops", "cl", "configure"], ["opt", "cl", "configure"]],
    }),
  );
}

// Mises à jour OpenShift
competence(
  "ocp-upgrade",
  flux({
    legende: "Mise à jour d'un cluster : un chemin sûr, le plan de contrôle d'abord, les workers par lots",
    noeuds: [n("canal", "Canal", "stable, EUS"), n("cvo", "CVO", "choisit un chemin sûr", chaud), n("cp", "Plan de contrôle", "mis à jour en premier"), n("mcp", "MachineConfigPool", "workers par lots", chaud), n("noeud", "Nœud", "drain, redémarrage, retour", ok)],
    etiquettes: ["propose", "lance", "puis", "un lot à la fois"],
  }),
);

// Multi-cluster
{
  const git = rangee([n("git", "Git", "source de vérité")], { x: 20, y: 40 });
  const hub = rangee([n("hub", "Cluster hub", "ACM, politiques, placement", chaud)], { x: 20, y: 160 });
  const spokes = colonne([n("s1", "Site 1", "cluster géré", ok), n("s2", "Site 2", "cluster géré", ok), n("s3", "Site 3", "cluster géré", ok)], { x: 470, y: 62, gap: 30, w: 190 });
  competence(
    "ocp-multicluster",
    diagramme({
      legende: "Un hub gouverne des clusters distants : politiques, applications, santé",
      zones: [zone("sites", "Sites distants (edge)", spokes)],
      noeuds: [...git, ...hub, ...spokes],
      liens: [["git", "hub", "lit", { sortie: "b", entree: "h" }], ["hub", "s1", "politiques", { sortie: "d", entree: "g" }], ["hub", "s2", undefined, { sortie: "d", entree: "g" }], ["hub", "s3", undefined, { sortie: "d", entree: "g" }]],
    }),
  );
}

// Zero-touch provisioning
competence(
  "ztp",
  flux({
    legende: "Zero-touch : du dépôt Git à un cluster edge configuré, sans intervention sur place",
    noeuds: [n("git", "Git", "SiteConfig, politiques", chaud), n("argo", "Argo CD", "sur le hub"), n("as", "Assisted Service", "prépare l'installation"), n("bmc", "BMC", "démarre le serveur (Redfish)"), n("edge", "Serveur edge", "installe le cluster", ok), n("pol", "Politiques", "appliquées au cluster", chaud)],
    etiquettes: ["surveille", "demande", "pilote", "boote", "configure"],
  }),
);

// Telco reference design
{
  const l1 = rangee([n("upf", "UPF", "plan usager"), n("amf", "AMF", "signalisation"), n("smf", "SMF", "sessions")], { x: 36, y: 60, gap: 60 });
  const l2 = rangee([n("perf", "Performance Profile", "CPU isolés, hugepages", chaud), n("sriov", "SR-IOV", "accès direct à la carte"), n("metal", "MetalLB", "adresses de service"), n("ptp", "PTP", "synchronisation horaire")], { x: 36, y: 190, gap: 40 });
  const l3 = rangee([n("ocp", "OpenShift", "noyau temps réel, CRI-O", chaud), n("nmstate", "NMState", "réseau des nœuds")], { x: 36, y: 320, gap: 60 });
  competence(
    "ocp-rds",
    diagramme({
      legende: "Le telco reference design : trois couches au-dessus du matériel",
      zones: [zone("cnf", "Fonctions réseau (CNF)", l1, "chaud"), zone("reglages", "Réglages telco", l2), zone("plateforme", "Plateforme", l3)],
      noeuds: [...l1, ...l2, ...l3],
      liens: [["upf", "sriov", "repose sur", { sortie: "b", entree: "h" }], ["perf", "ocp", "configure", { sortie: "b", entree: "h" }]],
    }),
  );
}

// Autres distributions
competence(
  "distrib-alt",
  etoile({
    legende: "Plusieurs distributions, une même API Kubernetes",
    centre: n("k8s", "Kubernetes", "API conforme CNCF", chaud),
    voisins: [
      { cote: "h", noeud: n("sylva", "Sylva", "pile télécom ouverte"), texte: "distribution", sens: "depuis" },
      { cote: "g", noeud: n("ocp", "OpenShift", "Red Hat"), texte: "distribution", sens: "depuis" },
      { cote: "d", noeud: n("ran", "Rancher", "SUSE"), texte: "distribution", sens: "depuis" },
      { cote: "b", noeud: n("edit", "Distributions d'éditeurs", "Nokia, Ericsson"), texte: "distribution", sens: "depuis" },
    ],
  }),
);

// Dépannage Kubernetes
competence(
  "k8s-troubleshoot",
  flux({
    legende: "Dépanner Kubernetes : du symptôme à la cause, couche par couche",
    noeuds: [n("sympt", "Symptôme", "Pending, CrashLoopBackOff", faible), n("desc", "Événements", "kubectl describe"), n("logs", "Journaux", "kubectl logs --previous"), n("noeud", "Nœud", "conditions, kubelet"), n("reseau", "Réseau", "DNS, Service, NetworkPolicy"), n("cp", "Plan de contrôle", "API, etcd, scheduler", chaud)],
    etiquettes: ["d'abord", "puis", "si sain", "si sain", "en dernier"],
  }),
);

// Exigences d'une fonction réseau
competence(
  "cnf-exigences",
  etoile({
    legende: "Ce qu'une fonction réseau exige de la plateforme",
    centre: n("cnf", "Fonction réseau (CNF)", "UPF, SMF, AMF…", chaud),
    voisins: [
      { cote: "h", noeud: n("reseau", "Réseau", "interfaces secondaires, SCTP"), texte: "exige" },
      { cote: "g", noeud: n("res", "Ressources", "CPU exclusifs, hugepages"), texte: "exige", sens: "depuis" },
      { cote: "d", noeud: n("secu", "Sécurité", "privilèges, droits"), texte: "exige" },
      { cote: "b", noeud: n("expl", "Exploitation", "sondes, budget d'interruption"), texte: "exige" },
    ],
  }),
);

// UPF distribué et edge
{
  const ran = rangee([n("ran", "RAN (gNB)", "radio locale")], { x: 20, y: 200 });
  const central = rangee([n("amf", "AMF", "accès, mobilité"), n("smf", "SMF", "sessions")], { x: 300, y: 60, gap: 70 });
  const edge = rangee([n("upf", "UPF edge", "plan usager local", chaud), n("mec", "Application locale", "MEC, accès local", ok)], { x: 300, y: 220, gap: 70 });
  competence(
    "upf-edge",
    diagramme({
      legende: "UPF distribué : la signalisation reste au centre, le trafic utilisateur reste local",
      zones: [zone("central", "Cœur central (région)", central), zone("site", "Site edge", edge, "chaud")],
      noeuds: [...ran, ...central, ...edge],
      liens: [["ran", "amf", "N2", { sortie: "h", entree: "g" }], ["smf", "upf", "N4 · PFCP", { sortie: "b", entree: "h" }], ["ran", "upf", "N3 · GTP-U"], ["upf", "mec", "N6"]],
    }),
  );
}

// Maintenance d'un nœud
competence(
  "capacite-noeuds",
  flux({
    legende: "Maintenance d'un nœud : cordon, drain, intervention, retour",
    noeuds: [n("cordon", "Cordon", "plus de nouveaux pods"), n("drain", "Drain", "évince les pods", chaud), n("maint", "Intervention", "mise à jour, redémarrage"), n("uncordon", "Uncordon", "le nœud reprend la charge", ok)],
    etiquettes: ["puis", "puis", "puis"],
    extra: [],
  }),
);

// ───────────── Réseau ─────────────

// CNI
{
  const a = rangee([n("poda", "Pod A", "eth0, IP éphémère"), n("ovna", "OVN-Kubernetes", "CNI : IP, routes, ACL", chaud)], { x: 36, y: 60, gap: 50 });
  const b = rangee([n("ovnb", "OVN-Kubernetes", "CNI : IP, routes, ACL", chaud), n("podb", "Pod B", "eth0, IP éphémère")], { x: 480, y: 60, gap: 50 });
  const np = rangee([n("np", "NetworkPolicy", "traduite en règles OVN", froid)], { x: 270, y: 210 });
  competence(
    "cni",
    diagramme({
      legende: "Le CNI donne une interface et une IP à chaque pod, et applique les NetworkPolicy",
      zones: [zone("na", "Nœud A", a), zone("nb", "Nœud B", b)],
      noeuds: [...a, ...b, ...np],
      liens: [["poda", "ovna", "veth"], ["ovna", "ovnb", "Geneve", { sens: "double" }], ["ovnb", "podb", "veth"], ["np", "ovna", "ACL", { style: "pointille", sortie: "h", entree: "b" }]],
    }),
  );
}

// Multus
{
  const pod = rangee([n("pod", "Pod CNF", "annotation k8s.v1.cni…", chaud)], { x: 20, y: 160 });
  const multus = rangee([n("multus", "Multus", "méta-plugin CNI")], { x: 290, y: 160 });
  const cni = colonne([n("ovn", "CNI par défaut", "eth0 : réseau du cluster"), n("sriov", "CNI secondaire", "net1 : macvlan, SR-IOV", froid)], { x: 560, y: 90, gap: 100, w: 230 });
  const nad = rangee([n("nad", "NetworkAttachmentDefinition", "décrit le réseau secondaire", froid)], { x: 470, y: 350 });
  competence(
    "multus",
    diagramme({
      legende: "Multus attache plusieurs interfaces à un pod",
      noeuds: [...pod, ...multus, ...cni, ...nad.map((k) => ({ ...k, w: 330 }))],
      liens: [["pod", "multus", "demande"], ["multus", "ovn", "eth0"], ["multus", "sriov", "net1"], ["nad", "sriov", "configure", { style: "pointille", sortie: "h", entree: "b" }]],
    }),
  );
}

// SR-IOV
{
  const op = rangee([n("op", "Opérateur SR-IOV", "configure les VF", chaud)], { x: 20, y: 30 });
  const nic = rangee([n("pf", "Carte réseau (PF)", "fonction physique")], { x: 20, y: 200 });
  const vfs = colonne([n("vf1", "VF 1", "fonction virtuelle", froid), n("vf2", "VF 2", "fonction virtuelle", froid)], { x: 300, y: 150, gap: 40, w: 170 });
  const pods = colonne([n("upf", "Pod UPF", "accès direct à la VF", chaud), n("autre", "Autre pod", "VF dédiée", ok)], { x: 560, y: 150, gap: 40, w: 190 });
  const sw = rangee([n("sw", "Commutateur", "VLAN du plan data")], { x: 20, y: 340 });
  competence(
    "sriov",
    diagramme({
      legende: "SR-IOV : une carte physique, des fonctions virtuelles données directement aux pods",
      zones: [zone("serveur", "Serveur", [...nic, ...vfs, ...pods])],
      noeuds: [...op, ...sw, ...nic, ...vfs, ...pods],
      liens: [["op", "pf", "configure", { sortie: "b", entree: "h" }], ["pf", "vf1", "crée"], ["pf", "vf2"], ["vf1", "upf", "sans noyau"], ["vf2", "autre"], ["sw", "pf", "VLAN", { sortie: "h", entree: "b" }]],
    }),
  );
}

// DPDK
{
  const a = rangee([n("p1", "Paquet", "arrive sur la carte"), n("drv", "Pilote noyau", "interruptions"), n("pile", "Pile réseau Linux", "copies mémoire"), n("app1", "Application", "reçoit le paquet", faible)], { x: 36, y: 60, gap: 50 });
  const b = rangee([n("p2", "Paquet", "arrive sur la carte"), n("vf", "VF SR-IOV", "accès direct"), n("dpdk", "DPDK", "interrogation en continu", chaud), n("app2", "Application", "hugepages, CPU isolés", ok)], { x: 36, y: 220, gap: 50 });
  competence(
    "dpdk",
    diagramme({
      legende: "Deux chemins pour un paquet : par le noyau, ou directement dans l'application avec DPDK",
      zones: [zone("chemin-noyau", "Chemin noyau", a), zone("chemin-dpdk", "Chemin DPDK", b, "chaud")],
      noeuds: [...a, ...b],
      liens: [["p1", "drv"], ["drv", "pile"], ["pile", "app1"], ["p2", "vf"], ["vf", "dpdk", "poll mode"], ["dpdk", "app2"]],
    }),
  );
}

// MetalLB et BGP
{
  const client = rangee([n("client", "Client", "vers 10.20.0.10")], { x: 20, y: 150 });
  const routeur = rangee([n("routeur", "Routeur ToR", "BGP, ECMP", chaud)], { x: 220, y: 150 });
  const speakers = colonne([n("sp1", "Speaker MetalLB", "nœud 1", froid), n("sp2", "Speaker MetalLB", "nœud 2", froid), n("sp3", "Speaker MetalLB", "nœud 3", froid)], { x: 470, y: 62, gap: 24, w: 190 });
  const svc = rangee([n("svc", "Service LoadBalancer", "10.20.0.10", { ...ok, largeur: 170 })], { x: 700, y: 150 });
  competence(
    "lb-bgp",
    diagramme({
      legende: "MetalLB annonce l'adresse du Service en BGP : le routeur répartit entre les nœuds",
      zones: [zone("cluster", "Cluster", speakers)],
      noeuds: [...client, ...routeur, ...speakers, ...svc],
      liens: [["client", "routeur", "trafic"], ["sp1", "routeur", "annonce l'IP", { sortie: "g", entree: "d", decalageEntree: -20 }], ["sp2", "routeur", undefined, { sortie: "g", entree: "d" }], ["sp3", "routeur", undefined, { sortie: "g", entree: "d", decalageEntree: 20 }], ["sp2", "svc", "vers les pods", { sortie: "d", entree: "g" }]],
    }),
  );
}

// Flux telco
{
  const ran = rangee([n("ran", "RAN (gNB)", "radio")], { x: 20, y: 150 });
  const amf = rangee([n("amf", "AMF", "signalisation")], { x: 360, y: 40 });
  const smf = rangee([n("smf", "SMF", "sessions")], { x: 700, y: 150 });
  const upf = rangee([n("upf", "UPF", "plan usager", chaud)], { x: 360, y: 260 });
  competence(
    "sctp-flux",
    diagramme({
      legende: "Quatre protocoles de transport, quatre besoins réseau différents",
      noeuds: [...ran, ...amf, ...smf, ...upf],
      liens: [["ran", "amf", "N2 · SCTP 38412"], ["ran", "upf", "N3 · GTP-U UDP 2152"], ["amf", "smf", "HTTP/2 · TCP"], ["smf", "upf", "N4 · PFCP UDP 8805"]],
    }),
  );
}

// Réseaux d'une plateforme
{
  const noeud = colonne([n("nic1", "Interface 1", "gestion et API"), n("nic2", "Interface 2", "stockage"), n("nic3", "Interface 3 (SR-IOV)", "plan data", chaud), n("bmc", "BMC", "pilotage hors bande")], { x: 36, y: 60, gap: 30, w: 220 });
  const reseaux = colonne([n("r1", "Réseau de gestion", "API, nœuds"), n("r2", "Réseau de stockage", "Ceph, réplication"), n("r3", "Réseau de données", "VLAN des CNF", chaud), n("r4", "Réseau hors bande", "OOB")], { x: 440, y: 60, gap: 30, w: 220 });
  competence(
    "archi-reseau-support",
    diagramme({
      legende: "Les réseaux d'une plateforme telco : un nœud, plusieurs interfaces, un réseau par usage",
      zones: [zone("noeud", "Nœud de calcul", noeud)],
      noeuds: [...noeud, ...reseaux],
      liens: [["nic1", "r1"], ["nic2", "r2"], ["nic3", "r3", "VLAN"], ["bmc", "r4"]],
    }),
  );
}

// Pièges réseau : MTU
competence(
  "pieges-reseau",
  flux({
    legende: "Le piège de la MTU : une encapsulation ajoute des octets, le paquet ne passe plus",
    noeuds: [n("pod", "Pod", "paquet de la taille de sa MTU"), n("enc", "Encapsulation", "ajoute un en-tête", chaud), n("nic", "Carte et commutateurs", "MTU du support"), n("res", "Résultat", "fragmentation ou perte", faible)],
    etiquettes: ["envoie", "traverse", "si trop grand"],
  }),
);

// Dépannage réseau telco
competence(
  "depannage-reseau-telco",
  flux({
    legende: "Dépanner le réseau d'une plateforme telco : du lien jusqu'au protocole",
    noeuds: [n("sympt", "Symptôme", "l'association N2 ne monte pas", faible), n("lien", "Interface", "ip link : VLAN, MTU"), n("route", "Routage", "ip route, BGP"), n("pod", "Pod", "NetworkPolicy, Multus"), n("proto", "Protocole", "tcpdump, association SCTP", chaud)],
    etiquettes: ["d'abord", "puis", "puis", "enfin"],
  }),
);

// ───────────── Stockage ─────────────

// Ceph et Rook
competence(
  "ceph",
  flux({
    legende: "Ceph piloté par Rook : de l'opérateur au volume du pod",
    noeuds: [n("rook", "Rook", "déploie et surveille", chaud), n("ceph", "Cluster Ceph", "MON, MGR, OSD"), n("pool", "Pool", "réplication ×3"), n("sc", "StorageClass", "RBD, CephFS"), n("pvc", "PVC", "demande du pod"), n("pod", "Pod", "monte le volume", ok)],
    etiquettes: ["crée", "stocke", "expose", "répond à", "monté par"],
  }),
);

// Sauvegarde et réplication inter-sites
{
  const a = rangee([n("ca", "Cluster A", "applications", ok), n("va", "Volumes A", "données", chaud)], { x: 36, y: 60, gap: 70 });
  const b = rangee([n("vb", "Volumes B", "réplicas", chaud), n("cb", "Cluster B", "prêt à reprendre", faible)], { x: 480, y: 60, gap: 70 });
  const obj = rangee([n("obj", "Stockage objet", "sauvegardes hors site", froid)], { x: 270, y: 230 });
  competence(
    "stockage-dr",
    diagramme({
      legende: "Deux sites : réplication des volumes, sauvegardes hors site",
      zones: [zone("sa", "Site A", a), zone("sb", "Site B", b)],
      noeuds: [...a, ...b, ...obj],
      liens: [["va", "vb", "réplication"], ["ca", "va", "écrit"], ["vb", "cb", "reprise"], ["va", "obj", "sauvegarde", { sortie: "b", entree: "h" }], ["obj", "vb", "restaure", { style: "pointille", sortie: "h", entree: "b" }]],
    }),
  );
}

// KubeVirt
{
  const vm = rangee([n("vmcr", "VirtualMachine", "objet décrivant la VM", chaud), n("virt", "virt-controller", "crée le pod")], { x: 20, y: 60, gap: 60 });
  const pod = colonne([n("pvc", "PVC", "disque de la VM", froid), n("qemu", "QEMU / KVM", "exécute la VM", ok), n("net", "Réseau secondaire", "Multus, VLAN", froid)], { x: 560, y: 80, gap: 24, w: 220 });
  competence(
    "kubevirt",
    diagramme({
      legende: "KubeVirt : une VM tourne dans un pod, avec un disque et un réseau Kubernetes",
      zones: [zone("launcher", "Pod virt-launcher", pod, "chaud")],
      noeuds: [...vm, ...pod],
      liens: [["vmcr", "virt", "observe"], ["virt", "qemu", "lance", { sortie: "d", entree: "g" }], ["pvc", "qemu", "disque", { sortie: "b", entree: "h" }], ["net", "qemu", "réseau", { sortie: "h", entree: "b" }]],
    }),
  );
}

// OpenStack
{
  const services = rangee([n("keystone", "Keystone", "identité"), n("nova", "Nova", "machines virtuelles", chaud), n("neutron", "Neutron", "réseau"), n("cinder", "Cinder", "volumes"), n("glance", "Glance", "images")], { x: 36, y: 60, gap: 24, w: 140 });
  const vnf = rangee([n("vnf", "VNF", "fonction réseau en VM", faible)], { y: 210 });
  centrer(vnf, "vnf", services[1].x + services[1].w / 2);
  const cnf = rangee([n("cnf", "CNF sur Kubernetes", "fonction réseau en conteneurs", ok)], { y: 210 });
  centrer(cnf, "cnf", services[3].x + services[3].w / 2 + 60);
  competence(
    "openstack",
    diagramme({
      legende: "OpenStack : des services pour héberger des VNF, avant la migration vers des CNF",
      zones: [zone("openstack", "OpenStack", services)],
      noeuds: [...services, ...vnf, ...cnf],
      liens: [["nova", "vnf", "héberge", { sortie: "b", entree: "h" }], ["vnf", "cnf", "migration", { style: "pointille" }]],
    }),
  );
}

// ETSI NFV
{
  const gestion = rangee([n("nfvo", "NFVO", "orchestre les services", chaud), n("vnfm", "VNFM", "gère le cycle de vie des VNF"), n("vim", "VIM", "OpenStack ou Kubernetes")], { x: 36, y: 60, gap: 70 });
  const bas = rangee([n("vnf", "VNF ou CNF", "la fonction réseau", ok)], { y: 220 });
  centrer(bas, "vnf", gestion[1].x + gestion[1].w / 2);
  const infra = rangee([n("nfvi", "NFVI", "calcul, réseau, stockage", froid)], { y: 220 });
  centrer(infra, "nfvi", gestion[2].x + gestion[2].w / 2);
  competence(
    "nfv-etsi",
    diagramme({
      legende: "L'architecture ETSI NFV : orchestration, gestion de VNF, gestion d'infrastructure",
      noeuds: [...gestion, ...bas, ...infra],
      liens: [["nfvo", "vnfm", "Or-Vnfm"], ["vnfm", "vim", "Vi-Vnfm"], ["vnfm", "vnf", "Ve-Vnfm", { sortie: "b", entree: "h" }], ["vim", "nfvi", "Nf-Vi", { sortie: "b", entree: "h" }], ["nfvo", "vim", "Or-Vi", { sortie: "h", entree: "h" }]],
    }),
  );
}

// ───────────── Performance ─────────────

// Hugepages et NUMA
{
  const n0 = rangee([n("cpu0", "CPU exclusifs", "cœurs 0 à 15", chaud), n("hp0", "Hugepages", "1 Gio réservées", ok), n("nic0", "Carte SR-IOV", "branchée sur NUMA 0", froid)], { x: 36, y: 60, gap: 40 });
  const n1 = rangee([n("cpu1", "CPU partagés", "cœurs 16 à 31"), n("mem1", "Mémoire", "accès plus lent depuis NUMA 0", faible)], { x: 36, y: 220, gap: 40 });
  competence(
    "perf-hugepages",
    diagramme({
      legende: "NUMA : tout ce que le plan usager utilise doit rester sur le même nœud NUMA",
      zones: [zone("numa0", "NUMA 0 : plan usager", n0, "chaud"), zone("numa1", "NUMA 1 : reste du nœud", n1)],
      noeuds: [...n0, ...n1],
      liens: [["cpu0", "hp0", "mémoire locale"], ["hp0", "nic0", "même NUMA"], ["cpu0", "mem1", "accès distant", { style: "pointille", sortie: "b", entree: "h" }]],
    }),
  );
}

// Performance profile
{
  const prof = rangee([n("pp", "PerformanceProfile", "isolés, réservés, hugepages", chaud)], { x: 20, y: 150, largeur: 220 });
  const nto = rangee([n("nto", "Node Tuning Operator", "génère la configuration")], { x: 310, y: 150, largeur: 200 });
  const sortie = colonne([n("mc", "MachineConfig", "noyau temps réel, hugepages"), n("kub", "Kubelet", "CPU Manager static, Topology Manager"), n("tuned", "Tuned", "réglages du noyau")], { x: 580, y: 62, gap: 30, w: 270 });
  competence(
    "perf-profile",
    diagramme({
      legende: "Un seul objet décrit le réglage du nœud ; l'opérateur le traduit en configuration",
      noeuds: [...prof, ...nto, ...sortie],
      liens: [["pp", "nto", "lit"], ["nto", "mc", "crée", { sortie: "d", entree: "g" }], ["nto", "kub", "crée", { sortie: "d", entree: "g" }], ["nto", "tuned", "crée", { sortie: "d", entree: "g" }]],
    }),
  );
}

// Dimensionnement d'un cluster
competence(
  "dimensionnement",
  flux({
    legende: "Dimensionner : du besoin de trafic au nombre de nœuds, puis validation par un test de charge",
    noeuds: [n("besoin", "Besoin", "abonnés, débit, sessions"), n("modele", "Modèle par fonction", "capacité d'une instance", chaud), n("res", "Ressources", "vCPU, mémoire, hugepages"), n("noeuds", "Nombre de nœuds", "plus la marge N+1"), n("test", "Test de charge", "valide ou corrige", ok)],
    etiquettes: ["se traduit en", "donne", "multiplié par", "vérifié par"],
  }),
);

// Valider un dimensionnement
competence(
  "bench-dimensionnement",
  flux({
    legende: "Valider un dimensionnement : générer du trafic, mesurer, comparer aux seuils",
    noeuds: [n("gen", "Générateur", "RAN et UE simulés"), n("cnf", "Fonction sous test", "la charge réelle", chaud), n("mesure", "Mesures", "latence, pertes, CPU"), n("seuils", "Seuils (SLO)", "ce qui est acceptable"), n("verdict", "Verdict", "ajuster les ressources", ok)],
    etiquettes: ["envoie du trafic", "exporte", "comparées à", "décide"],
    extra: [["verdict", "cnf", "nouveau test", { style: "pointille", sortie: "h", entree: "h" }]],
  }),
);

console.log("Lot 2 : diagrammes dessinés.");
