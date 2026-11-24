import type { Metadata } from "next";
import Link from "next/link";
import "@/composants/lecon/lecon.css";
import { EXEMPLE, NOM_VARIANTE, VARIANTES } from "./variantes";

export const metadata: Metadata = { title: "Prototypes de fiche avec menu" };

export default function PagePrototypes() {
  return (
    <div className="lc-page">
      <div className="lc-cockpit">
        <h1 className="lc-titre lc-titre-page">Trois fiches avec un menu à gauche</h1>
        <p className="lc-chapo">
          Même contenu, mêmes couleurs du site. Dans les trois, le menu des étapes est à gauche et toutes les étapes sont des liens. La fiche actuelle de la branche, avec son menu de 7 étapes, reste
          disponible pour comparer.
        </p>
        <ul className="lc-liste-simple">
          {VARIANTES.map((v) => (
            <li key={v}>
              <h2 className="lc-phase">{`${NOM_VARIANTE[v].court} · ${NOM_VARIANTE[v].titre}`}</h2>
              <p>{NOM_VARIANTE[v].idee}</p>
              <p style={{ marginTop: "var(--e-2)" }}>
                <Link className="btn" href={`/prototypes/${v}/fiche/${EXEMPLE}`}>
                  Voir une fiche
                </Link>
              </p>
            </li>
          ))}
        </ul>
        <p className="lc-ou" style={{ marginTop: "var(--e-6)" }}>
          Pour comparer : <Link className="lc-lien" href={`/fiche/${EXEMPLE}`}>la fiche actuelle</Link>. Les 21 fiches existent dans chaque variante.
        </p>
      </div>
    </div>
  );
}
