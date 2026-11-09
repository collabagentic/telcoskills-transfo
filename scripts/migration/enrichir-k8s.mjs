// Enrichit la compétence « Architecture Kubernetes » (k8s-archi) : historique, cas d'usage, schéma de base.
// Exemple de référence pour les autres compétences. Chaque élément a sa source ; tout reste en brouillon, à relire.
// Usage : node scripts/migration/enrichir-k8s.mjs
import fs from "node:fs";
import path from "node:path";

const fichier = path.join(import.meta.dirname, "..", "..", "content", "competences", "kubernetes.json");
const liste = JSON.parse(fs.readFileSync(fichier, "utf8"));
const k8s = liste.find((c) => c.id === "k8s-archi");
if (!k8s) throw new Error("k8s-archi introuvable");

const DOCS = "https://kubernetes.io/docs/";
k8s.chronologie = [
  {
    periode: "Avant 2014",
    evenement: "Google fait tourner ses applications en conteneurs depuis plus de dix ans, avec ses systèmes internes Borg puis Omega : c'est l'expérience dont Kubernetes est issu.",
    source: { nom: "ACM Queue : Borg, Omega, and Kubernetes", url: "https://queue.acm.org/detail.cfm?id=2898444" },
  },
  {
    periode: "2014",
    evenement: "Google publie Kubernetes en open source. On passe des serveurs physiques aux machines virtuelles, puis aux conteneurs : c'est le chemin que votre métier suit aujourd'hui.",
    source: { nom: "Kubernetes : vue d'ensemble", url: DOCS + "concepts/overview/" },
  },
  {
    periode: "Mars 2016",
    evenement: "Le projet rejoint la Cloud Native Computing Foundation (CNCF), qui devient sa maison neutre.",
    source: { nom: "CNCF : projet Kubernetes", url: "https://www.cncf.io/projects/kubernetes/" },
  },
  {
    periode: "Mars 2018",
    evenement: "Kubernetes est le premier projet de la CNCF à obtenir le statut « graduated » : un projet mûr, gouverné ouvertement.",
    source: { nom: "CNCF : Kubernetes, premier projet à obtenir le statut graduated", url: "https://www.cncf.io/announcement/2018/03/06/cloud-native-computing-foundation-announces-kubernetes-first-to-graduate/" },
  },
  {
    periode: "2022",
    evenement: "L'enquête telco de la CNCF montre que les fonctions réseau sur Kubernetes arrivent chez les opérateurs, avec l'interopérabilité et la portabilité en priorité.",
    source: {
      nom: "CNCF : micro-enquête telco",
      url: "https://www.cncf.io/blog/2022/08/02/cncf-telco-microsurvey-cloud-native-network-functions-with-kubernetes-are-coming-but-interoperability-and-portability-are-priorities",
    },
  },
];

k8s.casUsage = [
  {
    titre: "Remplacer la machine qu'on soigne par le pod qu'on remplace",
    texte: "Un service tourne en plusieurs pods identiques. Si un conteneur tombe, Kubernetes le redémarre ; si un nœud tombe, il replanifie les pods ailleurs, sans intervention.",
    source: { nom: "Kubernetes : vue d'ensemble (auto-réparation)", url: DOCS + "concepts/overview/" },
  },
  {
    titre: "Mettre à jour sans coupure, revenir en arrière",
    texte: "Un Deployment remplace progressivement les anciens pods par les nouveaux, et peut revenir à la version précédente si la mise à jour se passe mal.",
    source: { nom: "Kubernetes : Deployments", url: DOCS + "concepts/workloads/controllers/deployment/" },
  },
  {
    titre: "Héberger une fonction du cœur 5G",
    texte: "Les opérateurs déploient des fonctions réseau conteneurisées (CNF) sur Kubernetes. Le réseau, l'interopérabilité et la portabilité y sont les sujets qui décident.",
    source: {
      nom: "CNCF : micro-enquête telco",
      url: "https://www.cncf.io/blog/2022/08/02/cncf-telco-microsurvey-cloud-native-network-functions-with-kubernetes-are-coming-but-interoperability-and-portability-are-priorities",
    },
  },
];

// Le schéma de base est un vrai diagramme : voir scripts/migration/diagrammes.mjs
// Les sources du schéma de base : composants d'un cluster (kubernetes.io/docs/concepts/overview/components/)
fs.writeFileSync(fichier, JSON.stringify(liste, null, 2) + "\n");
console.log("k8s-archi enrichie :", k8s.chronologie.length, "jalons,", k8s.casUsage.length, "cas d'usage, schéma de base.");
