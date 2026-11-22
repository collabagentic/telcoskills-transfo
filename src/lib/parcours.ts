/**
 * Moteur de la feuille de route vivante : des réponses à quelques questions recombinent le graphe de compétences.
 * Fonctions pures, sans accès au stockage, sans React. Chaque étape garde la raison pour laquelle elle est là (pas de boîte noire).
 *
 * Règles (documentées dans BACKLOG.md §13) :
 *  - « acquis » : ce que les réponses déclarent maîtrisé, avec tous ses prérequis (maîtriser une compétence suppose ses prérequis) ;
 *  - graines : les cibles, les compétences des domaines de poids ≥ 2, et celles des domaines de poids 1 sauf le niveau « avancé » ;
 *    sans aucun effet de domaine ni cible, tout le graphe est une graine (la feuille de route complète) ;
 *  - étapes = graines + leurs prérequis, moins les acquises et les écartées ;
 *  - ordre : par prérequis (jamais une étape avant ses prérequis), puis par niveau (fondamental d'abord), poids du domaine, cible, identifiant.
 */

export type NiveauCompetence = "fondamental" | "intermediaire" | "avance" | "transverse";

export type CompetenceGraphe = {
  id: string;
  titre: string;
  domaine: string;
  niveau: NiveauCompetence;
  prerequis: string[];
  /** Fiches de transformation qui traitent cette compétence. */
  fiches: string[];
};

export type EffetsLite = { acquis?: string[]; domaines?: Record<string, number>; cible?: string[]; ecarte?: string[] };
export type QuestionLite = {
  id: string;
  texte: string;
  aide?: string;
  options: { id: string; libelle: string; detail?: string; raison: string; effets: EffetsLite }[];
};

export type Reponses = Record<string, string>;

export type Etape = {
  id: string;
  titre: string;
  domaine: string;
  niveau: NiveauCompetence;
  /** Prérequis restreints aux étapes de la feuille de route. */
  prerequis: string[];
  fiches: string[];
  cible: boolean;
  /** Pourquoi cette étape est là, en une phrase lisible. */
  pourquoi: string;
};

export type Feuille = {
  etapes: Etape[];
  acquises: string[];
  ecartees: string[];
  /** Compétences ni dans la feuille de route, ni acquises, ni écartées : hors de votre parcours. */
  hors: string[];
  /** Vrai tant qu'aucune réponse ne restreint le graphe (feuille de route complète). */
  complete: boolean;
};

const RANG_NIVEAU: Record<NiveauCompetence, number> = { fondamental: 0, intermediaire: 1, avance: 2, transverse: 3 };

export type Effets = {
  acquis: Set<string>;
  /** Poids de chaque domaine. */
  domaines: Map<string, number>;
  /** Pour chaque domaine, les raisons qui l'ont fait monter. */
  raisonsDomaine: Map<string, string[]>;
  cibles: Set<string>;
  ecartes: Set<string>;
  /** Vrai si au moins une réponse a été donnée. */
  repondu: boolean;
};

/** Cumule les effets des options choisies. Une réponse inconnue est ignorée. */
export function cumulerEffets(questions: QuestionLite[], reponses: Reponses): Effets {
  const e: Effets = { acquis: new Set(), domaines: new Map(), raisonsDomaine: new Map(), cibles: new Set(), ecartes: new Set(), repondu: false };
  for (const q of questions) {
    const o = q.options.find((x) => x.id === reponses[q.id]);
    if (!o) continue;
    e.repondu = true;
    for (const id of o.effets.acquis ?? []) e.acquis.add(id);
    for (const id of o.effets.cible ?? []) e.cibles.add(id);
    for (const id of o.effets.ecarte ?? []) e.ecartes.add(id);
    for (const [d, poids] of Object.entries(o.effets.domaines ?? {})) {
      e.domaines.set(d, (e.domaines.get(d) ?? 0) + poids);
      if (o.raison) e.raisonsDomaine.set(d, [...(e.raisonsDomaine.get(d) ?? []), o.raison]);
    }
  }
  return e;
}

