"use client";

import Link from "next/link";
import { useParcours } from "@/lib/stockage";

/** « Ma feuille de route » apparaît dès qu'il y a une réponse enregistrée (lue après hydratation : rien au rendu serveur, pas de saut). */
export function EnTete() {
  const parcours = useParcours();
  const actif = parcours !== null && Object.keys(parcours.reponses).length > 0;
  return (
    <header className="entete">
      <Link href="/" className="logo">
        TelcoSkills
      </Link>
      {actif ? (
        <Link href="/cockpit" className="pilule-lien">
          Mon cockpit
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </header>
  );
}
