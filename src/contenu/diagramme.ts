import type { Diagramme } from "./schemas";

/**
 * Géométrie des diagrammes : pure, sans React ni accès au disque. Sert au rendu (tracé des flèches) et au contrôle du build.
 * Les composants sont placés à la main ; les flèches sont tracées automatiquement entre les côtés des composants.
 */

export type Cote = "h" | "b" | "g" | "d";
export type Point = { x: number; y: number };
type Boite = { x: number; y: number; w: number; h: number };

/** Largeur approximative d'un caractère, en unités du diagramme, pour vérifier que le texte tient dans sa boîte. */
export const LARGEUR_CAR_TITRE = 7.6;
export const LARGEUR_CAR_DETAIL = 6.2;

/** Point d'ancrage au milieu d'un côté, décalé le long de ce côté. */
export function ancrage(b: Boite, cote: Cote, decalage = 0): Point {
  switch (cote) {
    case "g":
      return { x: b.x, y: b.y + b.h / 2 + decalage };
    case "d":
      return { x: b.x + b.w, y: b.y + b.h / 2 + decalage };
    case "h":
      return { x: b.x + b.w / 2 + decalage, y: b.y };
    case "b":
      return { x: b.x + b.w / 2 + decalage, y: b.y + b.h };
  }
}

const oppose: Record<Cote, Cote> = { g: "d", d: "g", h: "b", b: "h" };
const horizontal = (c: Cote) => c === "g" || c === "d";

/** Côtés par défaut : sur l'axe où les deux composants sont les plus écartés. */
export function cotesAuto(a: Boite, b: Boite): { sortie: Cote; entree: Cote } {
  const dx = b.x + b.w / 2 - (a.x + a.w / 2);
  const dy = b.y + b.h / 2 - (a.y + a.h / 2);
  if (Math.abs(dx) >= Math.abs(dy)) return { sortie: dx >= 0 ? "d" : "g", entree: dx >= 0 ? "g" : "d" };
  return { sortie: dy >= 0 ? "b" : "h", entree: dy >= 0 ? "h" : "b" };
}

/** Tracé orthogonal entre deux points : droit si alignés, en Z si côtés opposés, en L si côtés perpendiculaires. */
export function tracer(p: Point, cp: Cote, q: Point, cq: Cote): Point[] {
  const proche = (a: number, b: number) => Math.abs(a - b) < 1.5;
  if (horizontal(cp) && horizontal(cq)) {
    if (proche(p.y, q.y)) return [p, q];
    const milieu = (p.x + q.x) / 2;
    return [p, { x: milieu, y: p.y }, { x: milieu, y: q.y }, q];
  }
  if (!horizontal(cp) && !horizontal(cq)) {
    if (proche(p.x, q.x)) return [p, q];
    const milieu = (p.y + q.y) / 2;
    return [p, { x: p.x, y: milieu }, { x: q.x, y: milieu }, q];
  }
  // côtés perpendiculaires : un coude
  return horizontal(cp) ? [p, { x: q.x, y: p.y }, q] : [p, { x: p.x, y: q.y }, q];
}

export type LienTrace = { points: Point[]; texte?: string; accent: boolean; pointille: boolean; double: boolean; milieu: Point };

/** Le milieu du plus long segment, pour poser l'étiquette d'une flèche. */
function milieuPlusLongSegment(points: Point[]): Point {
  let meilleur = { longueur: -1, milieu: points[0] };
  for (let i = 0; i + 1 < points.length; i++) {
    const l = Math.abs(points[i + 1].x - points[i].x) + Math.abs(points[i + 1].y - points[i].y);
    if (l > meilleur.longueur) meilleur = { longueur: l, milieu: { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 } };
  }
  return meilleur.milieu;
}

export function tracerLiens(d: Diagramme): LienTrace[] {
  const parId = new Map(d.noeuds.map((n) => [n.id, n]));
  const traces: LienTrace[] = [];
  for (const l of d.liens) {
    const a = parId.get(l.de);
    const b = parId.get(l.vers);
    if (!a || !b) continue;
    const auto = cotesAuto(a, b);
    const sortie = l.sortie ?? auto.sortie;
    const entree = l.entree ?? auto.entree;
    const points = tracer(ancrage(a, sortie, l.decalageSortie ?? 0), sortie, ancrage(b, entree, l.decalageEntree ?? 0), entree);
    traces.push({ points, texte: l.texte, accent: false, pointille: l.style === "pointille", double: l.sens === "double", milieu: milieuPlusLongSegment(points) });
  }
  return traces;
}

