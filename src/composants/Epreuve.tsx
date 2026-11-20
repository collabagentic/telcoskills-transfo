"use client";

import { useEffect, useRef, useState } from "react";
import { marquerFiche, useParcours } from "@/lib/stockage";

const MINIMUM = 15;

/**
 * Mise à l'épreuve : un cas à raisonner. La personne écrit d'abord son raisonnement (au moins une ligne) ; le raisonnement attendu
 * et sa source ne s'affichent qu'ensuite. Elle s'évalue : « Je l'avais » rend la fiche acquise, « À revoir » ne la change pas.
 * Le texte écrit n'est pas conservé. Marque aussi la fiche « lue » quand on défile jusqu'ici.
 */
export function Epreuve({ ficheId, cas, raisonnement, source }: { ficheId: string; cas: string; raisonnement: string; source: string }) {
  const parcours = useParcours();
  const [texte, setTexte] = useState("");
  const [vu, setVu] = useState(false);
  const [bilan, setBilan] = useState<"acquis" | "revoir" | null>(null);
  const ancre = useRef<HTMLDivElement>(null);
  const acquise = parcours?.fiches[ficheId]?.acquis;
  const pret = texte.trim().length >= MINIMUM;

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

  return (
    <section className="couche epreuve" id="epreuve" aria-labelledby="epreuve-titre">
      <div ref={ancre} />
      <p className="pastille">Mise à l'épreuve · 3 minutes</p>
      <h2 id="epreuve-titre">Un cas</h2>
      <p className="epreuve-cas">{cas}</p>

      <label className="epreuve-champ">
        <span>Votre raisonnement (ou celui de votre IA, après votre propre essai)</span>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={4} placeholder="Écrivez une ou deux phrases, même approximatives." disabled={vu} />
      </label>

      {!vu ? (
        <p>
          <button type="button" className="btn btn-principal" disabled={!pret} onClick={() => setVu(true)}>
            Voir le raisonnement attendu
          </button>{" "}
          {!pret ? <span className="cockpit-texte">Écrivez d'abord votre raisonnement : c'est ce qui fait apprendre.</span> : null}
        </p>
      ) : (
        <div aria-live="polite">
          <div className="retour-question">
            <p>
              <strong>Raisonnement attendu.</strong> {raisonnement}
            </p>
            <span className="pastille" style={{ display: "inline" }}>
              Source : {source}
            </span>
          </div>
          {acquise || bilan === "acquis" ? (
            <p className="retour-question">
              <strong>Fiche acquise.</strong> Elle est notée dans votre feuille de route{acquise ? ` (le ${acquise})` : ""}.
            </p>
          ) : (
            <p className="epreuve-bilan">
              <button
                type="button"
                className="btn btn-principal"
                onClick={() => {
                  marquerFiche(ficheId, "acquis");
                  setBilan("acquis");
                }}
              >
                Je l'avais
              </button>{" "}
              <button type="button" className="btn" onClick={() => setBilan("revoir")}>
                À revoir
              </button>
            </p>
          )}
          {bilan === "revoir" ? (
            <p className="retour-question">
              Rien n'est perdu : relisez « Le pont » et « Le piège », ou reposez votre question à votre IA avec le prompt de cette fiche, puis revenez ici.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
