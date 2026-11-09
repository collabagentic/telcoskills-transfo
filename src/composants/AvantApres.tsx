type Props = {
  genre: "transposition" | "nouveaute";
  resume: { avant: string | null; apres: string };
  technos: { id: string; nom: string }[];
};

/** Composant signature « Avant → Après », dans le HTML statique. Une nouveauté n'a pas de colonne « Avant ». */
export function AvantApres({ genre, resume, technos }: Props) {
  const montrerAvant = genre === "transposition" && resume.avant !== null;
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
          <span className="pastille">Après</span>
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
