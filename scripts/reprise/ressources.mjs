// Reprise unique des ressources d'apprentissage de l'ancien dépôt (lecture seule) vers « plusLoin » des fiches.
// Usage : node scripts/reprise/ressources.mjs <chemin de telcocloud-roadmaps>
// Règle éditoriale reprise : le gratuit d'abord, le français avant l'anglais ; le payant seulement sans équivalent gratuit.
import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Passer en argument le chemin de l'ancien dépôt (telcocloud-roadmaps).");

// fiche → nœuds de l'ancien dépôt (table de correspondance écrite à la main)
const NOEUDS = {
  "vlan-reseaux-cluster": ["multus", "sriov", "cni", "pieges-reseau"],
  "matrice-networkpolicy": ["sec-reseau", "cni"],
  "pra-gitops": ["pra-rpo-rto", "gitops", "stockage-dr"],
  "changement-pr": ["git-ci", "gitops", "gestion-changement", "ci-cd-integration"],
  "vm-pod": ["conteneurs", "k8s-workloads", "kubevirt"],
  "actif-passif-replicas": ["k8s-workloads", "resilience-nf", "tel-exigences-continuite"],
  "acces-rbac": ["k8s-rbac", "sec-secrets"],
  reconciliation: ["k8s-archi"],
  operateurs: ["ocp-operators", "operators-dev"],
  "supervision-prometheus": ["obs-metrics", "alerting-utile", "obs-dash", "sondes"],
  "observabilite-traces": ["obs-telemetry", "traces"],
  "interfaces-sbi": ["sbi-http2", "5g-sba", "archi-5g"],
  "appliance-cnf": ["helm-cnf", "cnf-onboarding", "helm", "cnf-ops"],
  "dimensionnement-ressources": ["perf-hugepages", "perf-profile", "bench-dimensionnement", "capacite-noeuds"],
  "ao-exigences-cnf": ["cnf-exigences", "evaluation-fournisseurs"],
  "dossier-archi-code": ["adr", "hld-lld"],
  "cmdb-git": ["gitops", "config-nf"],
  "patch-images": ["sec-supply", "gestion-vulns", "ocp-upgrade"],
  "lb-services": ["k8s-services", "lb-bgp"],
  "chiffrage-slo": ["sre-slo", "cout-energie", "capacite"],
  "plateforme-produit": ["cycle-vie-plateforme", "toil", "runbooks"],
};

const brut = JSON.parse(fs.readFileSync(path.join(source, "content", "ressources", "apprentissage.json"), "utf8"));
const ressources = brut.ressources ?? Object.values(brut).find(Array.isArray);
const TYPE = { cours: "cours", video: "video", doc: "doc" };
const ACCES = { gratuit: 0, freemium: 1, payant: 2 };
const dossier = path.join(import.meta.dirname, "..", "..", "content", "fiches");
let ajoutees = 0;

for (const [fiche, noeuds] of Object.entries(NOEUDS)) {
  const fichier = path.join(dossier, `${fiche}.json`);
  const f = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const deja = new Set(f.plusLoin.map((l) => l.url));
  const candidats = ressources
    .filter((r) => r.noeuds.some((n) => noeuds.includes(n)) && TYPE[r.type] && !deja.has(r.url))
    .map((r) => ({ type: TYPE[r.type], nom: r.nom, url: r.url, langue: r.langue, acces: r.acces, auteur: r.auteur }))
    .sort((a, b) => ACCES[a.acces] - ACCES[b.acces] || (a.langue === "fr" ? 0 : 1) - (b.langue === "fr" ? 0 : 1));
  const uniques = [];
  for (const c of candidats) if (!uniques.some((u) => u.url === c.url)) uniques.push(c);
  // Le payant seulement s'il n'existe aucun équivalent gratuit ; 5 ressources reprises au plus par fiche.
  const gratuits = uniques.filter((c) => c.acces !== "payant");
  const choisies = (gratuits.length > 0 ? gratuits : uniques).slice(0, 5).map((c) => (c.auteur ? c : { ...c, auteur: undefined }));
  f.plusLoin = [...f.plusLoin, ...choisies.map(({ auteur, ...reste }) => (auteur ? { ...reste, auteur } : reste))];
  ajoutees += choisies.length;
  fs.writeFileSync(fichier, JSON.stringify(f, null, 2) + "\n");
}
console.log("Ressources reprises :", ajoutees);
