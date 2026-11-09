/**
 * Placement des étapes de la carte, de gauche à droite : une étape est une couche après ses prérequis.
 * Fonction pure, sans accès au stockage. Les dépendances sont des prérequis CONSEILLÉS : rien n'est jamais verrouillé.
 */

export type Dependances = Record<string, string[]>;
export type NoeudPlace = { id: string; couche: number; rang: number; x: number; y: number };
export type Arete = { de: string; vers: string };

/** Dimensions d'une étape et espacement entre étapes. */
export type Dims = { largeur: number; hauteur: number; ecartX: number; ecartY: number };
export const DIMS_ETAPE: Dims = { largeur: 232, hauteur: 76, ecartX: 64, ecartY: 20 };
/** Vue d'ensemble (feuille de route complète) : de petits blocs sans texte. */
export const DIMS_ENSEMBLE: Dims = { largeur: 56, hauteur: 20, ecartX: 28, ecartY: 8 };

/** Couche d'une étape = 0 sans prérequis, sinon 1 + la plus haute couche de ses prérequis. */
export function placer(ordre: string[], dependances: Dependances, dims: Dims = DIMS_ETAPE): { noeuds: NoeudPlace[]; aretes: Arete[] } {
  const dans = new Set(ordre);
  const couche = new Map<string, number>();
  const calculer = (id: string, vus: Set<string> = new Set()): number => {
    const connu = couche.get(id);
    if (connu !== undefined) return connu;
    if (vus.has(id)) return 0; // boucle : interdite par les règles du build, on ne plante pas
    vus.add(id);
    const prerequis = (dependances[id] ?? []).filter((p) => dans.has(p));
    const c = prerequis.length === 0 ? 0 : 1 + Math.max(...prerequis.map((p) => calculer(p, vus)));
    couche.set(id, c);
    return c;
  };
  for (const id of ordre) calculer(id);

  const parCouche = new Map<number, string[]>();
  for (const id of ordre) {
    const c = couche.get(id) ?? 0;
    parCouche.set(c, [...(parCouche.get(c) ?? []), id]);
  }
  const hauteurMax = Math.max(0, ...[...parCouche.values()].map((l) => l.length));
  const noeuds: NoeudPlace[] = [];
  for (const [c, ids] of parCouche) {
    // Centre verticalement chaque colonne.
    const decalage = ((hauteurMax - ids.length) * (dims.hauteur + dims.ecartY)) / 2;
    ids.forEach((id, rang) => noeuds.push({ id, couche: c, rang, x: c * (dims.largeur + dims.ecartX), y: decalage + rang * (dims.hauteur + dims.ecartY) }));
  }
  const aretes: Arete[] = [];
  for (const id of ordre) for (const p of dependances[id] ?? []) if (dans.has(p)) aretes.push({ de: p, vers: id });
  return { noeuds, aretes };
}

/** Largeur et hauteur totales du graphe placé (pour régler le zoom initial). */
export function tailleGraphe(noeuds: NoeudPlace[], dims: Dims = DIMS_ETAPE): { largeur: number; hauteur: number } {
  if (noeuds.length === 0) return { largeur: dims.largeur, hauteur: dims.hauteur };
  return { largeur: Math.max(...noeuds.map((n) => n.x)) + dims.largeur, hauteur: Math.max(...noeuds.map((n) => n.y)) + dims.hauteur };
}

/** Toutes les étapes qui mènent à `cible` (elle comprise), pour surligner le chemin. */
export function cheminComplet(cible: string, dependances: Dependances): Set<string> {
  const vus = new Set<string>();
  const pile = [cible];
  while (pile.length) {
    const id = pile.pop()!;
    if (vus.has(id)) continue;
    vus.add(id);
    pile.push(...(dependances[id] ?? []));
  }
  return vus;
}
