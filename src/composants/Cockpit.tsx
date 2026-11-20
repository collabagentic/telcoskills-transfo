"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CarteTransformation } from "./CarteTransformation";
import { blocsProgramme, competenceFaite, etatsEtapes, prochaineEtape, recombiner, restantPour, type Avancement, type Etape } from "@/lib/parcours";
import { definirObjectif, effacerParcours, useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

const VIDE: Avancement = { maitrisees: [], fiches: {} };
const SANS_REPONSE: Record<string, string> = {};
const NIVEAU = { fondamental: "Fondamental", intermediaire: "Intermédiaire", avance: "Avancé", transverse: "Transverse" } as const;

/** Où aller pour une étape : sa première fiche de transformation si elle en a une, sinon la page de la compétence. */
function lienEtape(e: Pick<Etape, "id" | "fiches">): string {
  return e.fiches.length > 0 ? `/fiche/${e.fiches[0]}` : `/competence/${e.id}`;
}

/**
 * Le cockpit d'apprentissage : là où l'apprenant atterrit une fois ses choix faits.
 * Reprendre en un geste, voir sa progression par domaine, suivre un objectif, parcourir le programme ou la carte.
 */
export function Cockpit({ donnees }: { donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const reponses = parcours?.reponses ?? SANS_REPONSE;
  const avancement: Avancement = parcours ?? VIDE;
  const [vue, setVue] = useState<"programme" | "carte">("programme");
  const [ouverts, setOuverts] = useState<Record<string, boolean>>({});

  const repondu = Object.keys(reponses).length > 0;
  const feuille = useMemo(() => recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines), [donnees, reponses]);
  const etats = useMemo(() => etatsEtapes(feuille, avancement), [feuille, avancement]);
  const blocs = useMemo(() => blocsProgramme(feuille), [feuille]);

  if (!repondu) {
    return (
      <div className="vide">
        <h1 className="titre-page">Composez d'abord votre feuille de route</h1>
        <p>Quelques questions, et le cockpit organise votre programme.</p>
        <Link className="btn btn-principal" href="/roadmap">
          Répondre aux questions
        </Link>
      </div>
    );
  }

  const suivante = prochaineEtape(feuille, avancement);
  const faites = feuille.etapes.filter((e) => competenceFaite(e, avancement)).length;
  const total = feuille.etapes.length;
  const pourcentage = total ? Math.round((faites / total) * 100) : 0;
  const fichesDeLaFeuille = [...new Set(feuille.etapes.flatMap((e) => e.fiches))];
  const fichesAcquises = fichesDeLaFeuille.filter((f) => avancement.fiches[f]?.acquis).length;
  const fichesLues = fichesDeLaFeuille.filter((f) => avancement.fiches[f]?.lu).length;
  const objectif = parcours?.objectif && feuille.etapes.some((e) => e.id === parcours.objectif) ? parcours.objectif : null;
  const reste = objectif ? restantPour(objectif, feuille, avancement) : [];
  const blocSuivant = suivante?.domaine;
  const estOuvert = (d: string) => ouverts[d] ?? d === blocSuivant;

  return (
    <div className="cockpit-page">
      <aside className="rail" aria-label="Mon programme">
        <p className="pastille">Mon programme</p>
        <ul>
          {blocs.map((b) => {
            const f = b.etapes.filter((e) => competenceFaite(e, avancement)).length;
            return (
              <li key={b.domaine}>
                <a
                  href={`#bloc-${b.domaine}`}
                  className={`rail-lien${b.domaine === blocSuivant ? " rail-courant" : ""}`}
                  onClick={() => setOuverts((o) => ({ ...o, [b.domaine]: true }))}
                >
                  <span className="rail-nom">{donnees.domaines[b.domaine]}</span>
                  <span className="mono rail-compte">
                    {f}/{b.etapes.length}
                  </span>
                  <span className="rail-barre" aria-hidden="true">
                    <span style={{ width: `${b.etapes.length ? (f / b.etapes.length) * 100 : 0}%` }} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="rail-actions">
          <Link className="btn btn-lien" href="/roadmap">
            Modifier mes réponses
          </Link>
          <button
            type="button"
            className="btn btn-lien"
            onClick={() => {
              if (window.confirm("Effacer vos réponses et votre progression de ce navigateur ?")) effacerParcours();
            }}
          >
            Tout effacer
          </button>
        </div>
      </aside>

      <div className="cockpit-principal">
        <header className="entete-cockpit">
          <div>
            <p className="pastille">Mon cockpit</p>
            <h1 className="titre-page">{faites === 0 ? "Votre apprentissage commence ici." : suivante ? "Bon retour." : "Votre feuille de route est terminée."}</h1>
          </div>
          <button type="button" className="btn no-print" onClick={() => window.print()}>
            Imprimer
          </button>
        </header>

        {suivante ? (
          <Link className="couche-chaude reprendre-grand carte-reprise" href={lienEtape(suivante)}>
            <span className="pastille" style={{ color: "var(--accent-texte)" }}>
              {faites > 0 ? "Reprendre" : "Première étape"} · {donnees.domaines[suivante.domaine]} · {NIVEAU[suivante.niveau]}
            </span>
            <span className="reprendre-titre">{suivante.titre}</span>
            <span className="reprendre-pourquoi">Pourquoi : {suivante.pourquoi}</span>
            <span className="btn btn-principal">{suivante.fiches.length > 0 ? "Lire la fiche" : "Ouvrir la compétence"} →</span>
          </Link>
        ) : (
          <div className="couche reprendre-grand">
            <span className="reprendre-titre">Tout est fait. Bravo, sans confettis.</span>
          </div>
        )}

        <div className="cockpit cockpit-mesures">
          <div className="couche cockpit-carte">
            <span className="pastille">Étapes faites</span>
            <p className="cockpit-chiffre mono">
              {faites}
              <small> / {total}</small>
            </p>
            <div className="jauge" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={faites} aria-label="Étapes faites">
              <span style={{ width: `${pourcentage}%` }} />
            </div>
          </div>
          <div className="couche cockpit-carte">
            <span className="pastille">Fiches de transformation</span>
            <p className="cockpit-chiffre mono">
              {fichesAcquises}
              <small> / {fichesDeLaFeuille.length}</small>
            </p>
            <p className="cockpit-texte">acquises · {fichesLues} lues</p>
          </div>
          <div className="couche cockpit-carte">
            <label className="pastille" htmlFor="objectif">
              Mon objectif
            </label>
            <select id="objectif" className="selecteur" value={objectif ?? ""} onChange={(e) => definirObjectif(e.target.value || null)}>
              <option value="">Aucun objectif choisi</option>
              {feuille.etapes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.titre}
                </option>
              ))}
            </select>
            <p className="cockpit-texte">{objectif ? (reste.length === 0 ? "Objectif atteint." : `${reste.length} étape${reste.length > 1 ? "s" : ""} restante${reste.length > 1 ? "s" : ""}.`) : "Choisissez une cible : le chemin restant s'affiche."}</p>
          </div>
        </div>

        <div className="bascule no-print" role="group" aria-label="Affichage">
          <button type="button" className="btn btn-lien" aria-pressed={vue === "programme"} onClick={() => setVue("programme")}>
            Programme
          </button>
          <button type="button" className="btn btn-lien" aria-pressed={vue === "carte"} onClick={() => setVue("carte")}>
            Carte
          </button>
        </div>

        {vue === "carte" ? (
          <CarteTransformation feuille={feuille} etats={etats} objectif={objectif} suivante={suivante?.id ?? null} />
        ) : (
          <div className="programme">
            {blocs.map((b) => {
              const f = b.etapes.filter((e) => competenceFaite(e, avancement)).length;
              const ouvert = estOuvert(b.domaine);
              return (
                <section key={b.domaine} id={`bloc-${b.domaine}`} className="bloc couche">
                  <button type="button" className="bloc-entete" aria-expanded={ouvert} onClick={() => setOuverts((o) => ({ ...o, [b.domaine]: !ouvert }))}>
                    <span className="bloc-titre">{donnees.domaines[b.domaine]}</span>
                    <span className="mono bloc-compte">
                      {f} / {b.etapes.length}
                    </span>
                    <span className="rail-barre bloc-barre" aria-hidden="true">
                      <span style={{ width: `${b.etapes.length ? (f / b.etapes.length) * 100 : 0}%` }} />
                    </span>
                    <span className="bloc-chevron" aria-hidden="true">
                      {ouvert ? "−" : "+"}
                    </span>
                  </button>
                  {ouvert ? (
                    <ol className="bloc-etapes">
                      {b.etapes.map((e) => {
                        const etat = etats[e.id];
                        return (
                          <li key={e.id}>
                            <Link className={`ligne-plan${e.id === suivante?.id ? " ligne-suivante" : ""}${etat === "a-venir" ? " ligne-avenir" : ""}`} href={lienEtape(e)}>
                              <span className={`etat etat-${etat === "faite" ? "verifie" : "vide"}`} aria-hidden="true" />
                              <span className="titre">
                                {e.titre}
                                <small className="pourquoi">{e.pourquoi}</small>
                              </span>
                              {e.id === suivante?.id ? <span className="pastille" style={{ color: "var(--accent-texte)" }}>prochaine</span> : null}
                              {e.fiches.length > 0 ? <span className="pastille pastille-relecture">fiche</span> : null}
                              <span className="pastille">{NIVEAU[e.niveau]}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
