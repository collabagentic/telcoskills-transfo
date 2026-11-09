"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CarteTransformation } from "./CarteTransformation";
import { competenceFaite, etatsEtapes, prochaineEtape, recombiner, restantPour, type Avancement, type Etape } from "@/lib/parcours";
import { definirObjectif, effacerParcours, recommencer, repondre, useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

const VIDE: Avancement = { maitrisees: [], fiches: {} };
const SANS_REPONSE: Record<string, string> = {};

/** Écran large ? Faux au rendu serveur : la liste s'affiche d'abord, la carte prend le relais sur grand écran. */
function useEcranLarge(): boolean {
  return useSyncExternalStore(
    (rappel) => {
      const m = window.matchMedia("(min-width: 900px)");
      m.addEventListener("change", rappel);
      return () => m.removeEventListener("change", rappel);
    },
    () => window.matchMedia("(min-width: 900px)").matches,
    () => false,
  );
}

/** Où aller pour une étape : sa première fiche de transformation si elle en a une, sinon la page de la compétence. */
function lienEtape(e: Pick<Etape, "id" | "fiches">): string {
  return e.fiches.length > 0 ? `/fiche/${e.fiches[0]}` : `/competence/${e.id}`;
}

/**
 * La feuille de route vivante : des questions à gauche, la feuille de route recomposée en direct à droite, avec le cockpit.
 * Chaque réponse recalcule tout (moteur pur : src/lib/parcours.ts) ; rien n'est caché, chaque étape dit pourquoi elle est là.
 */
export function FeuilleVivante({ donnees }: { donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const large = useEcranLarge();
  const [choixVue, setChoixVue] = useState<"carte" | "liste" | null>(null);
  const reponses = parcours?.reponses ?? SANS_REPONSE;
  const avancement: Avancement = parcours ?? VIDE;

  const feuille = useMemo(() => recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines), [donnees, reponses]);
  const etats = useMemo(() => etatsEtapes(feuille, avancement), [feuille, avancement]);
  const suivante = prochaineEtape(feuille, avancement);
  const faites = feuille.etapes.filter((e) => competenceFaite(e, avancement)).length;
  const objectif = parcours?.objectif && feuille.etapes.some((e) => e.id === parcours.objectif) ? parcours.objectif : null;
  const reste = objectif ? restantPour(objectif, feuille, avancement) : [];
  const repondues = donnees.questions.filter((q) => reponses[q.id]).length;
  const vue = choixVue ?? (large ? "carte" : "liste");
  const pourcentage = feuille.etapes.length ? Math.round((faites / feuille.etapes.length) * 100) : 0;

  return (
    <div className="vivante">
      <aside className="questions-panneau" aria-label="Vos réponses">
        <div className="questions-entete">
          <p className="pastille">
            {repondues} réponse{repondues > 1 ? "s" : ""} sur {donnees.questions.length}
          </p>
          {repondues > 0 ? (
            <button type="button" className="btn btn-lien" onClick={() => recommencer()}>
              Recommencer
            </button>
          ) : null}
        </div>
        {donnees.questions.map((q, i) => (
          <fieldset className="question-orientation" key={q.id}>
            <legend>
              <span className="pastille">Question {i + 1}</span>
              {q.texte}
            </legend>
            {q.aide ? <p className="cockpit-texte">{q.aide}</p> : null}
            <div className="options-orientation" role="radiogroup" aria-label={q.texte}>
              {q.options.map((o) => {
                const choisie = reponses[q.id] === o.id;
                return (
                  <button key={o.id} type="button" role="radio" aria-checked={choisie} className={`option-pilule${choisie ? " option-pilule-on" : ""}`} onClick={() => repondre(q.id, choisie ? null : o.id)}>
                    {o.libelle}
                    {o.detail ? <small>{o.detail}</small> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </aside>

      <section className="feuille" aria-label="Votre feuille de route">
        <div className="entete-feuille" aria-live="polite">
          <h1 className="titre-page">{feuille.complete ? "La feuille de route complète" : "Votre feuille de route"}</h1>
          <p className="sous-titre">
            {feuille.complete
              ? `${feuille.etapes.length} compétences, reliées par leurs prérequis. Répondez aux questions : elle se resserre sur vous.`
              : `${feuille.etapes.length} étapes pour vous · ${feuille.acquises.length} déjà acquises · ${feuille.hors.length + feuille.ecartees.length} hors de votre parcours.`}
          </p>
        </div>

        <div className="cockpit cockpit-feuille">
          <div className="couche cockpit-carte">
            <span className="pastille">Où j'en suis</span>
            <p className="cockpit-chiffre mono">
              {faites}
              <small> / {feuille.etapes.length}</small>
            </p>
            <div className="jauge" role="progressbar" aria-valuemin={0} aria-valuemax={feuille.etapes.length} aria-valuenow={faites} aria-label="Étapes faites">
              <span style={{ width: `${pourcentage}%` }} />
            </div>
          </div>
          {suivante ? (
            <Link className="couche-chaude cockpit-carte carte-reprise" href={lienEtape(suivante)}>
              <span className="pastille" style={{ color: "var(--accent-texte)" }}>
                {faites > 0 ? "Reprendre" : "Pour commencer"}
              </span>
              <p className="cockpit-titre">{suivante.titre}</p>
              <span className="btn btn-principal">{suivante.fiches.length > 0 ? "Lire la fiche" : "Ouvrir"} →</span>
            </Link>
          ) : (
            <div className="couche cockpit-carte">
              <span className="pastille">Prochaine étape</span>
              <p className="cockpit-titre">Tout est fait.</p>
            </div>
          )}
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
            {objectif ? (
              reste.length === 0 ? (
                <p className="cockpit-texte">Objectif atteint.</p>
              ) : (
                <p className="cockpit-texte">
                  {reste.length} étape{reste.length > 1 ? "s" : ""} restante{reste.length > 1 ? "s" : ""}.
                </p>
              )
            ) : (
              <p className="cockpit-texte">Le chemin restant s'affiche sur la carte.</p>
            )}
          </div>
        </div>

        <div className="bascule no-print" role="group" aria-label="Affichage de la feuille de route">
          <button type="button" className="btn btn-lien" aria-pressed={vue === "carte"} onClick={() => setChoixVue("carte")}>
            Carte
          </button>
          <button type="button" className="btn btn-lien" aria-pressed={vue === "liste"} onClick={() => setChoixVue("liste")}>
            Liste
          </button>
        </div>

        {vue === "carte" ? (
          <CarteTransformation feuille={feuille} etats={etats} objectif={objectif} suivante={suivante?.id ?? null} />
        ) : (
          <ol className="liste-etapes">
            {feuille.etapes.map((e, i) => (
              <li key={e.id}>
                <Link className="ligne-plan" href={lienEtape(e)}>
                  <span className={`etat etat-${etats[e.id] === "faite" ? "verifie" : "vide"}`} aria-hidden="true" />
                  <span className="mono rang">{i + 1}</span>
                  <span className="titre">
                    {e.titre}
                    <small className="pourquoi">{e.pourquoi}</small>
                  </span>
                  {e.fiches.length > 0 ? <span className="pastille pastille-relecture">fiche</span> : null}
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div className="actions-plan">
          <button type="button" className="btn no-print" onClick={() => window.print()}>
            Imprimer
          </button>
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
      </section>
    </div>
  );
}
