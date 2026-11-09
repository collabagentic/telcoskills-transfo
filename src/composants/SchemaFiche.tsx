import type { SchemaFiche as Schema } from "@/contenu/schemas";

type Chaine = NonNullable<Schema["avant"]>;

function Fleche() {
  return (
    <svg className="schema-fleche" viewBox="0 0 28 12" aria-hidden="true">
      <path d="M1 6h24M20 1.5 26 6l-6 4.5" />
    </svg>
  );
}

function Rangee({ etiquette, chaine, ton }: { etiquette: string; chaine: Chaine; ton: "avant" | "apres" }) {
  return (
    <div className={`schema-rangee schema-${ton}`}>
      <span className="pastille schema-etiquette">{etiquette}</span>
      <ol className="schema-chaine">
        {chaine.map((e, i) => (
          <li key={`${e.texte}-${i}`} className="schema-etape">
            {i > 0 ? <Fleche /> : null}
            <span className="schema-boite">
              <strong>{e.texte}</strong>
              {e.detail ? <small>{e.detail}</small> : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Schéma de la fiche, rendu dans le HTML statique (aucun JavaScript) : une chaîne d'étapes « avant », puis « après ». */
export function SchemaFiche({ schema }: { schema: Schema }) {
  return (
    <figure className="schema couche" aria-label={schema.legende}>
      <figcaption className="pastille">{schema.legende}</figcaption>
      {schema.avant ? <Rangee etiquette="Avant" chaine={schema.avant} ton="avant" /> : null}
      <Rangee etiquette={schema.avant ? "Après" : "Le mécanisme"} chaine={schema.apres} ton="apres" />
    </figure>
  );
}
