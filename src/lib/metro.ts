import { competenceFaite, type Avancement, type CompetenceGraphe } from "./parcours";

/**
 * Ligne de métro d'un domaine : ses compétences dans l'ordre des prérequis, resserrée autour de la station courante.
 * Une « correspondance » est un prérequis qui vient d'un autre domaine (une autre ligne). Fonctions pures, sans React.
 */

export type Station = {
  id: string;
  titre: string;
  etat: "acquise" | "courante" | "a-faire";
  /** Vrai si la station est faite, y compris la courante (le point se remplit quand la fiche devient acquise). */
  faite: boolean;
  correspondance: { id: string; titre: string; domaine: string } | null;
};

export type Ligne = {
  domaine: string;
  /** Position de la station courante (1 pour la première) et nombre de stations de la ligne. */
  position: number;
  total: number;
  avant: number;
  apres: number;
  stations: Station[];
};

const RANG = { fondamental: 0, intermediaire: 1, avance: 2, transverse: 3 } as const;
export const STATIONS_VISIBLES = 5;
/** Au plus deux correspondances dessinées, les plus proches de la station courante : la ligne reste lisible. */
export const CORRESPONDANCES_VISIBLES = 2;

/** Les compétences d'un domaine, un prérequis toujours avant ce qui en dépend (profondeur dans le domaine, puis niveau, puis identifiant). */
export function ordreDomaine(graphe: CompetenceGraphe[], domaine: string): CompetenceGraphe[] {
  const dedans = graphe.filter((c) => c.domaine === domaine);
  const parId = new Map(dedans.map((c) => [c.id, c]));
  const profondeur = new Map<string, number>();
  const calculer = (id: string, vus: Set<string>): number => {
    const connu = profondeur.get(id);
    if (connu !== undefined) return connu;
    if (vus.has(id)) return 0;
    vus.add(id);
    const p = (parId.get(id)?.prerequis ?? []).filter((x) => parId.has(x));
    const d = p.length === 0 ? 0 : 1 + Math.max(...p.map((x) => calculer(x, vus)));
    profondeur.set(id, d);
    return d;
  };
  for (const c of dedans) calculer(c.id, new Set());
  return [...dedans].sort((a, b) => profondeur.get(a.id)! - profondeur.get(b.id)! || RANG[a.niveau] - RANG[b.niveau] || a.id.localeCompare(b.id));
}

/** La ligne du domaine de `courante`, resserrée sur elle : au plus `STATIONS_VISIBLES` stations, la courante au centre quand c'est possible. */
export function ligneDe(graphe: CompetenceGraphe[], courante: string, avancement: Avancement): Ligne | null {
  const station = graphe.find((c) => c.id === courante);
  if (!station) return null;
  const ordre = ordreDomaine(graphe, station.domaine);
  const parId = new Map(graphe.map((c) => [c.id, c]));
  const i = ordre.findIndex((c) => c.id === courante);
  const debut = Math.max(0, Math.min(i - 2, ordre.length - STATIONS_VISIBLES));
  const fenetre = ordre.slice(debut, debut + STATIONS_VISIBLES);
  const stations = fenetre.map<Station>((c) => {
    const externe = c.prerequis.map((p) => parId.get(p)).find((p) => p && p.domaine !== station.domaine);
    return {
      id: c.id,
      titre: c.titre,
      etat: c.id === courante ? "courante" : competenceFaite(c, avancement) ? "acquise" : "a-faire",
      faite: competenceFaite(c, avancement),
      correspondance: externe ? { id: externe.id, titre: externe.titre, domaine: externe.domaine } : null,
    };
  });
  const proches = stations
    .map((s, k) => ({ id: s.id, ecart: Math.abs(k - (i - debut)), a: Boolean(s.correspondance) }))
    .filter((x) => x.a)
    .sort((a, b) => a.ecart - b.ecart)
    .slice(0, CORRESPONDANCES_VISIBLES)
    .map((x) => x.id);
  for (const s of stations) if (!proches.includes(s.id)) s.correspondance = null;
  return { domaine: station.domaine, position: i + 1, total: ordre.length, avant: debut, apres: Math.max(0, ordre.length - debut - fenetre.length), stations };
}
