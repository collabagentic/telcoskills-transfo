"use client";

import { useBilan } from "@/lib/stockage";

type Props = {
  genre: "transposition" | "nouveaute";
  resume: { avant: string | null; apres: string };
  /** Pour chaque métier, les savoir-faire qui renvoient à cette fiche. */
  lies: Record<string, string[]>;
  technos: { id: string; nom: string }[];
};

/**
 * Composant signature « Avant → Après ». Sans JavaScript, les deux panneaux sont dans le HTML.
 * Une fiche « à découvrir » (savoir-faire décoché) masque la colonne « Avant » ; une nouveauté n'en a pas.
 */
export function AvantApres({ genre, resume, lies, technos }: Props) {
  const bilan = useBilan();
  const sf = bilan ? (lies[bilan.metier] ?? []) : [];
  const decouvrir = sf.length > 0 && sf.every((id) => bilan?.decoches.includes(id));
  const montrerAvant = genre === "transposition" && resume.avant !== null && !decouvrir;

  return (
    <div>
      <div className="avant-apres" style={montrerAvant ? undefined : { gridTemplateColumns: "1fr" }}>
        {montrerAvant ? (
          <>
            <div className="couche panneau panneau-avant">
              <span className="pastille">Avant</span>
              <p>{resume.avant}</p>
            </div>
            <span className="fleche fleche-h" aria-hidden="true">
              →
            </span>
            <span className="fleche fleche-v" aria-hidden="true">
              ↓
            </span>
          </>
        ) : null}
        <div className="couche-chaude panneau panneau-apres">
          <span className="pastille">{decouvrir ? "À découvrir" : "Après"}</span>
          <p>{resume.apres}</p>
        </div>
      </div>
      {technos.length > 0 ? (
        <ul className="technos" aria-label="Technologies citées">
          {technos.map((t) => (
            <li key={t.id} className="techno">
              {t.nom}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
