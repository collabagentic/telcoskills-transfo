"use client";

import Link from "next/link";
import { useState } from "react";

export type OptionMetier = { id: string; nom: string; accroche: string; disponible: boolean; enRelecture?: boolean };

/** Sélecteur de métier en segments ; une seule action principale : « Voir ce qui change ». */
export function ChoixMetier({ metiers }: { metiers: OptionMetier[] }) {
  const premier = metiers.find((m) => m.disponible)?.id ?? "";
  const [choix, setChoix] = useState(premier);
  return (
    <div className="choix">
      <p className="question-metier" id="question-metier">
        Quel est votre métier aujourd'hui ?
      </p>
      <div className="segments" role="radiogroup" aria-labelledby="question-metier">
        {metiers.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            className="segment"
            aria-checked={choix === m.id}
            aria-disabled={!m.disponible}
            onClick={() => m.disponible && setChoix(m.id)}
          >
            {m.nom}
            <small>{m.disponible ? m.accroche : "bientôt"}</small>
          </button>
        ))}
      </div>
      <div className="action-accueil">
        {choix ? (
          <Link className="btn btn-principal" href={`/metier/${choix}`}>
            Voir ce qui change
          </Link>
        ) : null}
      </div>
    </div>
  );
}
