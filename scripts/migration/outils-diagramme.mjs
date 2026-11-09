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

/**
 * Flux : une suite de composants reliés dans l'ordre, qui passe à la ligne quand elle déborde.
 * `etiquettes[i]` nomme la flèche entre le composant i et le suivant (texte, ou [texte, options], ou null).
 * `extra` ajoute d'autres flèches ; `cadre` entoure tout d'une zone ({ id, titre, ton }).
 */
export function flux({ legende, noeuds, etiquettes = [], extra = [], cadre, largeurMax = 840, ecartY = 120, gap = 64, x = 20, y, source }) {
  const y0 = y ?? (cadre ? 62 : 30);
  const lignes = [[]];
  let cx = x;
  for (const it of noeuds) {
    const w = it.largeur ?? mesure(it.texte, it.detail);
    if (cx + w > largeurMax && lignes[lignes.length - 1].length > 0) {
      lignes.push([]);
      cx = x;
    }
    lignes[lignes.length - 1].push({ ...it, w, ligne: lignes.length - 1, x: cx });
    cx += w + gap;
  }
  const places = [];
  lignes.forEach((ligne, i) => {
    for (const it of ligne) {
      const { largeur: _l, ligne: li, ...reste } = it;
      places.push({ ...reste, y: y0 + li * ecartY, h: hauteurPar(it, undefined) });
    }
  });
  const liens = [];
  places.slice(0, -1).forEach((a, i) => {
    const b = places[i + 1];
    const [texte, options = {}] = Array.isArray(etiquettes[i]) ? etiquettes[i] : [etiquettes[i]];
    const options2 = a.y === b.y ? options : { sortie: "b", entree: "h", ...options };
    liens.push([a.id, b.id, texte ?? undefined, options2]);
  });
  const zones = cadre ? [zone(cadre.id, cadre.titre, places, cadre.ton)] : [];
  return diagramme({ legende, source, zones, noeuds: places, liens: [...liens, ...extra] });
}

/**
 * Étoile : un composant central et jusqu'à quatre voisins (h, b, g, d). `sens: "depuis"` inverse la flèche, "double" la rend bidirectionnelle.
 */
export function etoile({ legende, centre, voisins, source, ecart = 90 }) {
  const par = Object.fromEntries(voisins.map((v) => [v.cote, v]));
  const larg = (k) => k.largeur ?? mesure(k.texte, k.detail);
  const wc = larg(centre);
  const wg = par.g ? larg(par.g.noeud) : 0;
  const wd = par.d ? larg(par.d.noeud) : 0;
  const hc = hauteurPar(centre);
  const yHaut = 30;
  const hHaut = par.h ? hauteurPar(par.h.noeud) : 0;
  const yCentre = par.h ? yHaut + hHaut + ecart : 30;
  const xCentre = 20 + (par.g ? wg + ecart + 20 : 0);
  const cxC = xCentre + wc / 2;
  const noeuds = [{ ...centre, x: xCentre, y: yCentre, w: wc, h: hc }];
  const liens = [];
  const poser = (v, x, y) => {
    const { largeur: _l, ...reste } = v.noeud;
    const w = larg(v.noeud);
    noeuds.push({ ...reste, x, y, w, h: hauteurPar(v.noeud) });
    const [de, vers] = v.sens === "depuis" ? [v.noeud.id, centre.id] : [centre.id, v.noeud.id];
    liens.push([de, vers, v.texte, { ...(v.style ? { style: v.style } : {}), ...(v.sens === "double" ? { sens: "double" } : {}) }]);
  };
  if (par.h) poser(par.h, cxC - larg(par.h.noeud) / 2, yHaut);
  if (par.b) poser(par.b, cxC - larg(par.b.noeud) / 2, yCentre + hc + ecart);
  if (par.g) poser(par.g, 20, yCentre + hc / 2 - hauteurPar(par.g.noeud) / 2);
  if (par.d) poser(par.d, xCentre + wc + ecart, yCentre + hc / 2 - hauteurPar(par.d.noeud) / 2);
  return diagramme({ legende, source, noeuds, liens });
}
