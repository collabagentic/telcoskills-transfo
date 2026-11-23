"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CarteTransformation } from "./CarteTransformation";
import "./lecon/lecon.css";
import { blocsProgramme, competenceFaite, etatsEtapes, prochaineEtape, recombiner, restantPour, type Avancement, type Etape } from "@/lib/parcours";
import { definirObjectif, effacerParcours, useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

const VIDE: Avancement = { maitrisees: [], fiches: {} };
const SANS_REPONSE: Record<string, string> = {};
const NIVEAUX = [
  ["fondamental", "Fondamental"],
  ["intermediaire", "Intermédiaire"],
  ["avance", "Avancé"],
  ["transverse", "Transverse"],
] as const;
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
  const nom = (d: string) => donnees.domaines[d] ?? d;
  const marque = (e: Etape) => (etats[e.id] === "faite" ? "faite" : e.id === suivante?.id ? "courant" : etats[e.id] === "disponible" ? "disponible" : "avenir");
  const LIBELLE = { faite: "acquise", courant: "à reprendre", disponible: "disponible", avenir: "à venir" } as const;
  const niveaux = NIVEAUX.map(([niveau, libelle]) => ({
    niveau,
    libelle,
    chapitres: blocs.map((b) => ({ domaine: b.domaine, etapes: b.etapes.filter((e) => e.niveau === niveau) })).filter((b) => b.etapes.length > 0),
  })).filter((n) => n.chapitres.length > 0);

  return (
    <div className="lc-page">
      <div className="lc-cockpit">
        <header className="lc-cockpit-tete">
          <div>
            <h1 className="lc-titre lc-titre-page">{faites === 0 ? "Votre apprentissage commence ici." : suivante ? "Bon retour." : "Votre feuille de route est terminée."}</h1>
            <p className="lc-chapo-bas">
              {faites} étape{faites > 1 ? "s" : ""} maîtrisée{faites > 1 ? "s" : ""} sur {total} · {fichesAcquises} fiche{fichesAcquises > 1 ? "s" : ""} acquise{fichesAcquises > 1 ? "s" : ""} sur{" "}
              {fichesDeLaFeuille.length} ({fichesLues} lue{fichesLues > 1 ? "s" : ""})
            </p>
          </div>
          <p className="lc-outils no-print">
            <button type="button" className="lc-lien-bouton" onClick={() => window.print()}>
              Imprimer
            </button>
            <Link href="/roadmap">Modifier mes réponses</Link>
            <button
              type="button"
              className="lc-lien-bouton"
              onClick={() => {
                if (window.confirm("Effacer vos réponses et votre progression de ce navigateur ?")) effacerParcours();
              }}
            >
              Tout effacer
            </button>
          </p>
        </header>

        <div className="lc-barre-fine lc-barre-prog" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={faites} aria-label="Étapes faites">
          <i style={{ width: `${pourcentage}%` }} />
        </div>

        {suivante ? (
          <div className="lc-reprise">
            <div>
              <p className="lc-petit-titre">
                {faites > 0 ? "Reprendre" : "Première étape"} · {nom(suivante.domaine)} · {NIVEAU[suivante.niveau]}
              </p>
              <p className="lc-reprise-titre">{suivante.titre}</p>
              <p className="lc-ou">Pourquoi : {suivante.pourquoi}</p>
            </div>
            <Link className="btn btn-principal" href={lienEtape(suivante)}>
              {suivante.fiches.length > 0 ? "Lire la fiche" : "Ouvrir la compétence"} →
            </Link>
          </div>
        ) : (
          <div className="lc-reprise">
            <p className="lc-reprise-titre">Tout est fait. Bravo, sans confettis.</p>
          </div>
        )}

        <div className="lc-objectif">
          <label htmlFor="objectif">Mon objectif</label>
          <select id="objectif" className="selecteur" value={objectif ?? ""} onChange={(e) => definirObjectif(e.target.value || null)}>
            <option value="">Aucun objectif choisi</option>
            {feuille.etapes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.titre}
              </option>
            ))}
          </select>
          <p className="lc-ou">{objectif ? (reste.length === 0 ? "Objectif atteint." : `${reste.length} étape${reste.length > 1 ? "s" : ""} restante${reste.length > 1 ? "s" : ""}.`) : "Choisissez une cible : le chemin restant s'affiche."}</p>
        </div>

        <div className="lc-bascule no-print" role="group" aria-label="Affichage">
          <button type="button" aria-pressed={vue === "programme"} onClick={() => setVue("programme")}>
            Programme
          </button>
          <button type="button" aria-pressed={vue === "carte"} onClick={() => setVue("carte")}>
            Carte
          </button>
        </div>

        {vue === "carte" ? (
          <CarteTransformation feuille={feuille} etats={etats} objectif={objectif} suivante={suivante?.id ?? null} />
        ) : (
          niveaux.map((n) => (
            <section key={n.niveau} className="lc-niveau">
              <h2>{n.libelle}</h2>
              {n.chapitres.map((b) => {
                const f = b.etapes.filter((e) => competenceFaite(e, avancement)).length;
                return (
                  <details key={b.domaine} id={`bloc-${b.domaine}-${n.niveau}`} className="lc-chapitre" open={ouverts[b.domaine + n.niveau] ?? b.etapes.some((e) => e.id === suivante?.id)}>
                    <summary
                      onClick={(ev) => {
                        ev.preventDefault();
                        const cle = b.domaine + n.niveau;
                        const courant = ouverts[cle] ?? b.etapes.some((e) => e.id === suivante?.id);
                        setOuverts((o) => ({ ...o, [cle]: !courant }));
                      }}
                    >
                      <b>{nom(b.domaine)}</b>
                      <span className="lc-compte">
                        {f}/{b.etapes.length}
                      </span>
                    </summary>
                    <ol>
                      {b.etapes.map((e) => (
                        <li key={e.id} data-courante={e.id === suivante?.id ? "oui" : "non"}>
                          <span className={`lc-point lc-point-${marque(e)}`} aria-hidden="true" />
                          <Link href={lienEtape(e)} className="lc-etape">
                            <span>{e.titre}</span>
                            <small>{e.pourquoi}</small>
                          </Link>
                          <span className="lc-etat">
                            {LIBELLE[marque(e)]}
                            {e.fiches.length > 0 ? " · fiche" : ""}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </details>
                );
              })}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
