import type { Lien } from "@/contenu/schemas";

const TYPE_LIEN = { cours: "Cours", video: "Vidéos", doc: "Documentation", opensource: "Open source", certif: "Certifications", spec: "Spécifications" } as const;
const ORDRE_TYPES = ["cours", "video", "doc", "opensource", "spec", "certif"] as const;
const ACCES = { gratuit: 0, freemium: 1, payant: 2 } as const;

/** Ressources groupées par type ; dans chaque groupe, le gratuit d'abord puis le français. Serveur : tout est dans le HTML. */
export function Ressources({ liens }: { liens: Lien[] }) {
  const groupes = ORDRE_TYPES.map(
    (type) =>
      [
        type,
        liens
          .filter((l) => l.type === type)
          .sort((a, b) => ACCES[a.acces ?? "payant"] - ACCES[b.acces ?? "payant"] || Number(b.langue === "fr") - Number(a.langue === "fr")),
      ] as const,
  ).filter(([, l]) => l.length > 0);
  if (groupes.length === 0) return <p className="cockpit-texte">Pas encore de ressource pour cette compétence.</p>;
  return (
    <>
      {groupes.map(([type, l]) => (
        <div className="ressources-groupe" key={type}>
          <h3 className="pastille">{TYPE_LIEN[type]}</h3>
          <ul className="ressources">
            {l.map((x) => (
              <li key={x.url}>
                <a className="ressource" href={x.url} target="_blank" rel="noopener noreferrer">
                  <span className="ressource-nom">{x.nom}</span>
                  <span className="ressource-meta">
                    {x.langue ? <span className="badge">{x.langue === "fr" ? "FR" : "EN"}</span> : null}
                    {x.acces ? <span className={`badge${x.acces === "gratuit" ? " badge-gratuit" : ""}`}>{x.acces}</span> : null}
                    {x.auteur ? <span className="ressource-auteur">{x.auteur}</span> : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
