import type { Metadata } from "next";
import Link from "next/link";
import { COCKPIT, EXEMPLE, FICHES, NOM_FICHE } from "./directions";
import "./proto.css";

export const metadata: Metadata = { title: "Prototypes de design" };

export default function PagePrototypes() {
  return (
    <div className="proto">
      <div className="pv-index">
        <h1 className="pv-titre pv-titre-page">Les prototypes retenus</h1>
        <p className="pv-chapo">
          Mêmes pages que le site, même contenu, couleurs des jetons du site (sombre et clair). Fond uni, presque pas d'ombres, titres en casse normale, orange réservé à l'action principale.
        </p>
        <h2 className="pv-index-h2">Fiches</h2>
        <ul className="pv-index-liste">
          {FICHES.map((d) => (
            <li key={d}>
              <h3>
                {NOM_FICHE[d].court} · {NOM_FICHE[d].titre}
              </h3>
              <p>{NOM_FICHE[d].idee}</p>
              <p className="pv-ou">Inspiration : {NOM_FICHE[d].inspiration}</p>
              <p className="pv-index-liens">
                <Link className="btn" href={`/prototypes/${d}/fiche/${EXEMPLE}`}>
                  Voir une fiche
                </Link>
              </p>
            </li>
          ))}
        </ul>
        <h2 className="pv-index-h2">Cockpit</h2>
        <ul className="pv-index-liste">
          <li>
            <h3>B · Le parcours par niveau</h3>
            <p>Le parcours groupé par niveau (fondamental, intermédiaire, avancé), un chapitre par domaine, le bouton orange sur l'étape à reprendre.</p>
            <p className="pv-index-liens">
              <Link className="btn" href={`/prototypes/${COCKPIT}/cockpit`}>
                Voir le cockpit
              </Link>
            </p>
          </li>
        </ul>
        <p className="pv-ou">
          Pour comparer : <Link href={`/fiche/${EXEMPLE}`}>la fiche actuelle</Link> · <Link href="/cockpit">le cockpit actuel</Link>. Les 21 fiches existent dans chaque direction.
        </p>
      </div>
    </div>
  );
}
