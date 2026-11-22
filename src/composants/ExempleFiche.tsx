import Link from "next/link";
import { titreFiche } from "@/contenu/lecture";
import type { Fiche } from "@/contenu/schemas";

/** Fiche d'exemple de l'accueil : textes lus du contenu au build, jamais recopiés. */
export function ExempleFiche({ fiche }: { fiche: Fiche }) {
  const avis = new Set(fiche.avisAuteur ?? []);
  const etiquette = <span className="avis-auteur">avis d'auteur</span>;
  return (
    <section className="exemple-fiche" aria-labelledby="exemple-titre">
      <h2 id="exemple-titre" className="exemple-titre">
        Un exemple, pour de vrai
      </h2>
      <p className="exemple-sous-titre">{titreFiche(fiche)}</p>

      <div className="avant-apres">
        {fiche.resume.avant ? (
          <>
            <div className="couche panneau panneau-avant">
              <span className="pastille">Avant</span>
              <p>{fiche.resume.avant}</p>
            </div>
            <span className="fleche fleche-h" aria-hidden="true">→</span>
            <span className="fleche fleche-v" aria-hidden="true">↓</span>
          </>
        ) : null}
        <div className="couche-chaude panneau panneau-apres">
          <span className="pastille">Après</span>
          <p>{fiche.resume.apres}</p>
        </div>
      </div>
      {avis.has("resume") ? (
        <p className="exemple-avis">
          {etiquette} Le résumé « avant » / « après » décrit une pratique, il n'est pas tiré des sources.
        </p>
      ) : null}

      {fiche.reflexe ? (
        <div className="exemple-reflexe">
          <span className="pastille">
            Le réflexe à lâcher {avis.has("reflexe") ? etiquette : null}
          </span>
          <p>« {fiche.reflexe} »</p>
        </div>
      ) : null}

      <div className="exemple-lien">
        <Link className="btn" href={"/fiche/" + fiche.id}>
          Lire la fiche →
        </Link>
      </div>
    </section>
  );
}
