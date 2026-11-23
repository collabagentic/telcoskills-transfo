"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Direction } from "@/app/prototypes/directions";
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

/** Les trois cockpits partagent les mêmes données : la vraie feuille de route de la personne, ou un avancement d'exemple si elle n'a rien répondu. */
export function CockpitProto({ donnees, dir }: { donnees: DonneesPubliques; dir: Direction }) {
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
  const lien = (e: Pick<Etape, "id" | "fiches">) => (e.fiches.length > 0 ? `/prototypes/${dir}/fiche/${e.fiches[0]}` : `/competence/${e.id}`);
  const nom = (d: string) => donnees.domaines[d] ?? d;

  const entete = (
    <>
      <h1 className="pv-titre pv-titre-page">{dir === "b" ? "Mon parcours" : dir === "c" ? "Ma carte" : "Mon cockpit"}</h1>
      <p className="pv-chapo-bas">
        {faites} étape{faites > 1 ? "s" : ""} maîtrisée{faites > 1 ? "s" : ""} sur {total}.
      </p>
      {!reel ? (
        <p className="pv-demo">
          Avancement d'exemple : vos réponses ne sont pas encore enregistrées. <Link href="/roadmap">Composer ma feuille de route</Link> pour voir la vôtre.
        </p>
      ) : null}
    </>
  );

  const reprise = suivante ? (
    <div className="pv-reprise">
      <div>
        <p className="pv-petit-titre">Reprendre là où vous en étiez</p>
        <p className="pv-reprise-titre">{suivante.titre}</p>
        <p className="pv-ou">{nom(suivante.domaine)}</p>
      </div>
      <Link className="btn btn-principal" href={lien(suivante)}>
        Reprendre
      </Link>
    </div>
  ) : null;

  if (dir === "a") {
    return (
      <div className="pv-cockpit pv-cockpit-a">
        {entete}
        {reprise}
        <div className="pv-domaines">
          {blocs.map((b) => {
            const f = b.etapes.filter((e) => competenceFaite(e, avancement)).length;
            return (
              <details key={b.domaine} open={b.etapes.some((e) => e.id === suivante?.id)} className="pv-domaine">
                <summary>
                  <span className="pv-domaine-nom">{nom(b.domaine)}</span>
                  <span className="pv-barre-fine" aria-hidden="true">
                    <i style={{ width: `${(f / b.etapes.length) * 100}%` }} />
                  </span>
                  <span className="pv-compte">
                    {f}/{b.etapes.length}
                  </span>
                </summary>
                <ul className="pv-lignes">
                  {b.etapes.map((e) => (
                    <li key={e.id} data-courante={genre(e) === "courant" ? "oui" : "non"}>
                      <Point k={genre(e)} />
                      <Link href={lien(e)}>{e.titre}</Link>
                      <span className="pv-etat">{LIBELLE[genre(e)]}</span>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </div>
    );
  }

  if (dir === "b") {
    return (
      <div className="pv-cockpit pv-cockpit-b">
        {entete}
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

  return <Carte entete={entete} blocs={blocs} genre={genre} lien={lien} nom={nom} suivante={suivante} faites={faites} />;
}

/** Direction C : une case par étape, rangées par domaine. L'état se lit à la forme (plein, anneau, trait plein, pointillé) et se dit dans le texte. */
function Carte({
  entete,
  blocs,
  genre,
  lien,
  nom,
  suivante,
  faites,
}: {
  entete: React.ReactNode;
  blocs: ReturnType<typeof blocsProgramme>;
  genre: (e: Etape) => Kind;
  lien: (e: Pick<Etape, "id" | "fiches">) => string;
  nom: (d: string) => string;
  suivante: Etape | null;
  faites: number;
}) {
  const [vue, setVue] = useState<Etape | null>(null);
  const montre = vue ?? suivante;
  return (
    <div className="pv-cockpit pv-cockpit-c">
      {entete}
      <div className="pv-lecture-case" aria-live="polite">
        {montre ? (
          <>
            <div>
              <p className="pv-reprise-titre">{montre.titre}</p>
              <p className="pv-ou">
                {nom(montre.domaine)} · {LIBELLE[genre(montre)]}
              </p>
            </div>
            <Link className={genre(montre) === "courant" ? "btn btn-principal" : "btn"} href={lien(montre)}>
              {genre(montre) === "courant" ? "Reprendre" : "Ouvrir"}
            </Link>
          </>
        ) : (
          <p className="pv-ou">Toutes les étapes sont maîtrisées ({faites}).</p>
        )}
      </div>
      <div className="pv-carte">
        {blocs.map((b) => {
          const f = b.etapes.filter((e) => genre(e) === "faite").length;
          return (
            <div key={b.domaine} className="pv-carte-ligne">
              <span className="pv-carte-nom">{nom(b.domaine)}</span>
              <span className="pv-cases">
                {b.etapes.map((e) => (
                  <Link
                    key={e.id}
                    href={lien(e)}
                    className={`pv-case pv-case-${genre(e)}`}
                    aria-label={`${e.titre}, ${nom(e.domaine)}, ${LIBELLE[genre(e)]}`}
                    onMouseEnter={() => setVue(e)}
                    onFocus={() => setVue(e)}
                  />
                ))}
              </span>
              <span className="pv-compte">
                {f}/{b.etapes.length}
              </span>
            </div>
          );
        })}
      </div>
      <ul className="pv-legende" aria-label="Légende">
        <li><i className="pv-case pv-case-faite" /> acquise</li>
        <li><i className="pv-case pv-case-courant" /> à reprendre</li>
        <li><i className="pv-case pv-case-disponible" /> disponible</li>
        <li><i className="pv-case pv-case-avenir" /> à venir</li>
      </ul>
    </div>
  );
}
