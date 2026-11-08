"use client";

import Link from "next/link";
import { useBilan } from "@/lib/stockage";

/** « Mon plan » n'apparaît que s'il existe un bilan (lu après hydratation : rien au rendu serveur, pas de saut). */
export function EnTete() {
  const bilan = useBilan();
  return (
    <header className="entete">
      <Link href="/" className="logo">
        TelcoSkills
      </Link>
      {bilan ? (
        <Link href="/plan" className="pilule-lien">
          Mon plan
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </header>
  );
}
