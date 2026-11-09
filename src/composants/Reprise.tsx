"use client";

import Link from "next/link";
import { useMemo } from "react";
import { competenceFaite, prochaineEtape, recombiner, type Avancement } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

const VIDE: Avancement = { maitrisees: [], fiches: {} };

/** Bandeau « Reprendre » : visible seulement si une feuille de route existe. La fente a toujours la même hauteur (pas de saut au chargement). */
export function Reprise({ donnees }: { donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const reponses = parcours?.reponses;
  const avancement = parcours ?? VIDE;
  const feuille = useMemo(() => (reponses && Object.keys(reponses).length > 0 ? recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines) : null), [donnees, reponses]);
  const suivante = feuille ? prochaineEtape(feuille, avancement) : null;
  const faites = feuille ? feuille.etapes.filter((e) => competenceFaite(e, avancement)).length : 0;
  return (
    <div className="fente-reprise carte-reprise">
      {feuille ? (
        <Link className="reprise" href="/roadmap">
          <span>Reprendre votre feuille de route</span>
          <strong>
            {faites} sur {feuille.etapes.length}
            {suivante ? ` · ensuite : ${suivante.titre}` : ""}
          </strong>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}
