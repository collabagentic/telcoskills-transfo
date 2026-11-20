"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ligneDe } from "@/lib/metro";
import { useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

/**
 * Fil d'Ariane en carte de métro, collé en haut de la fiche : la ligne du domaine, resserrée sur la station courante.
 * Les stations faites sont pleines, la courante est cerclée d'orange, les suivantes sont creuses. Un prérequis venu d'un autre domaine
 * est une « correspondance » : il part de sa station vers l'autre ligne.
 */
export function FilMetro({ donnees, competence, titreFiche }: { donnees: DonneesPubliques; competence: string; titreFiche: string }) {
  const parcours = useParcours();
  const ligne = useMemo(() => ligneDe(donnees.graphe, competence, { maitrisees: parcours?.maitrisees ?? [], fiches: parcours?.fiches ?? {} }), [donnees, competence, parcours]);
  if (!ligne) return null;
  const nomLigne = donnees.domaines[ligne.domaine] ?? ligne.domaine;
  return (
    <nav className="metro no-print" aria-label="Où vous en êtes dans votre feuille de route">
      <p className="metro-fil">
        <Link href="/cockpit">Mon cockpit</Link> › <span>{nomLigne}</span> › <strong>{titreFiche}</strong>
      </p>
      <ol className="metro-ligne">
        {ligne.avant > 0 ? (
          <li className="metro-reste" aria-label={`${ligne.avant} stations avant`}>
            ‹ {ligne.avant}
          </li>
        ) : null}
        {ligne.stations.map((s) => (
          <li key={s.id} className={`metro-station metro-${s.etat}${s.faite ? " metro-faite" : ""}${s.correspondance ? " metro-echange" : ""}`}>
            <Link href={`/competence/${s.id}`} title={s.titre} aria-current={s.etat === "courante" ? "step" : undefined}>
              <span className="metro-point" aria-hidden="true" />
              <span className="metro-nom">{s.titre}</span>
              <span className="sr-only">{s.faite ? " (acquise)" : s.etat === "courante" ? " (vous êtes ici)" : " (à faire)"}</span>
            </Link>
            {s.correspondance ? (
              <Link className="metro-branche" href={`/competence/${s.correspondance.id}`} title={s.correspondance.titre}>
                <span className="metro-branche-nom">{s.correspondance.titre}</span>
                <span className="metro-branche-ligne">ligne {donnees.domaines[s.correspondance.domaine] ?? s.correspondance.domaine}</span>
              </Link>
            ) : null}
          </li>
        ))}
        {ligne.apres > 0 ? (
          <li className="metro-reste" aria-label={`${ligne.apres} stations après`}>
            + {ligne.apres} ›
          </li>
        ) : null}
      </ol>
      <p className="metro-position">
        Station {ligne.position} sur {ligne.total}
      </p>
    </nav>
  );
}
