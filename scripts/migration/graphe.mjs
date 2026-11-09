// Migration du graphe de compétences de l'ancien site (lecture seule) vers content/competences/<domaine>.json.
// Usage : node scripts/migration/graphe.mjs <chemin de telcoskills (ancien dépôt)>
// Élagage : on retire les compétences propres aux parcours « IA agentique » et « Sylva » (hors périmètre : cloud natif télécom
// seulement, backlog Q5) ; les prérequis qui pointent vers une compétence retirée sont supprimés. Rapport : reports/migration-graphe.md.
import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Passer en argument le chemin de l'ancien dépôt.");
const HORS_PERIMETRE = new Set(["ia-agentique-telco", "parcours-sylva"]);

// Blocs de l'ancien site → domaines de la refonte
const DOMAINES = [
  ["fondations", "Fondations", /^(Fondations|Acculturation télécom|Socle plateforme)$/],
  ["kubernetes", "Kubernetes et OpenShift", /^(Kubernetes|Plateforme et CNF|Charges télécom)/],
  ["reseau", "Réseau", /^R[ée]seau/],
  ["performance", "Performance et dimensionnement", /^Performance/],
  ["stockage", "Stockage et virtualisation", /^Stockage/],
  ["exploitation", "Exploitation et fiabilité", /(Résilience|Exploitation|Observabilité|Incidents|Fiabilité)/],
  ["securite", "Sécurité et conformité", /(Sécurité|Réglementation)/],
  ["coeur-5g", "Cœur 5G et fonctions réseau", /(Cœur 5G|Fonctions du cœur|Procédures et interconnexion|Intégration multi|Tests et validation)/],
  ["gouvernance", "Conception et gouvernance", /^Conception et gouvernance$/],
  ["livraison", "Livraison et automatisation", /(CI\/CD|Packaging|Automatisation|Changement)/],
];
const domaineDe = (bloc) => DOMAINES.find(([, , re]) => re.test(bloc))?.[0];

const noeuds = new Map();
for (const f of fs.readdirSync(path.join(source, "content", "roadmaps")).filter((n) => n.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(path.join(source, "content", "roadmaps", f), "utf8"));
  for (const n of Array.isArray(r.noeuds) ? r.noeuds : Object.values(r.noeuds ?? {})) {
    const actuel = noeuds.get(n.id) ?? { ...n, roadmaps: [] };
    actuel.roadmaps.push(r.id);
    noeuds.set(n.id, actuel);
  }
}

// Ressources d'apprentissage rattachées par identifiant de nœud
const brut = JSON.parse(fs.readFileSync(path.join(source, "content", "ressources", "apprentissage.json"), "utf8"));
const appr = brut.ressources ?? Object.values(brut).find(Array.isArray);

// Types de ressources de l'ancien site → types de la refonte ; une ressource sans adresse est écartée (comptée au rapport).
const TYPES = { libre: "opensource", "retour-experience": "doc", livre: "cours" };
let ressourcesSansUrl = 0;

const gardes = [...noeuds.values()].filter((n) => !n.roadmaps.every((r) => HORS_PERIMETRE.has(r)));
const ids = new Set(gardes.map((n) => n.id));
const retires = [...noeuds.values()].filter((n) => !ids.has(n.id));
const sansDomaine = gardes.filter((n) => !domaineDe(n.bloc));
if (sansDomaine.length) throw new Error("Blocs sans domaine : " + [...new Set(sansDomaine.map((n) => n.bloc))].join(", "));

const parDomaine = {};
let aretesRetirees = 0;
for (const n of gardes) {
  const ressources = [...(n.ressources ?? [])];
  for (const r of appr) if (r.noeuds.includes(n.id) && !ressources.some((x) => x.url === r.url)) ressources.push({ type: r.type, nom: r.nom, url: r.url, acces: r.acces, langue: r.langue, auteur: r.auteur });
  const prerequis = (n.prerequis ?? []).filter((p) => {
    const garde = ids.has(p);
    if (!garde) aretesRetirees++;
    return garde;
  });
  const nettoye = ressources
    .filter((r) => {
      if (!r.url) ressourcesSansUrl++;
      return Boolean(r.url);
    })
    .map((r) => Object.fromEntries(Object.entries({ ...r, type: TYPES[r.type] ?? r.type }).filter(([, v]) => v !== undefined)));
  (parDomaine[domaineDe(n.bloc)] ??= []).push({
    id: n.id,
    titre: n.titre,
    domaine: domaineDe(n.bloc),
    niveau: n.niveau,
    prerequis,
    resume: n.resume,
    ressources: nettoye,
    origine: n.roadmaps,
    statut: "brouillon",
  });
}
const dossier = path.join(import.meta.dirname, "..", "..", "content");
fs.rmSync(path.join(dossier, "competences"), { recursive: true, force: true });
fs.mkdirSync(path.join(dossier, "competences"), { recursive: true });
for (const [d, liste] of Object.entries(parDomaine)) fs.writeFileSync(path.join(dossier, "competences", `${d}.json`), JSON.stringify(liste, null, 2) + "\n");
fs.writeFileSync(path.join(dossier, "domaines.json"), JSON.stringify(DOMAINES.map(([id, nom]) => ({ id, nom })), null, 2) + "\n");

const rapport = [
  "# Migration du graphe de compétences",
  "",
  `Source : ancien dépôt (${noeuds.size} compétences uniques dans 7 parcours). Repris : **${gardes.length}**. Retirés : **${retires.length}** (propres aux parcours IA agentique et Sylva, hors périmètre). Prérequis supprimés car pointant vers une compétence retirée : ${aretesRetirees}. Ressources écartées faute d'adresse : ${ressourcesSansUrl}. Types renommés : libre → opensource, retour-experience → doc, livre → cours.`,
  "",
  "## Repris, par domaine",
  ...Object.entries(parDomaine).map(([d, l]) => `- ${d} : ${l.length}`),
  "",
  "## Retirés",
  ...retires.map((n) => `- ${n.id} : ${n.titre} (${n.roadmaps.join(", ")})`),
  "",
].join("\n");
fs.writeFileSync(path.join(dossier, "..", "reports", "migration-graphe.md"), rapport);
console.log("Repris :", gardes.length, "· retirés :", retires.length, "· prérequis retirés :", aretesRetirees);
