"use client";

import { basculerMaitrisee, useParcours } from "@/lib/stockage";

/** « Je maîtrise déjà » : la compétence passe en « faite » et sort du chemin restant. */
export function Maitrise({ id }: { id: string }) {
  const parcours = useParcours();
  const oui = parcours?.maitrisees.includes(id) ?? false;
  return (
    <button type="button" className={`btn${oui ? "" : " btn-principal"}`} aria-pressed={oui} onClick={() => basculerMaitrisee(id)}>
      {oui ? "✓ Maîtrisée · annuler" : "Je maîtrise déjà"}
    </button>
  );
}