const dedans = (a: Boite, z: Boite) => a.x >= z.x && a.y >= z.y && a.x + a.w <= z.x + z.w && a.y + a.h <= z.y + z.h;
const sechevauchent = (a: Boite, b: Boite, marge = 0) => a.x < b.x + b.w + marge && b.x < a.x + a.w + marge && a.y < b.y + b.h + marge && b.y < a.y + a.h + marge;

/** Contrôles du build : références, débordements, chevauchements, texte qui tient dans sa boîte. Renvoie les erreurs (vide si tout va bien). */
export function verifierDiagramme(d: Diagramme): string[] {
  const erreurs: string[] = [];
  const ids = [...d.noeuds.map((n) => n.id), ...d.zones.map((z) => z.id)];
  for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) erreurs.push(`diagramme : identifiant en double « ${id} ».`);
  const zones = new Map(d.zones.map((z) => [z.id, z]));
  const noeuds = new Map(d.noeuds.map((n) => [n.id, n]));
  const canevas = { x: 0, y: 0, w: d.largeur, h: d.hauteur };

  for (const z of d.zones) if (!dedans(z, canevas)) erreurs.push(`diagramme : la zone « ${z.id} » dépasse du cadre ${d.largeur}×${d.hauteur}.`);
  for (const n of d.noeuds) {
    if (!dedans(n, canevas)) erreurs.push(`diagramme : « ${n.id} » dépasse du cadre ${d.largeur}×${d.hauteur}.`);
    if (n.zone) {
      const z = zones.get(n.zone);
      if (!z) erreurs.push(`diagramme : « ${n.id} » référence une zone inconnue « ${n.zone} ».`);
      else if (!dedans(n, z)) erreurs.push(`diagramme : « ${n.id} » sort de sa zone « ${z.id} ».`);
    }
    if (n.texte.length * LARGEUR_CAR_TITRE > n.w - 12) erreurs.push(`diagramme : le texte de « ${n.id} » est trop long pour sa boîte (${n.w} de large).`);
    if (n.detail && n.detail.length * LARGEUR_CAR_DETAIL > n.w - 12) erreurs.push(`diagramme : le détail de « ${n.id} » est trop long pour sa boîte (${n.w} de large).`);
    if (n.h < (n.detail ? 46 : 32)) erreurs.push(`diagramme : « ${n.id} » est trop basse (${n.h}).`);
  }
  const liste = d.noeuds;
  for (let i = 0; i < liste.length; i++)
    for (let j = i + 1; j < liste.length; j++) if (sechevauchent(liste[i], liste[j], 4)) erreurs.push(`diagramme : « ${liste[i].id} » et « ${liste[j].id} » se chevauchent.`);
  // Une zone ne coupe pas un composant qui n'est pas dedans : un composant sans zone ne doit pas être à moitié dans une zone.
  for (const n of d.noeuds)
    for (const z of d.zones) {
      if (n.zone === z.id) continue;
      if (sechevauchent(n, z)) erreurs.push(`diagramme : « ${n.id} » empiète sur la zone « ${z.id} » sans lui appartenir.`);
    }
  for (const l of d.liens) {
    if (!noeuds.has(l.de)) erreurs.push(`diagramme : flèche depuis un composant inconnu « ${l.de} ».`);
    if (!noeuds.has(l.vers)) erreurs.push(`diagramme : flèche vers un composant inconnu « ${l.vers} ».`);
    if (l.de === l.vers) erreurs.push(`diagramme : « ${l.de} » a une flèche vers lui-même.`);
  }
  // Une flèche ne traverse pas un composant qui n'est ni son départ ni son arrivée.
  for (const t of tracerLiens(d).map((tr, i) => ({ tr, l: d.liens[i] }))) {
    for (let i = 0; i + 1 < t.tr.points.length; i++) {
      const a = t.tr.points[i];
      const b = t.tr.points[i + 1];
      const seg = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
      for (const n of d.noeuds)
        if (n.id !== t.l.de && n.id !== t.l.vers && sechevauchent(seg, n, -1)) erreurs.push(`diagramme : la flèche « ${t.l.de} → ${t.l.vers} » traverse « ${n.id} ».`);
    }
  }
  return erreurs;
}

/** Description textuelle du diagramme (pour les lecteurs d'écran) : « A vers B (texte) ». */
export function descriptionDiagramme(d: Diagramme): string[] {
  const noms = new Map(d.noeuds.map((n) => [n.id, n.texte]));
  return d.liens.map((l) => `${noms.get(l.de) ?? l.de} ${l.sens === "double" ? "et" : "vers"} ${noms.get(l.vers) ?? l.vers}${l.texte ? ` : ${l.texte}` : ""}`);
}
