"use client";

import { useMemo } from "react";
import type { DonneesPubliques } from "@/contenu/publiques";
import { etatsEtapes, recombiner, type Etape, type EtatEtape } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";

export type Chemin = {
  etapes: Etape[];
  /** Rang (0…) de l'étape traitée par la fiche courante ; -1 si la fiche n'est pas dans le chemin. */
  rang: number;
  etats: Record<string, EtatEtape>;
  /** Vrai tant que le visiteur n'a répondu à aucune question. */
  vide: boolean;
};

/** Le chemin du visiteur (sa feuille de route) et la place de la fiche courante dedans. */
export function useChemin(donnees: DonneesPubliques, ficheId: string, competences: string[]): Chemin {
  const parcours = useParcours();
  return useMemo(() => {
    const reponses = parcours?.reponses ?? {};
    const vide = Object.keys(reponses).length === 0;
    const feuille = recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines);
    const etats = etatsEtapes(feuille, parcours ?? { maitrisees: [], fiches: {} });
    // Sans réponse, la « feuille » est le référentiel entier : ce n'est pas un chemin, la fiche garde le menu du domaine.
    const rang = vide ? -1 : feuille.etapes.findIndex((e) => e.fiches.includes(ficheId) || competences.includes(e.id));
    return { etapes: feuille.etapes, rang, etats, vide };
  }, [parcours, donnees, ficheId, competences]);
}

export const lienEtape = (e: Pick<Etape, "id" | "fiches">) => (e.fiches[0] ? `/fiche/${e.fiches[0]}` : `/competence/${e.id}`);
