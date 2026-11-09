import { chargerContenu } from "./charger";
import { tempsLecture, titreFiche } from "./lecture";
import type { CompetenceGraphe, QuestionLite } from "@/lib/parcours";

/** Données légères passées aux composants client (jamais le contenu entier : les textes de fiche restent dans le HTML statique). */
export type FicheLite = {
  id: string;
  genre: "transposition" | "nouveaute";
  reflexe: string | null;
  titre: string;
  temps: number;
  statut: "brouillon" | "relu";
  competences: string[];
};

export type DonneesPubliques = {
  graphe: CompetenceGraphe[];
  questions: QuestionLite[];
  domaines: Record<string, string>;
  fiches: Record<string, FicheLite>;
};

export function donneesPubliques(): DonneesPubliques {
  const c = chargerContenu();
  const fiches: Record<string, FicheLite> = {};
  const fichesDe = new Map<string, string[]>();
  for (const f of c.fiches) {
    fiches[f.id] = { id: f.id, genre: f.genre, reflexe: f.reflexe, titre: titreFiche(f), temps: tempsLecture(f), statut: f.statut, competences: f.competences };
    for (const id of f.competences) fichesDe.set(id, [...(fichesDe.get(id) ?? []), f.id]);
  }
  return {
    graphe: c.competences.map((x) => ({ id: x.id, titre: x.titre, domaine: x.domaine, niveau: x.niveau, prerequis: x.prerequis, fiches: fichesDe.get(x.id) ?? [] })),
    questions: c.orientation.questions.map((q) => ({ id: q.id, texte: q.texte, aide: q.aide, options: q.options })),
    domaines: Object.fromEntries(c.domaines.map((d) => [d.id, d.nom])),
    fiches,
  };
}
