"use client";

import { marquerFiche, useParcours } from "@/lib/stockage";

/** Marque la fiche acquise (même stockage local que le site actuel). C'est la seule action en orange de la fiche. */
export function MarquerAcquis({ ficheId, libelle = "Marquer comme acquis" }: { ficheId: string; libelle?: string }) {
  const parcours = useParcours();
  if (parcours?.fiches[ficheId]?.acquis) return <span className="lc-acquis">Fiche acquise ✓</span>;
  return (
    <button type="button" className="btn btn-principal" onClick={() => marquerFiche(ficheId, "acquis")}>
      {libelle}
    </button>
  );
}
