import type { Metadata } from "next";
import Link from "next/link";
import { DIRECTIONS, NOM_DIRECTION } from "./directions";
import "./proto.css";

export const metadata: Metadata = { title: "Prototypes de design" };

const EXEMPLE = "matrice-networkpolicy";

export default function PagePrototypes() {
  return (
    <div className="proto">
      <div className="pv-index">
        <h1 className="pv-titre pv-titre-page">Trois prototypes pour les fiches et le cockpit</h1>
        <p className="pv-chapo">
          Les mêmes pages que le site, avec le même contenu, refaites trois fois : fond uni, presque pas d'ombres, peu de grandes cartes, titres en casse normale, orange réservé à l'action
          principale. Les couleurs viennent des jetons du site, en sombre comme en clair.
        </p>
        <ul className="pv-index-liste">
          {DIRECTIONS.map((d) => (
            <li key={d}>
              <h2>
                {NOM_DIRECTION[d].court} · {NOM_DIRECTION[d].titre}
              </h2>
              <p>{NOM_DIRECTION[d].idee}</p>
              <p className="pv-ou">Inspiration : {NOM_DIRECTION[d].inspiration}</p>
              <p className="pv-index-liens">
                <Link className="btn" href={`/prototypes/${d}/fiche/${EXEMPLE}`}>
                  Voir une fiche
                </Link>
                <Link className="btn" href={`/prototypes/${d}/cockpit`}>
                  Voir le cockpit
                </Link>
              </p>
            </li>
          ))}
        </ul>
        <p className="pv-ou">
          Pour comparer : <Link href={`/fiche/${EXEMPLE}`}>la fiche actuelle</Link> · <Link href="/cockpit">le cockpit actuel</Link>. Les 21 fiches existent dans chaque direction (même adresse après le nom de la direction).
        </p>
      </div>
    </div>
  );
}
