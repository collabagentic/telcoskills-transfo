// Reprise unique des questions de l'ancien dépôt (lecture seule) vers content/questions/.
// Usage : node scripts/reprise/questions.mjs <chemin de telcocloud-roadmaps>
import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Passer en argument le chemin de l'ancien dépôt (telcocloud-roadmaps).");

// fiche → [fichier pratique, id de question] ×2 (table de correspondance écrite à la main)
const CORRESPONDANCE = {
  "vlan-reseaux-cluster": [["multus", "rappel-multus-role"], ["multus", "rappel-multus-annotation"]],
  "matrice-networkpolicy": [["sec-reseau", "rappel-sans-policy"], ["sec-reseau", "rappel-default-deny"]],
  "pra-gitops": [["pra-rpo-rto", "rappel-rto"], ["gitops", "rappel-gitops-principe"]],
  "changement-pr": [["gitops", "rappel-gitops-derive"], ["git-ci", "rappel-gitlab-ci-yml"]],
  "vm-pod": [["k8s-workloads", "rappel-statefulset"], ["k8s-workloads", "rappel-readiness"]],
  "actif-passif-replicas": [["ha-geo", "rappel-quorum-5"], ["ha-geo", "rappel-spof"]],
  "acces-rbac": [["k8s-rbac", "rappel-rbac-defaut"], ["k8s-rbac", "rappel-rolebinding-clusterrole"]],
  reconciliation: [["k8s-archi", "rappel-reconciliation"], ["k8s-archi", "rappel-api-etcd"]],
  operateurs: [["ocp-operators", "rappel-subscription-olm"], ["ocp-operators", "rappel-installplan"]],
  "supervision-prometheus": [["alerting-utile", "rappel-alerte-symptome"], ["obs-metrics", "rappel-regroupement"]],
  "interfaces-sbi": [["sbi-http2", "rappel-sbi-protocole"], ["sbi-http2", "rappel-sbi-openapi"]],
  "appliance-cnf": [["helm", "rappel-helm-upgrade"], ["helm", "rappel-helm-rollback"]],
  "observabilite-traces": [["obs-telemetry", "rappel-signaux-otel"], ["obs-telemetry", "rappel-collector-otel"]],
  "patch-images": [["sec-supply", "rappel-digest-image"], ["sec-supply", "rappel-sbom"]],
  "lb-services": [["k8s-services", "rappel-nodeport"], ["k8s-services", "rappel-service-headless"]],
};

const sortie = path.join(import.meta.dirname, "..", "..", "content", "questions");
fs.mkdirSync(sortie, { recursive: true });
for (const [fiche, paires] of Object.entries(CORRESPONDANCE)) {
  paires.forEach(([fichier, id], i) => {
    const j = JSON.parse(fs.readFileSync(path.join(source, "content", "pratique", `${fichier}.json`), "utf8"));
    const q = (j.rappel ?? []).find((x) => x.id === id);
    if (!q) throw new Error(`Question introuvable : ${fichier}/${id}`);
    const nouvelle = { id: `q-${fiche}-${i + 1}`, fiche, enonce: q.enonce, options: q.options, bonne: q.bonne, explication: q.explication, source: q.source, statut: "brouillon" };
    fs.writeFileSync(path.join(sortie, `${nouvelle.id}.json`), JSON.stringify(nouvelle, null, 2) + "\n");
  });
}
console.log("Questions reprises :", Object.keys(CORRESPONDANCE).length * 2);
