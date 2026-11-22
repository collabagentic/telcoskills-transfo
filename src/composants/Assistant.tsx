"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { apercuDomaines, priorites, recombiner, type Etape } from "@/lib/parcours";
import { recommencer, repondre, useParcours } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";
import "./assistant.css";

const SANS_REPONSE: Record<string, string> = {};

/** Où aller pour une étape : sa première fiche de transformation si elle en a une, sinon la page de la compétence. */
function lienEtape(e: Pick<Etape, "id" | "fiches">): string {
  return e.fiches.length > 0 ? "/fiche/" + e.fiches[0] : "/competence/" + e.id;
}

/**
 * L'assistant : une question par écran, et à côté, les groupes de compétences qui se raffinent en direct.
 * Avant toute réponse, un écran d'entrée annonce le cadre ; à l'arrivée, la restitution dit ce qui est déjà acquis
 * puis trois priorités au plus pour commencer. Dès qu'une réponse est donnée, on peut ouvrir le cockpit sans finir.
 */
export function Assistant({ donnees }: { donnees: DonneesPubliques }) {
  const parcours = useParcours();
  const reponses = parcours?.reponses ?? SANS_REPONSE;
  const questions = donnees.questions;
  const premiereLibre = questions.findIndex((q) => !reponses[q.id]);
  const [choix, setChoix] = useState<number | null>(null);
  // L'écran d'entrée ne s'affiche qu'avant toute réponse, tant que « Commencer » n'a pas été cliqué.
  const [commence, setCommence] = useState(false);
  const repondues = questions.filter((x) => reponses[x.id]).length;
  const entree = repondues === 0 && !commence;
  // Par défaut : la première question sans réponse ; l'écran final quand tout est répondu.
  const indice = Math.min(choix ?? (premiereLibre === -1 ? questions.length : premiereLibre), questions.length);
  const fin = !entree && indice >= questions.length;
  const q = !entree && !fin ? questions[indice] : null;

  const feuille = useMemo(() => recombiner(donnees.graphe, questions, reponses, donnees.domaines), [donnees, questions, reponses]);
  const apercu = useMemo(() => apercuDomaines(donnees.graphe, feuille, Object.keys(donnees.domaines)), [donnees, feuille]);
  const parId = useMemo(() => new Map(donnees.graphe.map((c) => [c.id, c])), [donnees.graphe]);
  const acquises = useMemo(() => feuille.acquises.filter((id) => parId.has(id)).map((id) => parId.get(id)!), [feuille.acquises, parId]);
  const lesPriorites = useMemo(() => priorites(feuille), [feuille]);

  const choisir = (idQuestion: string, option: string, dejaChoisie: boolean) => {
    repondre(idQuestion, dejaChoisie ? null : option);
    // Une réponse donnée fait passer à la question suivante, après un court instant pour voir le groupe bouger.
    if (!dejaChoisie) window.setTimeout(() => setChoix(indice + 1), 450);
  };

  return (
    <div className="assistant">
      <section className="assistant-question" aria-live="polite">
        {entree ? (
          <div className="entree-assistant">
            <p className="pastille">Avant de commencer</p>
            <h1 className="titre-question">Composez votre feuille de route</h1>
            <p className="entree-annonce">
              {questions.length} questions · environ 2 minutes · sans compte · vos réponses restent dans votre navigateur
            </p>
            <button type="button" className="btn btn-principal" onClick={() => setCommence(true)}>
              Commencer
            </button>
          </div>
        ) : (
          <>
            <ol className="etapes-assistant" aria-label="Questions">
              {questions.map((x, i) => (
                <li key={x.id}>
                  <button
                    type="button"
                    className={`point-assistant${i === indice ? " point-courant" : ""}${reponses[x.id] ? " point-repondu" : ""}`}
                    aria-label={`Question ${i + 1}${reponses[x.id] ? " (répondue)" : ""}`}
                    aria-current={i === indice ? "step" : undefined}
                    onClick={() => setChoix(i)}
                  />
                </li>
              ))}
            </ol>

            {q ? (
              <>
                <p className="pastille">
                  Question {indice + 1} sur {questions.length}
                </p>
                <h1 className="titre-question">{q.texte}</h1>
                {q.aide ? <p className="sous-titre">{q.aide}</p> : null}
                <div className="options-assistant" role="radiogroup" aria-label={q.texte}>
                  {q.options.map((o) => {
                    const choisie = reponses[q.id] === o.id;
                    return (
                      <button key={o.id} type="button" role="radio" aria-checked={choisie} className={`option-grande${choisie ? " option-grande-on" : ""}`} onClick={() => choisir(q.id, o.id, choisie)}>
                        <span>{o.libelle}</span>
                        {o.detail ? <small>{o.detail}</small> : null}
                      </button>
                    );
                  })}
                </div>
                <div className="navigation-assistant">
                  <button type="button" className="btn btn-lien" disabled={indice === 0} onClick={() => setChoix(indice - 1)}>
                    ‹ Précédente
                  </button>
                  <button type="button" className="btn btn-lien" onClick={() => setChoix(indice + 1)}>
                    {reponses[q.id] ? "Suivante ›" : "Passer ›"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="pastille">Terminé</p>
                <h1 className="titre-question">Votre feuille de route est prête.</h1>
                {acquises.length > 0 ? (
                  <section className="bilan-acquis">
                    <h2 className="bilan-titre">Ce que vous maîtrisez déjà</h2>
                    <ul className="liste-acquis">
                      {acquises.map((c) => (
                        <li key={c.id}>{c.titre}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                <section className="bilan-priorites">
                  <h2 className="bilan-titre">Par où commencer</h2>
                  {lesPriorites.length > 0 ? (
                    <ol className="liste-priorites">
                      {lesPriorites.map((e) => (
                        <li key={e.id}>
                          <Link className="priorite" href={lienEtape(e)}>
                            <span className="priorite-titre">{e.titre}</span>
                            <span className="priorite-raison">{e.pourquoi}</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="sous-titre">Votre feuille de route complète vous attend dans le cockpit.</p>
                  )}
                </section>
                <div className="navigation-assistant">
                  <button type="button" className="btn btn-lien" onClick={() => setChoix(0)}>
                    ‹ Modifier mes réponses
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {repondues > 0 ? (
          <div className="sortie-assistant">
            <Link className="btn btn-principal" href="/cockpit">
              Voir toute ma feuille de route →
            </Link>
            <button
              type="button"
              className="btn btn-lien"
              onClick={() => {
                recommencer();
                setCommence(false);
              }}
            >
              Recommencer
            </button>
          </div>
        ) : null}
      </section>

      <section className="apercu" aria-label="Aperçu de votre feuille de route">
        <div className="apercu-entete" aria-live="polite">
          <p className="pastille">{feuille.complete ? "Tout ce qui existe" : "Ce qui vous reste à faire"}</p>
          <p className="apercu-chiffre mono">
            {feuille.etapes.length}
            <small> / {donnees.graphe.length} compétences</small>
          </p>
          <p className="cockpit-texte">
            {feuille.complete ? "Voici les dix domaines. Chaque réponse les resserre sur vous." : `${feuille.acquises.length} déjà acquises · ${donnees.graphe.length - feuille.etapes.length - feuille.acquises.length} hors de votre parcours`}
          </p>
        </div>
        <ul className="groupes">
          {apercu.map((d) => {
            const part = d.total ? Math.round((d.etapes / d.total) * 100) : 0;
            const etat = d.etapes === 0 ? (d.acquises === d.total ? "acquis" : "hors") : feuille.complete ? "tout" : "garde";
            return (
              <li key={d.domaine} className={`groupe-apercu groupe-${etat}`}>
                <div className="groupe-haut">
                  <span className="groupe-nom">{donnees.domaines[d.domaine]}</span>
                  <span className="groupe-nombre mono">{d.etapes}</span>
                </div>
                <div className="groupe-barre" aria-hidden="true">
                  <span style={{ width: `${part}%` }} />
                </div>
                <p className="groupe-note">
                  {etat === "hors" ? "hors de votre parcours" : etat === "acquis" ? "déjà acquis" : feuille.complete ? `${d.total} compétences` : `sur ${d.total}${d.acquises > 0 ? ` · ${d.acquises} acquises` : ""}`}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
