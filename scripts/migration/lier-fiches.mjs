// Rattache chaque fiche de transformation aux compétences du graphe (champ « competences »).
// Table écrite à la main. Usage : node scripts/migration/lier-fiches.mjs
import fs from "node:fs";
import path from "node:path";

const dossier = path.join(import.meta.dirname, "..", "..", "content");
const ids = new Set(fs.readdirSync(path.join(dossier, "competences")).flatMap((f) => JSON.parse(fs.readFileSync(path.join(dossier, "competences", f), "utf8")).map((c) => c.id)));

const LIENS = {
  "vlan-reseaux-cluster": ["multus", "sriov", "pieges-reseau"],
  "matrice-networkpolicy": ["sec-reseau", "cni"],
  "pra-gitops": ["pra-rpo-rto", "gitops", "stockage-dr"],
  "changement-pr": ["gestion-changement", "ci-cd-integration", "git-ci"],
  "vm-pod": ["k8s-workloads", "conteneurs", "kubevirt"],
  "actif-passif-replicas": ["resilience-nf", "ha-geo"],
  "acces-rbac": ["k8s-rbac", "sec-secrets"],
  reconciliation: ["k8s-archi"],
  operateurs: ["ocp-operators", "operators-dev"],
  "supervision-prometheus": ["obs-metrics", "alerting-utile"],
  "observabilite-traces": ["obs-telemetry"],
  "interfaces-sbi": ["sbi-http2", "5g-sba"],
  "appliance-cnf": ["helm-cnf", "cnf-onboarding", "helm"],
  "dimensionnement-ressources": ["perf-hugepages", "perf-profile", "dimensionnement"],
  "ao-exigences-cnf": ["cnf-exigences", "evaluation-fournisseurs"],
  "dossier-archi-code": ["adr", "hld-lld"],
  "cmdb-git": ["config-nf"],
  "patch-images": ["sec-supply", "gestion-vulns"],
  "lb-services": ["k8s-services", "lb-bgp"],
  "chiffrage-slo": ["sre-slo", "cout-energie"],
  "plateforme-produit": ["cycle-vie-plateforme", "toil"],
};
const manquants = [];
for (const [fiche, comps] of Object.entries(LIENS)) {
  const fichier = path.join(dossier, "fiches", `${fiche}.json`);
  const f = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const valides = comps.filter((c) => (ids.has(c) ? true : (manquants.push(`${fiche} → ${c}`), false)));
  const { exemple, schema, ...avant } = f;
  // « competences » est rangé juste avant « technos » pour garder des fichiers lisibles
  const sortie = {};
  for (const [k, v] of Object.entries(f)) {
    if (k === "technos") sortie.competences = valides;
    if (k !== "competences") sortie[k] = v;
  }
  void avant;
  void exemple;
  void schema;
  fs.writeFileSync(fichier, JSON.stringify(sortie, null, 2) + "\n");
}
console.log("Fiches liées :", Object.keys(LIENS).length, "· références manquantes :", manquants);
