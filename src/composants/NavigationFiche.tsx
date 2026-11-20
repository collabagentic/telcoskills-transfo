"use client";

import Link from "next/link";
import { useMemo } from "react";
import { recombiner } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/** Les fiches de la feuille de route de la personne, dans l'ordre ; vide si elle n'a pas encore répondu à une question. */
function useFichesDeLaFeuille(donnees: DonneesPubliques): string[] {
  const parcours = useParcours();
  const reponses = parcours?.reponses;
  return useMemo(() => {
    if (!reponses || Object.keys(reponses).length === 0) return [];
    const feuille = recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines);
    return [...new Set(feuille.etapes.flatMap((e) => e.fiches))];
  }, [donnees, reponses]);
}

/** Lien de retour en tête de fiche, et état « acquise ». */
export function HautDeFiche({ ficheId }: { ficheId: string }) {
  const parcours = useParcours();
  const acquise = Boolean(parcours?.fiches[ficheId]?.acquis);
  return (
    <>
      <Link href="/cockpit" className="retour">
        ‹ Mon cockpit
      </Link>
      {acquise ? (
        <span className="pastille" style={{ color: "var(--teinte-ok)" }}>
          ✓ acquise
        </span>
      ) : null}
    </>
  );
}

/** Bas de fiche : « Fiche suivante » selon la feuille de route, ou « Composer ma feuille de route » sans réponse. */
export function SuiteFiche({ ficheId, donnees }: { ficheId: string; donnees: DonneesPubliques }) {
  const liste = useFichesDeLaFeuille(donnees);
  const i = liste.indexOf(ficheId);
  if (liste.length === 0) {
    return (
      <div className="suite-fiche">
        <p>Et vous, que change-t-il dans votre métier ?</p>
        <Link className="btn btn-principal" href="/roadmap">
          Composer ma feuille de route
        </Link>
      </div>
    );
  }
  const suivante = i >= 0 && i + 1 < liste.length ? liste[i + 1] : null;
  return (
    <div className="suite-fiche">
      <Link className="btn btn-lien" href="/cockpit">
        Mon cockpit
      </Link>
      {suivante ? (
        <Link className="btn btn-principal" href={`/fiche/${suivante}`}>
          Fiche suivante →
        </Link>
      ) : (
        <Link className="btn btn-principal" href="/cockpit">
          Retour à mon cockpit
        </Link>
      )}
    </div>
  );
}

