// Migration du projet fil rouge, du landscape des outils et des objectifs de compétence depuis l'ancien site.
// Lecture seule de ../telcoskills : fichiers locaux pour le projet et le landscape, branche origin/main pour les fiches pratiques
// (les objectifs « Ce que vous saurez faire » n'existent que là). Le rôle et les outils d'IA sont retirés (hors périmètre, Q5).
// Usage : node scripts/migration/projet-outils.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ICI = process.cwd();
const ANCIEN = path.join(ICI, "..", "telcoskills");
const lire = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const ecrire = (f, v) => fs.writeFileSync(path.join(ICI, "content", f), JSON.stringify(v, null, 2) + "\n");

const fichiersCompetences = fs.readdirSync(path.join(ICI, "content/competences")).filter((n) => n.endsWith(".json"));
const competences = new Set();
for (const n of fichiersCompetences) for (const c of lire(path.join(ICI, "content/competences", n))) competences.add(c.id);

// 1. Projet fil rouge
const ROLE_RETIRE = "ingenieur-ia";
const projet = lire(path.join(ANCIEN, "content/projets/coeur-5g-sur-caas.json"));
let retirees = 0;
const sortieProjet = {
  id: projet.id,
  titre: projet.titre,
  resume: "Un projet type pour voir qui fait quoi à chaque phase d'un déploiement, et à quoi sert chaque compétence.",
  contexte: projet.contexte,
  source: projet.source.replace("à partir des roadmaps du site", "à partir des compétences du site"),
  statut: "brouillon",
  roles: projet.roles.filter((r) => r.id !== ROLE_RETIRE).map((r) => ({ id: r.id, libelle: r.libelle, description: r.description })),
  phases: projet.phases.map((ph) => ({
    id: ph.id,
    titre: ph.titre,
    objectif: ph.objectif,
    livrables: ph.livrables,
    activites: ph.activites
      .filter((a) => {
        const garder = !a.roles.includes(ROLE_RETIRE);
        if (!garder) retirees++;
        return garder;
      })
      .map((a) => ({ titre: a.titre, roles: a.roles, competences: a.competences.map((c) => c.noeud).filter((id) => competences.has(id)) })),
    jalon: ph.jalon,
    risques: ph.risques,
  })),
};
ecrire("projet.json", sortieProjet);

// 2. Outils (landscape)
const CATEGORIE_RETIREE = "ia";
const land = lire(path.join(ANCIEN, "content/landscape.json"));
const outils = land.outils.filter((o) => o.categorie !== CATEGORIE_RETIREE);
ecrire("outils.json", {
  source: "Regroupement par fonction sur le modèle du paysage de la CNCF, repris de l'ancien site. L'association outil → rôle est une proposition à relire avec les équipes.",
  statut: "brouillon",
  categories: land.categories.filter((c) => c.id !== CATEGORIE_RETIREE).map((c) => ({ ...c, intro: c.intro.replace("landscape CNCF", "paysage de la CNCF") })),
  outils: outils.map((o) => ({
    id: o.id,
    nom: o.nom,
    categorie: o.categorie,
    sousCategorie: o.sous_categorie,
    url: o.url,
    roles: o.roles.filter((r) => r !== ROLE_RETIRE),
    competences: o.noeuds.filter((id) => competences.has(id)),
  })),
});

// 3. Objectifs « Ce que vous saurez faire », ajoutés à chaque compétence
const pratique = (id) => {
  try {
    return JSON.parse(execFileSync("git", ["-C", ANCIEN, "show", `origin/main:content/pratique/${id}.json`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
};
let avecObjectifs = 0;
for (const n of fichiersCompetences) {
  const f = path.join(ICI, "content/competences", n);
  const liste = lire(f).map((c) => {
    const p = pratique(c.id);
    const objectifs = p?.fiche?.objectifs?.filter((o) => typeof o === "string" && o.length <= 160).slice(0, 5);
    if (!objectifs?.length) return c;
    avecObjectifs++;
    return { ...c, objectifs };
  });
  fs.writeFileSync(f, JSON.stringify(liste, null, 2) + "\n");
}

console.log(`Projet : ${sortieProjet.phases.length} phases, ${sortieProjet.roles.length} rôles, ${sortieProjet.phases.reduce((s, p) => s + p.activites.length, 0)} activités (${retirees} d'IA retirées).`);
console.log(`Outils : ${outils.length} (sur ${land.outils.length}).`);
console.log(`Objectifs : ${avecObjectifs} compétences sur ${competences.size}.`);