/** Les prérequis, directs et indirects, d'un ensemble de compétences (l'ensemble lui-même inclus). */
export function fermeture(depart: Iterable<string>, parId: Map<string, CompetenceGraphe>): Set<string> {
  const vus = new Set<string>();
  const pile = [...depart];
  while (pile.length) {
    const id = pile.pop()!;
    if (vus.has(id) || !parId.has(id)) continue;
    vus.add(id);
    pile.push(...parId.get(id)!.prerequis);
  }
  return vus;
}

export function recombiner(graphe: CompetenceGraphe[], questions: QuestionLite[], reponses: Reponses, nomsDomaines: Record<string, string> = {}): Feuille {
  const parId = new Map(graphe.map((c) => [c.id, c]));
  const effets = cumulerEffets(questions, reponses);
  const acquises = fermeture([...effets.acquis].filter((id) => parId.has(id)), parId);
  const ecartees = new Set([...effets.ecartes].filter((id) => parId.has(id) && !acquises.has(id)));

  const sansRestriction = effets.domaines.size === 0 && effets.cibles.size === 0;
  const graines = new Set<string>();
  for (const c of graphe) {
    const poids = effets.domaines.get(c.domaine) ?? 0;
    if (sansRestriction || poids >= 2 || (poids === 1 && c.niveau !== "avance")) graines.add(c.id);
  }
  for (const id of effets.cibles) if (parId.has(id)) graines.add(id);

  const retenues = new Set([...fermeture(graines, parId)].filter((id) => !acquises.has(id) && !ecartees.has(id)));
  // Une cible écartée ou acquise ne figure pas : les règles du build l'interdisent dans une même option, mais deux options peuvent se contredire.
  const dependants = new Map<string, string>();
  for (const id of retenues) for (const p of parId.get(id)!.prerequis) if (retenues.has(p) && !dependants.has(p)) dependants.set(p, id);

  const poidsDomaine = (c: CompetenceGraphe) => effets.domaines.get(c.domaine) ?? 0;
  const pourquoi = (c: CompetenceGraphe): string => {
    if (effets.cibles.has(c.id)) return "votre objectif";
    const raisons = [...new Set(effets.raisonsDomaine.get(c.domaine) ?? [])];
    if (graines.has(c.id) && raisons.length > 0) return `${nomsDomaines[c.domaine] ?? c.domaine} : ${raisons.join(", ")}`;
    if (graines.has(c.id) && !effets.repondu) return "feuille de route complète";
    const d = dependants.get(c.id);
    return d ? `prérequis de « ${parId.get(d)!.titre} »` : "prérequis";
  };

  // Ordre : tri topologique (Kahn), départage par cible, poids du domaine, niveau, identifiant.
  const restants = new Set(retenues);
  const ordre: CompetenceGraphe[] = [];
  const prerequisRetenus = (c: CompetenceGraphe) => c.prerequis.filter((p) => retenues.has(p));
  while (restants.size > 0) {
    const pretes = [...restants]
      .map((id) => parId.get(id)!)
      .filter((c) => prerequisRetenus(c).every((p) => !restants.has(p)))
      .sort(
        (a, b) =>
          RANG_NIVEAU[a.niveau] - RANG_NIVEAU[b.niveau] ||
          poidsDomaine(b) - poidsDomaine(a) ||
          Number(effets.cibles.has(b.id)) - Number(effets.cibles.has(a.id)) ||
          a.id.localeCompare(b.id),
      );
    const prochaine = pretes[0] ?? [...restants].map((id) => parId.get(id)!).sort((a, b) => a.id.localeCompare(b.id))[0]; // boucle : interdite par les règles du build
    ordre.push(prochaine);
    restants.delete(prochaine.id);
  }

  const etapes: Etape[] = ordre.map((c) => ({
    id: c.id,
    titre: c.titre,
    domaine: c.domaine,
    niveau: c.niveau,
    prerequis: prerequisRetenus(c),
    fiches: c.fiches,
    cible: effets.cibles.has(c.id),
    pourquoi: pourquoi(c),
  }));
  const hors = graphe.filter((c) => !retenues.has(c.id) && !acquises.has(c.id) && !ecartees.has(c.id)).map((c) => c.id);
  return { etapes, acquises: [...acquises], ecartees: [...ecartees], hors, complete: sansRestriction && effets.acquis.size === 0 && effets.ecartes.size === 0 };
}

