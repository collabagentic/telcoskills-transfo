import type { Lecon } from "@/contenu/lecon";
import { Agrandir } from "@/composants/Agrandir";
import { Diagramme } from "@/composants/Diagramme";

export function Avis({ ok }: { ok: boolean }) {
  return ok ? <span className="lc-avis">avis d'auteur</span> : null;
}

export function Puces({ items }: { items: string[] }) {
  return (
    <ul className="lc-puces">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

/**
 * Le schéma détaillé de la fiche. Il tient dans la largeur de la colonne (pas de boîte à faire défiler) et s'ouvre à taille réelle
 * avec « Agrandir le schéma », comme sur le site actuel.
 */
export function DiagrammeFiche({ diagramme }: { diagramme: NonNullable<Lecon["diagramme"]> }) {
  return (
    <div className="lc-diagramme">
      <Agrandir>
        <Diagramme diagramme={diagramme} />
      </Agrandir>
    </div>
  );
}

const FLECHE = (
  <svg className="lc-fleche" viewBox="0 0 28 12" aria-hidden="true">
    <path d="M1 6h24M20 1.5 26 6l-6 4.5" />
  </svg>
);

type Chaine = NonNullable<Lecon["schema"]["avant"]>;

function Rangee({ titre, chaine, ton, estompe }: { titre: string; chaine: Chaine; ton: "avant" | "apres"; estompe: boolean }) {
  return (
    <div className={`lc-rangee lc-rangee-${ton}`} data-estompe={estompe ? "oui" : "non"}>
      <p className="lc-rangee-titre">{titre}</p>
      <ol className="lc-chaine">
        {chaine.map((e, i) => (
          <li key={`${e.texte}-${i}`}>
            {i > 0 ? FLECHE : null}
            <span className="lc-boite">
              <strong>{e.texte}</strong>
              {e.detail ? <small>{e.detail}</small> : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Le schéma « avant / après » de la fiche. `etape` choisit ce qui est mis en avant : l'avant, les deux ensemble (ce qui change),
 * ou l'après. Sans `etape`, tout est à plein. Le bleu des jetons marque l'après ; le texte dit aussi quelle rangée est laquelle.
 */
export function SchemaChaine({ schema, etape = "tout" }: { schema: Lecon["schema"]; etape?: "tout" | "avant" | "compare" | "apres" }) {
  return (
    <figure className="lc-schema" aria-label={schema.legende}>
      <figcaption>{schema.legende}</figcaption>
      {schema.avant ? <Rangee titre="Avant" chaine={schema.avant} ton="avant" estompe={etape === "apres"} /> : null}
      <Rangee titre={schema.avant ? "Après" : "Le mécanisme"} chaine={schema.apres} ton="apres" estompe={etape === "avant" && schema.avant !== null} />
    </figure>
  );
}
