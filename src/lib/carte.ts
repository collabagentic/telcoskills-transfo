/**
 * Carte de transformation : placement des étapes, états et chemin vers un objectif. Fonctions pures, sans accès au stockage.
 * Les dépendances sont des prérequis CONSEILLÉS : rien n'est jamais verrouillé.
 */
import type { Etat } from "./bilan";

export type Dependances = Record<string, string[]>;

export type EtatCarte = "verifie" | "lu" | "disponible" | "a-venir";
export type NoeudPlace = { id: string; couche: number; rang: number; x: number; y: number };
export type Arete = { de: string; vers: string };

export const LARGEUR_NOEUD = 256;
/** Largeur et hauteur totales du graphe placé (pour régler le zoom initial). */
export function tailleGraphe(noeuds: NoeudPlace[]): { largeur: number; hauteur: number } {
  return {
    largeur: Math.max(...noeuds.map((n) => n.x)) + LARGEUR_NOEUD,
    hauteur: Math.max(...noeuds.map((n) => n.y)) + HAUTEUR_NOEUD,
  };
}

export const HAUTEUR_NOEUD = 116;
const ECART_X = 64;
const ECART_Y = 28;

/** Couche d'une étape = 0 sans prérequis, sinon 1 + la plus haute couche de ses prérequis (placement de gauche à droite). */
export function placer(ordre: string[], dependances: Dependances): { noeuds: NoeudPlace[]; aretes: Arete[] } {
  const couche = new Map<string, number>();
  const calculer = (id: string, vus: Set<string> = new Set()): number => {
    const connu = couche.get(id);
    if (connu !== undefined) return connu;
    if (vus.has(id)) return 0; // boucle : interdite par les règles du build, on ne plante pas
    vus.add(id);
    const prerequis = (dependances[id] ?? []).filter((p) => ordre.includes(p));
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
  const hauteurMax = Math.max(...[...parCouche.values()].map((l) => l.length));
  const noeuds: NoeudPlace[] = [];
  for (const [c, ids] of parCouche) {
    // Centre verticalement chaque colonne.
    const decalage = ((hauteurMax - ids.length) * (HAUTEUR_NOEUD + ECART_Y)) / 2;
    ids.forEach((id, rang) =>
      noeuds.push({ id, couche: c, rang, x: c * (LARGEUR_NOEUD + ECART_X), y: decalage + rang * (HAUTEUR_NOEUD + ECART_Y) }),
    );
  }
  const aretes: Arete[] = [];
  for (const id of ordre) for (const p of dependances[id] ?? []) if (ordre.includes(p)) aretes.push({ de: p, vers: id });
  return { noeuds, aretes };
}

/** État d'affichage d'une étape : vérifiée, lue, disponible (prérequis lus) ou « à venir » (conseillé plus tard, jamais verrouillée). */
export function etatCarte(id: string, etats: Record<string, Etat>, dependances: Dependances): EtatCarte {
  const e = etats[id] ?? "a-lire";
  if (e === "verifie") return "verifie";
  if (e === "lu") return "lu";
  const prerequis = dependances[id] ?? [];
  return prerequis.every((p) => (etats[p] ?? "a-lire") !== "a-lire") ? "disponible" : "a-venir";
}

/** Tous les prérequis (transitifs) d'une étape. */
export function prerequisTransitifs(id: string, dependances: Dependances): Set<string> {
  const vus = new Set<string>();
  const pile = [...(dependances[id] ?? [])];
  while (pile.length) {
    const p = pile.pop()!;
    if (vus.has(p)) continue;
    vus.add(p);
    pile.push(...(dependances[p] ?? []));
  }
  return vus;
}

/** Étapes restantes pour atteindre `cible` : prérequis non vérifiés puis la cible, dans l'ordre du métier. */
export function cheminRestant(cible: string, ordre: string[], dependances: Dependances, etats: Record<string, Etat>): string[] {
  if (!ordre.includes(cible)) return [];
  const necessaires = prerequisTransitifs(cible, dependances);
  necessaires.add(cible);
  return ordre.filter((id) => necessaires.has(id) && (etats[id] ?? "a-lire") !== "verifie");
}

/** Étapes du chemin complet vers la cible (vérifiées ou non), pour la mettre en évidence sur la carte. */
export function cheminComplet(cible: string, dependances: Dependances): Set<string> {
  const s = prerequisTransitifs(cible, dependances);
  s.add(cible);
  return s;
}
