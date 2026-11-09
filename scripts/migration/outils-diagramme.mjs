// Atelier de dessin des diagrammes : placement des rangées, des colonnes et des zones, puis écriture dans le contenu.
// Les chevauchements, débordements et flèches qui traversent un composant sont refusés par le build (règle 15) : on dessine, on lance les tests, on corrige.
import fs from "node:fs";
import path from "node:path";

const CONTENU = path.join(import.meta.dirname, "..", "..", "content");

/** Largeur d'une boîte selon son texte et son détail. */
export const mesure = (texte, detail) => Math.max(90, Math.ceil((Math.max(texte.length * 7.8, (detail?.length ?? 0) * 6.4) + 28) / 10) * 10);

/** n("id", "Titre", "détail", { ton, forme }) */
export const n = (id, texte, detail, extra = {}) => ({ id, texte, ...(detail ? { detail } : {}), ...extra });

const hauteurPar = (it, h) => h ?? (it.detail || it.forme === "base" ? 56 : 40);

/** Une rangée de composants, de gauche à droite. */
export function rangee(items, { x = 20, y = 20, gap = 56, h, w } = {}) {
  let cx = x;
  return items.map(({ largeur: lw, ...it }) => {
    const largeur = lw ?? w ?? mesure(it.texte, it.detail);
    const noeud = { ...it, x: cx, y, w: largeur, h: hauteurPar(it, h) };
    cx += largeur + gap;
    return noeud;
  });
}

/** Une colonne de composants, de haut en bas. */
export function colonne(items, { x = 20, y = 20, gap = 24, h, w } = {}) {
  let cy = y;
  return items.map(({ largeur: lw, ...it }) => {
    const hauteur = hauteurPar(it, h);
    const noeud = { ...it, x, y: cy, w: lw ?? w ?? mesure(it.texte, it.detail), h: hauteur };
    cy += hauteur + gap;
    return noeud;
  });
}

/** Décale des composants (modifie en place) et les renvoie. */
export function decaler(noeuds, dx, dy = 0) {
  for (const k of noeuds) {
    k.x += dx;
    k.y += dy;
  }
  return noeuds;
}

/** Aligne le centre horizontal d'une rangée sur celui d'un composant de référence : `centrer(rangee, "id", xCentre)`. */
export function centrer(noeuds, id, xCentre) {
  const k = noeuds.find((z) => z.id === id);
  return decaler(noeuds, xCentre - (k.x + k.w / 2));
}

/** Zone autour de composants (leur attribue la zone). Place la zone avec un bandeau pour le titre. */
export function zone(id, titre, noeuds, ton) {
  const minX = Math.min(...noeuds.map((k) => k.x));
  const minY = Math.min(...noeuds.map((k) => k.y));
  const maxX = Math.max(...noeuds.map((k) => k.x + k.w));
  const maxY = Math.max(...noeuds.map((k) => k.y + k.h));
  for (const k of noeuds) k.zone = id;
  const w = Math.max(maxX - minX + 32, Math.ceil(titre.length * 7.4 + 32));
  return { id, titre, x: minX - 16, y: minY - 38, w, h: maxY - minY + 38 + 16, ...(ton ? { ton } : {}) };
}

/** Assemble le diagramme : le cadre est calculé autour du contenu. */
export function diagramme({ legende, source, zones = [], noeuds, liens }) {
  const droite = Math.max(...noeuds.map((k) => k.x + k.w), ...zones.map((z) => z.x + z.w));
  const bas = Math.max(...noeuds.map((k) => k.y + k.h), ...zones.map((z) => z.y + z.h));
  const sansVide = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
  return {
    legende,
    largeur: Math.max(300, Math.ceil(droite + 20)),
    hauteur: Math.max(120, Math.ceil(bas + 20)),
    zones,
    noeuds: noeuds.map((k) => sansVide(k)),
    liens: liens.map(([de, vers, texte, options = {}]) => sansVide({ de, vers, texte, ...options })),
    source,
  };
}

/** Ecrit un diagramme sur une fiche (`fiche`) ou une compétence (`competence`). La source par défaut est la première source de la fiche. */
export function fiche(id, d) {
  const chemin = path.join(CONTENU, "fiches", `${id}.json`);
  const f = JSON.parse(fs.readFileSync(chemin, "utf8"));
  const sortie = {};
  for (const [k, v] of Object.entries(f)) {
    if (k === "diagramme") continue;
    sortie[k] = v;
    if (k === "schema") sortie.diagramme = { ...d, source: d.source ?? f.sources[0] };
  }
  fs.writeFileSync(chemin, JSON.stringify(sortie, null, 2) + "\n");
}

export function competence(id, d) {
  const dossier = path.join(CONTENU, "competences");
  for (const nom of fs.readdirSync(dossier)) {
    const chemin = path.join(dossier, nom);
    const liste = JSON.parse(fs.readFileSync(chemin, "utf8"));
    const c = liste.find((x) => x.id === id);
    if (!c) continue;
    // Source par défaut : la première ressource libre avec adresse (documentation ou open source).
    const libre = c.ressources.find((r) => r.url && (r.type === "doc" || r.type === "opensource")) ?? c.ressources.find((r) => r.url);
    if (!d.source && !libre) throw new Error(`Compétence ${id} : aucune source disponible pour le diagramme.`);
    c.diagramme = { ...d, source: d.source ?? { nom: libre.nom.slice(0, 160), url: libre.url } };
    fs.writeFileSync(chemin, JSON.stringify(liste, null, 2) + "\n");
    return;
  }
  throw new Error(`Compétence introuvable : ${id}`);
}
