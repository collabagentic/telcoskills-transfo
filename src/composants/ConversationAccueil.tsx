"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DonneesPubliques } from "@/contenu/publiques";
import { recombiner, type Reponses } from "@/lib/parcours";
import { repondre, useParcours } from "@/lib/stockage";

/** Nombre de questions posées dans la discussion ; les autres affinent ensuite sur /roadmap. */
const POSEES = 3;

/**
 * La boîte de discussion de l'ancien accueil, reprise : une conversation scriptée (sans IA), une réponse par bouton,
 * et à côté le chemin qui se recompose à chaque réponse.
 */
export function ConversationAccueil({ donnees }: { donnees: DonneesPubliques }) {
  const questions = donnees.questions.slice(0, POSEES);
  const parcours = useParcours();
  const stockees = parcours?.reponses;
  const reponses = useMemo<Reponses>(() => stockees ?? {}, [stockees]);
  const [enAttente, setEnAttente] = useState(false);
  const groupe = useRef<HTMLDivElement>(null);
  const resultat = useRef<HTMLHeadingElement>(null);
  const aInteragi = useRef(false);

  const question = questions.find((q) => !reponses[q.id]);
  const termine = !question;
  const feuille = useMemo(() => recombiner(donnees.graphe, donnees.questions, reponses, donnees.domaines), [donnees, reponses]);
  const premier = feuille.etapes[0];
  const nb = Object.keys(reponses).length;

  useEffect(() => {
    if (!enAttente) return;
    const t = setTimeout(() => setEnAttente(false), 650);
    return () => clearTimeout(t);
  }, [enAttente]);

  useEffect(() => {
    if (!aInteragi.current || enAttente) return;
    if (termine) resultat.current?.focus();
    else groupe.current?.querySelector("button")?.focus();
  }, [nb, enAttente, termine]);

  const choisir = (q: string, o: string) => {
    aInteragi.current = true;
    repondre(q, o);
    setEnAttente(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  const recommencer = () => {
    aInteragi.current = true;
    for (const q of questions) repondre(q.id, null);
    setEnAttente(false);
  };

  const fil: { auteur: "assistant" | "vous"; texte: string }[] = [
    { auteur: "assistant", texte: `Bonjour. Dites-moi votre métier : je vous propose un chemin et un premier pas, en ${POSEES} questions.` },
  ];
  for (const q of questions) {
    const o = q.options.find((x) => x.id === reponses[q.id]);
    if (!o) break;
    fil.push({ auteur: "assistant", texte: q.texte }, { auteur: "vous", texte: o.libelle });
  }
  const lienEtape = (e: { id: string; fiches: string[] }) => (e.fiches[0] ? `/fiche/${e.fiches[0]}` : `/competence/${e.id}`);

  return (
    <div className="pc">
      <section className="pc-boite" aria-labelledby="pc-titre">
        <header className="pc-tete">
          <span className="pc-avatar" aria-hidden="true">
            T
          </span>
          <h2 id="pc-titre">Trouver mon chemin</h2>
          {nb > 0 ? (
            <button type="button" className="pc-recommencer" onClick={recommencer}>
              Recommencer
            </button>
          ) : null}
        </header>
        <div className="pc-fil" role="log" aria-live="polite" aria-label="Conversation">
          {fil.map((m, i) => (
            <p key={i} className={m.auteur === "vous" ? "pc-bulle pc-vous" : "pc-bulle"}>
              {m.texte}
            </p>
          ))}

          {enAttente ? (
            <p className="pc-bulle pc-points" aria-label="L'assistant écrit">
              <i />
              <i />
              <i />
            </p>
          ) : null}

          {!enAttente && question ? (
            <div ref={groupe} className="pc-question">
              <p className="pc-bulle">{question.texte}</p>
              {question.aide ? <p className="pc-aide">{question.aide}</p> : null}
              <div className="pc-options" role="group" aria-label={question.texte}>
                {question.options.map((o) => (
                  <button key={o.id} type="button" onClick={() => choisir(question.id, o.id)}>
                    {o.libelle}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!enAttente && termine && premier ? (
            <div className="pc-resultat">
              <p className="pc-sur">Votre premier pas</p>
              <h3 ref={resultat} tabIndex={-1}>
                {premier.titre}
              </h3>
              <p className="pc-aide">
                Pourquoi : {premier.pourquoi}. Votre chemin compte {feuille.etapes.length} étapes ; {feuille.acquises.length} compétences sont déjà acquises.
              </p>
              <div className="pc-actions">
                <Link href={lienEtape(premier)} className="pd-btn pd-btn-principal">
                  Commencer par « {premier.titre} »
                </Link>
                <Link href={"/cockpit"} className="pd-btn">
                  Ma feuille de route
                </Link>
              </div>
              <p className="pc-aide">
                <Link href="/roadmap">Affiner en {donnees.questions.length - POSEES} questions</Link> : plateforme visée, cœur 5G, sécurité. Tout reste dans votre navigateur, sans compte.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="pc-chemin" aria-label="Votre chemin">
        <p className="pc-sur">{nb === 0 ? "Sans réponse : le début de la feuille de route complète" : "Votre chemin, recalculé à chaque réponse"}</p>
        <ol className="pd-etapes">
          {feuille.etapes.slice(0, 7).map((e) => (
            <li key={e.id}>
              <Link href={lienEtape(e)}>{e.titre}</Link>
              <small>{e.pourquoi}</small>
            </li>
          ))}
        </ol>
        <p className="pc-aide">
          {feuille.etapes.length} étapes sur {donnees.graphe.length} compétences. <Link href={"/cockpit"}>Voir tout le chemin</Link>
        </p>
      </aside>
    </div>
  );
}