/** Ce que l'apprenant a fait : une compétence est « faite » si elle est marquée maîtrisée, ou si toutes ses fiches sont acquises. */
export type Avancement = {
  maitrisees: string[];
  fiches: Record<string, { lu?: string; acquis?: string }>;
};

export function competenceFaite(etape: Pick<Etape, "id" | "fiches">, a: Avancement): boolean {
  if (a.maitrisees.includes(etape.id)) return true;
  return etape.fiches.length > 0 && etape.fiches.every((f) => Boolean(a.fiches[f]?.acquis));
}

export type EtatEtape = "faite" | "disponible" | "a-venir";

/** Disponible = tous les prérequis de la feuille de route sont faits ; « à venir » = conseillée plus tard, jamais verrouillée. */
export function etatsEtapes(feuille: Feuille, a: Avancement): Record<string, EtatEtape> {
  const faites = new Set(feuille.etapes.filter((e) => competenceFaite(e, a)).map((e) => e.id));
  const etats: Record<string, EtatEtape> = {};
  for (const e of feuille.etapes) etats[e.id] = faites.has(e.id) ? "faite" : e.prerequis.every((p) => faites.has(p)) ? "disponible" : "a-venir";
  return etats;
}

/** Prochaine étape : la première, dans l'ordre de la feuille de route, qui est disponible ; sinon la première non faite. */
export function prochaineEtape(feuille: Feuille, a: Avancement): Etape | null {
  const etats = etatsEtapes(feuille, a);
  return feuille.etapes.find((e) => etats[e.id] === "disponible") ?? feuille.etapes.find((e) => etats[e.id] !== "faite") ?? null;
}

/** Étapes restantes pour atteindre `cible` : ses prérequis non faits puis elle-même, dans l'ordre de la feuille de route. */
export function restantPour(cible: string, feuille: Feuille, a: Avancement): Etape[] {
  const parId = new Map(feuille.etapes.map((e) => [e.id, e]));
  if (!parId.has(cible)) return [];
  const necessaires = new Set<string>();
  const pile = [cible];
  while (pile.length) {
    const id = pile.pop()!;
    if (necessaires.has(id) || !parId.has(id)) continue;
    necessaires.add(id);
    pile.push(...parId.get(id)!.prerequis);
  }
  return feuille.etapes.filter((e) => necessaires.has(e.id) && !competenceFaite(e, a));
}

/** Aperçu par domaine : combien de compétences il compte, combien restent dans la feuille de route, combien sont acquises. */
export type ApercuDomaine = { domaine: string; total: number; etapes: number; acquises: number };

export function apercuDomaines(graphe: CompetenceGraphe[], feuille: Feuille, ordreDomaines: string[]): ApercuDomaine[] {
  const acquises = new Set(feuille.acquises);
  const dansFeuille = new Set(feuille.etapes.map((e) => e.id));
  return ordreDomaines
    .map((domaine) => {
      const membres = graphe.filter((c) => c.domaine === domaine);
      return { domaine, total: membres.length, etapes: membres.filter((c) => dansFeuille.has(c.id)).length, acquises: membres.filter((c) => acquises.has(c.id)).length };
    })
    .filter((d) => d.total > 0);
}

/** Le programme : les étapes regroupées par domaine, dans l'ordre où chaque domaine apparaît dans la feuille de route. */
export type Bloc = { domaine: string; etapes: Etape[] };

export function blocsProgramme(feuille: Feuille): Bloc[] {
  const blocs: Bloc[] = [];
  for (const e of feuille.etapes) {
    const bloc = blocs.find((b) => b.domaine === e.domaine);
    if (bloc) bloc.etapes.push(e);
    else blocs.push({ domaine: e.domaine, etapes: [e] });
  }
  return blocs;
}

/**
 * Les priorités pour commencer : les prochaines étapes de la feuille de route recomposée, prises dans l'ordre stable du moteur.
 * Tant qu'aucune réponse ne restreint le graphe (feuille complète), il n'y a pas de priorité à choisir : le tableau est vide.
 */
export function priorites(feuille: Feuille, max = 3): Etape[] {
  if (feuille.complete) return [];
  return feuille.etapes.slice(0, max);
}
