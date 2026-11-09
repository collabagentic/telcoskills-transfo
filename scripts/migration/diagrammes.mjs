// Dessine les premiers vrais diagrammes d'architecture (coordonnées écrites à la main, contrôlées par le build : règle 15).
// Usage : node scripts/migration/diagrammes.mjs
import fs from "node:fs";
import path from "node:path";

const contenu = path.join(import.meta.dirname, "..", "..", "content");
const K8S = "https://kubernetes.io/docs/";
const n = (id, texte, detail, x, y, w, h, extra = {}) => ({ id, texte, ...(detail ? { detail } : {}), x, y, w, h, ...extra });

const DIAGRAMMES = {
  // Compétence : architecture Kubernetes
  "competences/kubernetes.json#k8s-archi": {
    legende: "Architecture d'un cluster Kubernetes : plan de contrôle et nœud de calcul",
    largeur: 760,
    hauteur: 420,
    zones: [
      { id: "plan-controle", titre: "Plan de contrôle", x: 150, y: 20, w: 340, h: 380 },
      { id: "noeud", titre: "Nœud de calcul", x: 530, y: 20, w: 210, h: 380 },
    ],
    noeuds: [
      n("vous", "Vous", "kubectl, GitOps", 20, 150, 110, 54),
      n("sched", "Scheduler", "choisit le nœud", 170, 60, 130, 54, { zone: "plan-controle" }),
      n("ctrl", "Contrôleurs", "réconcilient", 170, 240, 130, 54, { zone: "plan-controle" }),
      n("api", "API server", "point d'entrée unique", 320, 150, 150, 54, { zone: "plan-controle", ton: "chaud" }),
      n("etcd", "etcd", "état du cluster", 335, 56, 120, 60, { zone: "plan-controle", ton: "froid", forme: "base" }),
      n("proxy", "kube-proxy", "réseau des Services", 550, 56, 170, 54, { zone: "noeud" }),
      n("kubelet", "kubelet", "démarre et suit les pods", 550, 150, 170, 54, { zone: "noeud", ton: "chaud" }),
      n("runtime", "Runtime", "containerd, CRI-O", 550, 240, 170, 54, { zone: "noeud" }),
      n("pods", "Pods", "vos charges de travail", 550, 326, 170, 54, { zone: "noeud", ton: "ok" }),
    ],
    liens: [
      { de: "vous", vers: "api", texte: "HTTPS" },
      { de: "sched", vers: "api", decalageEntree: -12 },
      { de: "ctrl", vers: "api", decalageEntree: 12 },
      { de: "api", vers: "etcd", sens: "double" },
      { de: "api", vers: "kubelet", texte: "ordres" },
      { de: "kubelet", vers: "runtime", texte: "CRI" },
      { de: "runtime", vers: "pods" },
    ],
    source: { nom: "Kubernetes : composants d'un cluster", url: K8S + "concepts/overview/components/" },
  },

  // Fiche : la boucle de réconciliation
  "fiches/reconciliation.json": {
    legende: "La boucle de réconciliation : l'état voulu contre l'état réel",
    largeur: 760,
    hauteur: 260,
    zones: [{ id: "boucle", titre: "Boucle de réconciliation", x: 220, y: 130, w: 480, h: 100, ton: "chaud" }],
    noeuds: [
      n("vous", "Vous", "déclarez le voulu", 20, 120, 130, 56),
      n("api", "API server", "stocke l'état voulu", 240, 40, 160, 56),
      n("ctrl", "Contrôleur", "compare voulu et réel", 240, 160, 160, 56, { zone: "boucle", ton: "chaud" }),
      n("reel", "État réel", "pods, nœuds, volumes", 500, 160, 180, 56, { zone: "boucle", ton: "ok" }),
    ],
    liens: [
      { de: "vous", vers: "api", texte: "apply" },
      { de: "api", vers: "ctrl", texte: "watch" },
      { de: "ctrl", vers: "reel", sens: "double", texte: "observe, agit" },
    ],
    source: { nom: "Kubernetes : contrôleurs", url: K8S + "concepts/architecture/controller/" },
  },

  // Fiche : les deux plans de réseau d'un cluster
  "fiches/vlan-reseaux-cluster.json": {
    legende: "Deux plans de réseau pour un même pod : primaire et secondaire",
    largeur: 760,
    hauteur: 340,
    zones: [{ id: "noeud", titre: "Nœud OpenShift", x: 20, y: 20, w: 470, h: 300 }],
    noeuds: [
      n("pod", "Pod CNF", "eth0 et net1", 40, 130, 150, 70, { zone: "noeud", ton: "chaud" }),
      n("ovn", "Réseau primaire", "OVN-Kubernetes", 270, 50, 200, 60, { zone: "noeud" }),
      n("multus", "Réseau secondaire", "Multus + SR-IOV (VF)", 270, 230, 200, 60, { zone: "noeud", ton: "froid" }),
      n("services", "Autres pods, Services", "règles par labels", 560, 50, 180, 60),
      n("commutateur", "Commutateur", "VLAN, MTU, plan data", 560, 230, 180, 60, { ton: "froid" }),
    ],
    liens: [
      { de: "pod", vers: "ovn", texte: "eth0" },
      { de: "pod", vers: "multus", texte: "net1" },
      { de: "ovn", vers: "services", texte: "signalisation" },
      { de: "multus", vers: "commutateur", texte: "VLAN" },
    ],
    source: {
      nom: "Red Hat, OpenShift 4.20 : telco core reference design",
      url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/scalability_and_performance/telco-core-ref-design-specs",
    },
  },

  // Fiche : NetworkPolicy
  "fiches/matrice-networkpolicy.json": {
    legende: "Une NetworkPolicy autorise des flux par labels, le reste est refusé",
    largeur: 760,
    hauteur: 320,
    zones: [{ id: "ns", titre: "Namespace 5gc", x: 300, y: 20, w: 440, h: 280, ton: "chaud" }],
    noeuds: [
      n("ran", "Pods passerelle RAN", "label role=ran-gw", 20, 60, 170, 56),
      n("autres", "Autres pods", "sans le bon label", 20, 200, 170, 56, { ton: "faible" }),
      n("policy", "NetworkPolicy", "autorise SCTP 38412", 530, 50, 180, 60, { zone: "ns", ton: "chaud" }),
      n("amf", "Pods AMF", "label app=amf", 530, 180, 180, 64, { zone: "ns", ton: "ok" }),
    ],
    liens: [
      { de: "ran", vers: "amf", texte: "SCTP 38412", decalageEntree: -10 },
      { de: "autres", vers: "amf", texte: "refusé", style: "pointille", decalageEntree: 10 },
      { de: "policy", vers: "amf", texte: "protège" },
    ],
    source: { nom: "Kubernetes : Network Policies", url: K8S + "concepts/services-networking/network-policies/" },
  },

  // Fiche : interfaces du cœur 5G
  "fiches/interfaces-sbi.json": {
    legende: "Le cœur 5G : interfaces de service (SBI) et points de référence",
    largeur: 800,
    hauteur: 350,
    zones: [{ id: "sbi", titre: "Interfaces de service (HTTP/2 + JSON)", x: 260, y: 20, w: 420, h: 190 }],
    noeuds: [
      n("ran", "RAN (gNB)", "radio", 20, 95, 110, 56),
      n("amf", "AMF", "accès, mobilité", 280, 70, 110, 56, { zone: "sbi" }),
      n("smf", "SMF", "sessions PDU", 550, 70, 110, 56, { zone: "sbi" }),
      n("nrf", "NRF", "annuaire", 395, 140, 120, 56, { zone: "sbi", ton: "froid" }),
      n("upf", "UPF", "plan usager", 570, 270, 110, 56, { ton: "chaud" }),
    ],
    liens: [
      { de: "ran", vers: "amf", texte: "N2 · SCTP" },
      { de: "amf", vers: "smf", texte: "N11 · HTTP/2" },
      { de: "amf", vers: "nrf", texte: "Nnrf", sortie: "b", entree: "g" },
      { de: "smf", vers: "nrf", texte: "Nnrf", sortie: "b", entree: "d", decalageSortie: -20 },
      { de: "smf", vers: "upf", texte: "N4 · PFCP", sortie: "b", entree: "h", decalageSortie: 20 },
      { de: "ran", vers: "upf", texte: "N3 · GTP-U", sortie: "b", entree: "g" },
    ],
    source: { nom: "3GPP TS 23.501 : architecture du système 5G", url: "https://www.3gpp.org/ftp/Specs/archive/23_series/23.501/" },
  },

  // Fiche : PRA et GitOps
  "fiches/pra-gitops.json": {
    legende: "GitOps : l'état voulu est dans Git, le cluster se reconstruit depuis lui",
    largeur: 760,
    hauteur: 300,
    zones: [],
    noeuds: [
      n("vous", "Vous", "pull request", 20, 100, 120, 56),
      n("git", "Dépôt Git", "état voulu", 190, 100, 150, 56, { ton: "chaud" }),
      n("gitops", "Outil GitOps", "Argo CD, Flux", 400, 100, 150, 56),
      n("cluster", "Cluster", "état réel", 610, 100, 130, 56, { ton: "ok" }),
      n("sauvegardes", "Sauvegardes", "etcd, données, secrets", 400, 210, 150, 60, { ton: "froid", forme: "base" }),
    ],
    liens: [
      { de: "vous", vers: "git", texte: "fusion" },
      { de: "gitops", vers: "git", texte: "lit", style: "pointille" },
      { de: "gitops", vers: "cluster", texte: "applique" },
      { de: "sauvegardes", vers: "cluster", texte: "restaure", style: "pointille", sortie: "d", entree: "b" },
    ],
    source: { nom: "OpenGitOps : principes", url: "https://opengitops.dev/" },
  },
};

for (const [cle, diagramme] of Object.entries(DIAGRAMMES)) {
  const [fichier, id] = cle.split("#");
  const chemin = path.join(contenu, fichier);
  const brut = JSON.parse(fs.readFileSync(chemin, "utf8"));
  if (id) {
    const c = brut.find((x) => x.id === id);
    if (!c) throw new Error(`Compétence introuvable : ${id}`);
    delete c.schemaBase;
    c.diagramme = diagramme;
    fs.writeFileSync(chemin, JSON.stringify(brut, null, 2) + "\n");
  } else {
    const rangee = {};
    for (const [k, v] of Object.entries(brut)) {
      if (k === "diagramme") continue;
      rangee[k] = v;
      if (k === "schema") rangee.diagramme = diagramme;
    }
    fs.writeFileSync(chemin, JSON.stringify(rangee, null, 2) + "\n");
  }
}
console.log("Diagrammes dessinés :", Object.keys(DIAGRAMMES).length);
