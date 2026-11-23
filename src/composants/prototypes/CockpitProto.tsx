"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { DonneesPubliques } from "@/contenu/publiques";
import { blocsProgramme, competenceFaite, etatsEtapes, prochaineEtape, recombiner, type Avancement, type Etape } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";

const NIVEAUX = [
  ["fondamental", "Fondamental"],
  ["intermediaire", "Intermédiaire"],
  ["avance", "Avancé"],
  ["transverse", "Transverse"],
] as const;
const SANS_REPONSE: Record<string, string> = {};
const DEMO = 13;

type Kind = "faite" | "courant" | "disponible" | "avenir";
const LIBELLE: Record<Kind, string> = { faite: "acquise", courant: "à reprendre", disponible: "disponible", avenir: "à venir" };

function Point({ k }: { k: Kind }) {
  return <span className={`pv-point pv-point-${k}`} aria-hidden="true" />;
}

/**
 * Le cockpit retenu (direction B) : le parcours groupé par niveau, comme une formation. Chaque domaine est un chapitre avec ses étapes ;
 * le bouton orange est sur l'étape à reprendre. Données réelles de la personne, ou avancement d'exemple si elle n'a rien répondu.
 * Les fiches ouvertes d'ici sont celles du prototype D (B et C mêlés).
 */
export function CockpitProto({ donnees }: { donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const reponses = parcours?.reponses ?? SANS_REPONSE;
  const reel = Object.keys(reponses).length > 0;
  const feuille = useMemo(() => recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines), [donnees, reponses]);
  const avancement: Avancement = useMemo(
    () => (reel && parcours ? parcours : { maitrisees: feuille.etapes.slice(0, DEMO).map((e) => e.id), fiches: {} }),
    [reel, parcours, feuille],
  );
  const etats = useMemo(() => etatsEtapes(feuille, avancement), [feuille, avancement]);
  const blocs = useMemo(() => blocsProgramme(feuille), [feuille]);
  const suivante = prochaineEtape(feuille, avancement);

  const faites = feuille.etapes.filter((e) => competenceFaite(e, avancement)).length;
  const total = feuille.etapes.length;
  const genre = (e: Etape): Kind => (etats[e.id] === "faite" ? "faite" : suivante?.id === e.id ? "courant" : etats[e.id] === "disponible" ? "disponible" : "avenir");
  const lien = (e: Pick<Etape, "id" | "fiches">) => (e.fiches.length > 0 ? `/prototypes/d/fiche/${e.fiches[0]}` : `/competence/${e.id}`);
  const nom = (d: string) => donnees.domaines[d] ?? d;

  return (
    <div className="pv-cockpit pv-cockpit-b">
      <h1 className="pv-titre pv-titre-page">Mon parcours</h1>
      <p className="pv-chapo-bas">
        {faites} étape{faites > 1 ? "s" : ""} maîtrisée{faites > 1 ? "s" : ""} sur {total}.
      </p>
      {!reel ? (
        <p className="pv-demo">
          Avancement d'exemple : vos réponses ne sont pas encore enregistrées. <Link href="/roadmap">Composer ma feuille de route</Link> pour voir la vôtre.
        </p>
      ) : null}

      {NIVEAUX.map(([niveau, libelle]) => {
        const chapitres = blocs.map((b) => ({ domaine: b.domaine, etapes: b.etapes.filter((e) => e.niveau === niveau) })).filter((b) => b.etapes.length > 0);
        if (chapitres.length === 0) return null;
        return (
          <section key={niveau} className="pv-niveau">
            <h2>{libelle}</h2>
            {chapitres.map((b) => {
              const f = b.etapes.filter((e) => competenceFaite(e, avancement)).length;
              return (
                <details key={b.domaine} className="pv-chapitre" open={b.etapes.some((e) => e.id === suivante?.id)}>
                  <summary>
                    <b>{nom(b.domaine)}</b>
                    <span className="pv-compte">
                      {f}/{b.etapes.length}
                    </span>
                  </summary>
                  <ol>
                    {b.etapes.map((e) => (
                      <li key={e.id} data-courante={genre(e) === "courant" ? "oui" : "non"}>
                        <Point k={genre(e)} />
                        <Link href={lien(e)}>{e.titre}</Link>
                        {genre(e) === "courant" ? (
                          <Link className="btn btn-principal" href={lien(e)}>
                            Reprendre
                          </Link>
                        ) : (
                          <span className="pv-etat">{LIBELLE[genre(e)]}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </details>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
