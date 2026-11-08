import { chargerContenu } from "./charger";
import { tempsLecture, titreFiche } from "./lecture";
import type { MetierPourBilan } from "@/lib/bilan";

/** Données légères passées aux composants client (jamais le contenu entier : les textes de fiche restent dans le HTML statique). */
export type FicheLite = {
  id: string;
  genre: "transposition" | "nouveaute";
  reflexe: string | null;
  titre: string;
  temps: number;
  statut: "brouillon" | "relu";
  liens: { nom: string; url: string; acces: string; type: string }[];
};
export type MetierLite = Omit<MetierPourBilan, "savoirFaire"> & {
  savoirFaire: (MetierPourBilan["savoirFaire"][number] & { texte: string })[];
  nom: string;
  accroche: string;
  statut: "brouillon" | "relu";
};

export type DonneesPubliques = { metiers: Record<string, MetierLite>; fiches: Record<string, FicheLite> };

export function donneesPubliques(): DonneesPubliques {
  const c = chargerContenu();
  const fiches: Record<string, FicheLite> = {};
  for (const f of c.fiches) {
    fiches[f.id] = {
      id: f.id,
      genre: f.genre,
      reflexe: f.reflexe,
      titre: titreFiche(f),
      temps: tempsLecture(f),
      statut: f.statut,
      liens: f.plusLoin.map((l) => ({ nom: l.nom, url: l.url, acces: l.acces, type: l.type })),
    };
  }
  const metiers: Record<string, MetierLite> = {};
  for (const m of c.metiers) {
    metiers[m.id] = { id: m.id, nom: m.nom, accroche: m.accroche, statut: m.statut, savoirFaire: m.savoirFaire, nouveautes: m.nouveautes, ordre: m.ordre };
  }
  return { metiers, fiches };
}
