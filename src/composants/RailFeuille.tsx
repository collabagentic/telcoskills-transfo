"use client";

import Link from "next/link";
import { useMemo } from "react";
import { competenceFaite, etatsEtapes, prochaineEtape, recombiner } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/**
 * Colonne de gauche de la fiche : où j'en suis dans MA feuille de route (avancement, étapes de cette ligne, suivante).
 * Sans réponse aux questions, elle propose de composer la feuille de route.
 */
export function RailFeuille({ donnees, competence }: { donnees: DonneesPubliques; competence: string }) {
  const parcours = useParcours();
  const reponses = parcours?.reponses;
  const avancement = useMemo(() => ({ maitrisees: parcours?.maitrisees ?? [], fiches: parcours?.fiches ?? {} }), [parcours]);
  const feuille = useMemo(
    () => (reponses && Object.keys(reponses).length > 0 ? recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines) : null),
    [donnees, reponses],
  );

  if (!feuille) {
    return (
      <div className="couche rail-carte">
        <p className="pastille">Ma feuille de route</p>
        <p className="cockpit-texte">Quelques questions, et cette fiche prend sa place dans votre parcours.</p>
        <Link className="btn btn-principal" href="/roadmap">
          Composer ma feuille de route
        </Link>
      </div>
    );
  }

  const etats = etatsEtapes(feuille, avancement);
  const faites = feuille.etapes.filter((e) => competenceFaite(e, avancement)).length;
  const total = feuille.etapes.length;
  const pourcentage = total ? Math.round((faites / total) * 100) : 0;
  const courante = feuille.etapes.find((e) => e.id === competence);
  const ligne = courante ? feuille.etapes.filter((e) => e.domaine === courante.domaine) : [];
  const suivante = prochaineEtape(feuille, avancement);

  return (
    <>
      <div className="couche rail-carte">
        <p className="pastille">Ma feuille de route</p>
        <p className="rail-pourcent">{pourcentage} %</p>
        <div className="rail-jauge" role="progressbar" aria-valuenow={pourcentage} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement de la feuille de route">
          <i style={{ width: `${pourcentage}%` }} />
        </div>
        <p className="cockpit-texte">
          {faites} étape{faites > 1 ? "s" : ""} sur {total}
        </p>
      </div>
      {ligne.length > 0 ? (
        <div className="couche rail-carte">
          <p className="pastille">Cette ligne</p>
          <ol className="rail-etapes">
            {ligne.map((e) => (
              <li key={e.id} className={`rail-etape rail-${e.id === competence ? "courante" : etats[e.id] === "faite" ? "faite" : "a-faire"}`}>
                <Link href={e.fiches[0] ? `/fiche/${e.fiches[0]}` : `/competence/${e.id}`}>{e.titre}</Link>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {suivante && suivante.id !== competence ? (
        <Link className="rail-suivant couche" href={suivante.fiches[0] ? `/fiche/${suivante.fiches[0]}` : `/competence/${suivante.id}`}>
          <span className="pastille">Suivant</span>
          <span>{suivante.titre} ›</span>
        </Link>
      ) : null}
    </>
  );
}
