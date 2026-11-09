/**
 * Calcul du bilan et du plan : fonctions pures, sans accès au stockage (BACKLOG.md §4 écran 2, §6).
 * Les types sont minimaux pour pouvoir être importés côté client sans embarquer le contenu entier.
 */

export type Mode = "transposition" | "decouvrir" | "nouveaute";
export type Etat = "a-lire" | "lu" | "verifie";

export type MetierPourBilan = {
  id: string;
  savoirFaire: { id: string; statut: "acquis" | "transpose"; fiche?: string }[];
  nouveautes: string[];
  ordre: string[];
};
export type FichePourBilan = { id: string; genre: "transposition" | "nouveaute"; reflexe: string | null };

export type Bilan = {
  v: 1;
  metier: string;
  decoches: string[];
  fiches: Record<string, { lu?: string; verifie?: string }>;
  /** Fiche choisie comme objectif : le cockpit montre le chemin restant pour l'atteindre. */
  objectif?: string;
};

export type ResultatBilan = {
  /** Fiches du plan, dans l'ordre du métier, avec leur mode d'affichage. */
  fiches: { id: string; mode: Mode }[];
  /** Savoir-faire cochés qui se transposent : « changent de forme ». */
  forme: number;
  /** Fiches « nouveauté » : « vraiment nouveaux ». */
  nouveaux: number;
  /** Réflexes à lâcher des transpositions cochées, chacun compté une seule fois. */
  lacher: number;
  /** Transpositions dont le savoir-faire est décoché : elles restent dans le plan, « à découvrir ». */
  decouvrir: number;
  /** Nombre de fiches du plan (= « N choses évoluent »). */
  total: number;
};

export function calculerBilan(metier: MetierPourBilan, fiches: Record<string, FichePourBilan>, decoches: string[]): ResultatBilan {
  const decoche = new Set(decoches);
  const cochees = new Set<string>();
  for (const s of metier.savoirFaire) if (s.statut === "transpose" && s.fiche && !decoche.has(s.id)) cochees.add(s.fiche);

  const liste = metier.ordre.map((id) => {
    const f = fiches[id];
    const mode: Mode = f?.genre === "nouveaute" || metier.nouveautes.includes(id) ? "nouveaute" : cochees.has(id) ? "transposition" : "decouvrir";
    return { id, mode };
  });
  const lacher = new Set(liste.filter((l) => l.mode === "transposition" && fiches[l.id]?.reflexe).map((l) => l.id)).size;
  return {
    fiches: liste,
    forme: liste.filter((l) => l.mode === "transposition").length,
    nouveaux: liste.filter((l) => l.mode === "nouveaute").length,
    lacher,
    decouvrir: liste.filter((l) => l.mode === "decouvrir").length,
    total: liste.length,
  };
}

export type Groupe = "forme" | "nouveau" | "decouvrir";
export const LIBELLE_GROUPE: Record<Groupe, string> = {
  forme: "Change de forme",
  nouveau: "Vraiment nouveau",
  decouvrir: "À découvrir",
};
const GROUPE_DE_MODE: Record<Mode, Groupe> = { transposition: "forme", nouveaute: "nouveau", decouvrir: "decouvrir" };

export type LignePlan = { id: string; mode: Mode; groupe: Groupe; etat: Etat };
export type Plan = {
  lignes: LignePlan[];
  /** Première fiche non vérifiée, dans l'ordre du métier ; null si tout est vérifié. */
  reprise: string | null;
  verifiees: number;
  lues: number;
  total: number;
  /** Toutes les fiches du plan sont lues (ou vérifiées). */
  termine: boolean;
};

export function calculerPlan(bilan: Bilan, metier: MetierPourBilan, fiches: Record<string, FichePourBilan>): Plan {
  const resultat = calculerBilan(metier, fiches, bilan.decoches);
  const lignes: LignePlan[] = resultat.fiches.map(({ id, mode }) => {
    const e = bilan.fiches[id];
    const etat: Etat = e?.verifie ? "verifie" : e?.lu ? "lu" : "a-lire";
    return { id, mode, groupe: GROUPE_DE_MODE[mode], etat };
  });
  const verifiees = lignes.filter((l) => l.etat === "verifie").length;
  const lues = lignes.filter((l) => l.etat !== "a-lire").length;
  return {
    lignes,
    reprise: lignes.find((l) => l.etat !== "verifie")?.id ?? null,
    verifiees,
    lues,
    total: lignes.length,
    termine: lignes.length > 0 && lues === lignes.length,
  };
}

/** Fiche qui suit `courante` dans l'ordre du plan, null si c'est la dernière. */
export function ficheSuivante(plan: Plan, courante: string): string | null {
  const i = plan.lignes.findIndex((l) => l.id === courante);
  return i >= 0 && i + 1 < plan.lignes.length ? plan.lignes[i + 1].id : null;
}
