import type { Lien } from "@/contenu/schemas";

const ACCES = { gratuit: 0, freemium: 1, payant: 2 } as const;
const NOM_TYPE = { cours: "Cours", video: "Vidéo", doc: "Documentation", opensource: "Open source", certif: "Certification", spec: "Spécification" } as const;
const USAGE = {
  comprendre: { titre: "Pour comprendre", types: ["cours", "video"] },
  pratiquer: { titre: "Pour pratiquer", types: ["opensource"] },
  approfondir: { titre: "Pour approfondir", types: ["doc", "spec", "certif"] },
} as const;

const rang = (l: Lien) => ACCES[l.acces ?? "payant"] * 2 + (l.langue === "fr" ? 0 : 1);
const PREFERENCE = { doc: 0, cours: 0, spec: 1, opensource: 2, video: 3, certif: 4 } as const;

/** La ressource à lire d'abord : le gratuit, puis une documentation ou un cours plutôt qu'une vidéo, en français si possible. */
export function premiereLecture(liens: Lien[]): Lien {
  return [...liens].sort((a, b) => Math.floor(rang(a) / 2) - Math.floor(rang(b) / 2) || PREFERENCE[a.type] - PREFERENCE[b.type] || rang(a) - rang(b))[0];
}

/**
 * Colonne de droite : le prochain geste en trois temps (lire, se structurer, s'éprouver) et les autres ressources, repliées par usage.
 * Composant serveur : tout est dans le HTML.
 */
export function GesteFiche({ liens, minutes }: { liens: Lien[]; minutes: number }) {
  const premiere = premiereLecture(liens);
  const autres = liens.filter((l) => l.url !== premiere.url);
  return (
    <>
      <div className="couche geste-carte geste-principal">
        <p className="pastille">1 · À lire d'abord</p>
        <a className="geste-lien" href={premiere.url} target="_blank" rel="noopener noreferrer">
          {premiere.nom}
        </a>
        <p className="cockpit-texte">
          {NOM_TYPE[premiere.type]}
          {premiere.acces ? ` · ${premiere.acces}` : ""}
          {premiere.langue ? ` · ${premiere.langue === "fr" ? "français" : "anglais"}` : ""}
        </p>
        <p className="cockpit-texte">La fiche elle-même se lit en {minutes} min.</p>
      </div>
      <div className="couche geste-carte geste-secondaire">
        <p className="pastille">2 · Se structurer</p>
        <p className="cockpit-texte">Un gabarit à copier pour poser la bonne question à votre IA.</p>
        <a className="btn" href="#prompt">
          Voir le prompt
        </a>
      </div>
      <div className="couche geste-carte geste-secondaire">
        <p className="pastille">3 · S'éprouver</p>
        <p className="cockpit-texte">Un cas, votre raisonnement, puis « Je l'avais » ou « À revoir ».</p>
        <a className="btn" href="#epreuve">
          Aller à l'épreuve
        </a>
      </div>
      {autres.length > 0 ? (
        <div className="couche geste-carte geste-secondaire">
          <p className="pastille">Autres ressources</p>
          {Object.values(USAGE).map((u) => {
            const l = autres.filter((x) => (u.types as readonly string[]).includes(x.type)).sort((a, b) => rang(a) - rang(b));
            if (l.length === 0) return null;
            return (
              <details key={u.titre}>
                <summary>
                  {u.titre} ({l.length})
                </summary>
                <ul className="geste-liste">
                  {l.map((x) => (
                    <li key={x.url}>
                      <a href={x.url} target="_blank" rel="noopener noreferrer">
                        {x.nom}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
