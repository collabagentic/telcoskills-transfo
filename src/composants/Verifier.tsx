"use client";

import { useEffect, useRef, useState } from "react";
import { marquerFiche } from "@/lib/stockage";
import type { QuestionMelangee } from "@/contenu/lecture";

type Etat = { essais: number; resolue: boolean; choix: number | null };
const VIERGE: Etat = { essais: 0, resolue: false, choix: null };
const SANS_REPONSE = -1;

/**
 * Bloc « Vérifier » : 2 questions, options mélangées (graine stable par fiche), « je ne sais pas », explication après réponse,
 * un second essai. « Vérifié » = les deux questions justes du premier coup ou au second essai ; « je ne sais pas » ne vérifie pas.
 * Marque aussi la fiche « lue » quand on défile jusqu'ici.
 */
export function Verifier({ ficheId, questions }: { ficheId: string; questions: QuestionMelangee[] }) {
  const [etats, setEtats] = useState<Etat[]>(() => questions.map(() => VIERGE));
  const ancre = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cible = ancre.current;
    if (!cible || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        marquerFiche(ficheId, "lu");
        obs.disconnect();
      }
    });
    obs.observe(cible);
    return () => obs.disconnect();
  }, [ficheId]);

  const verifiee = etats.every((e) => e.resolue);
  useEffect(() => {
    if (verifiee) marquerFiche(ficheId, "verifie");
  }, [verifiee, ficheId]);

  const repondre = (qi: number, oi: number) => {
    setEtats((courant) =>
      courant.map((e, i) => {
        if (i !== qi || e.resolue || e.essais >= 2) return e;
        const juste = oi !== SANS_REPONSE && questions[qi].options[oi].juste;
        return { essais: e.essais + 1, resolue: juste, choix: oi };
      }),
    );
  };

  const echec = etats.some((e) => !e.resolue && e.essais >= 2);

  return (
    <section className="couche verifier" aria-labelledby="verifier-titre">
      <div ref={ancre} />
      <h2 id="verifier-titre">Vérifier</h2>
      {questions.map((q, qi) => {
        const e = etats[qi];
        const ferme = e.resolue || e.essais >= 2;
        return (
          <fieldset className="question" key={q.id}>
            <legend>
              {qi + 1}. {q.enonce}
            </legend>
            {q.options.map((o, oi) => {
              const choisie = e.choix === oi;
              const classe = ferme && o.juste ? " option-juste" : choisie && e.essais > 0 && !o.juste ? " option-faux" : "";
              return (
                <label className={`option${classe}`} key={o.texte}>
                  <input type="radio" name={q.id} checked={choisie} disabled={ferme} onChange={() => repondre(qi, oi)} />
                  <span>{o.texte}</span>
                </label>
              );
            })}
            <label className="option">
              <input type="radio" name={q.id} checked={e.choix === SANS_REPONSE} disabled={ferme} onChange={() => repondre(qi, SANS_REPONSE)} />
              <span>Je ne sais pas</span>
            </label>
            <div aria-live="polite">
              {e.essais > 0 ? (
                <p className="retour-question">
                  {e.resolue ? <strong>Juste. </strong> : e.essais < 2 ? <strong>Pas tout à fait. Lisez l'explication, puis réessayez. </strong> : <strong>La bonne réponse est signalée. </strong>}
                  {q.explication}{" "}
                  <span className="pastille" style={{ display: "inline" }}>
                    Source : {q.source}
                  </span>
                </p>
              ) : null}
            </div>
          </fieldset>
        );
      })}
      <div aria-live="polite">
        {verifiee ? (
          <p className="retour-question">
            <strong>Fiche vérifiée.</strong> Elle est notée dans votre plan.
          </p>
        ) : null}
        {echec ? (
          <button type="button" className="btn" onClick={() => setEtats(questions.map(() => VIERGE))}>
            Recommencer les questions
          </button>
        ) : null}
      </div>
    </section>
  );
}
