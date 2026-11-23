"use client";

import Link from "next/link";
import { useState } from "react";
import type { Direction } from "@/app/prototypes/directions";
import type { Lecon } from "@/app/prototypes/lecon";
import { Diagramme } from "@/composants/Diagramme";
import { Epreuve } from "@/composants/Epreuve";
import { Ressources } from "@/composants/Ressources";
import { competenceFaite } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import { Avis, Puces, SchemaChaine } from "./communs";
import { MarquerAcquis } from "./MarquerAcquis";

const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;
const PHASES = [
  { nom: "Comprendre", sous: "l'essentiel" },
  { nom: "Voir", sous: "le schéma et l'exemple" },
  { nom: "Pratiquer", sous: "un cas, puis les ressources" },
] as const;

/** Direction B : le parcours par phases. Une phase à la fois, la position dans le domaine à gauche, « Continuer » en bas. */
export function FicheB({ l, dir }: { l: Lecon; dir: Direction }) {
  const [phase, setPhase] = useState(0);
  const parcours = useParcours();
  const avis = new Set(l.avis);
  const aller = (p: number) => {
    setPhase(p);
    document.getElementById("pv-b-haut")?.scrollIntoView({ block: "start" });
  };
  const faite = (v: Lecon["voisines"][number]) => (parcours ? competenceFaite({ id: v.id, fiches: v.fiches }, parcours) : false);
  const rang = l.voisines.findIndex((v) => v.courante) + 1;

  return (
    <div className="pv-b">
      <aside className="pv-b-cote" aria-label="Dans ce domaine">
        <p className="pv-petit-titre">{l.domaine}</p>
        <ol>
          {l.voisines.map((v) => (
            <li key={v.id} data-courante={v.courante ? "oui" : "non"}>
              <span className={`pv-point pv-point-${faite(v) ? "faite" : v.courante ? "courant" : "avenir"}`} aria-hidden="true" />
              {v.courante ? (
                <span aria-current="step">{v.titre}</span>
              ) : (
                <Link href={v.fiches[0] ? `/prototypes/${dir}/fiche/${v.fiches[0]}` : `/competence/${v.id}`}>{v.titre}</Link>
              )}
              <span className="pv-sr">{faite(v) ? " (acquise)" : v.courante ? " (en cours)" : ""}</span>
            </li>
          ))}
        </ol>
      </aside>

      <div className="pv-b-centre" id="pv-b-haut">
        <p className="pv-fil">
          <Link href={`/prototypes/${dir}/cockpit`}>Mon cockpit</Link> › {l.domaine} › étape {rang} sur {l.voisines.length}
        </p>
        <h1 className="pv-titre">{l.titre}</h1>
        <p className="pv-meta">
          <span>{GENRE[l.genre]}</span>
          <span>{l.minutes} min</span>
          {l.brouillon ? <span>en relecture</span> : null}
        </p>

        <div className="pv-phases" role="group" aria-label="Phases de la leçon">
          {PHASES.map((p, i) => (
            <button key={p.nom} type="button" onClick={() => aller(i)} aria-current={i === phase ? "step" : undefined} data-faite={i < phase ? "oui" : "non"}>
              <b>{p.nom}</b>
              <small>{p.sous}</small>
            </button>
          ))}
        </div>

        {phase === 0 ? (
          <div className="pv-phase">
            <p className="pv-chapo">
              {l.resume.avant ? (
                <>
                  <strong>Avant :</strong> {l.resume.avant} <strong>Après :</strong>{" "}
                </>
              ) : null}
              {l.resume.apres} <Avis ok={avis.has("resume")} />
            </p>
            <h2>Ce qui reste vrai</h2>
            <Puces items={l.resteVrai} />
            <h2>Ce qui change</h2>
            <Puces items={l.change} />
          </div>
        ) : null}

        {phase === 1 ? (
          <div className="pv-phase">
            <h2>Voir la différence</h2>
            <SchemaChaine schema={l.schema} />
            {l.diagramme ? (
              <div className="pv-diagramme">
                <Diagramme diagramme={l.diagramme} />
              </div>
            ) : null}
            <h2>En télécom, concrètement</h2>
            <p>
              {l.exemple} <Avis ok={avis.has("exemple")} />
            </p>
            <h2>{l.pivot.libelle}</h2>
            <p className={l.pivot.champ === "reflexe" ? "pv-citation" : undefined}>
              {l.pivot.champ === "reflexe" ? `« ${l.pivot.texte} »` : l.pivot.texte} <Avis ok={avis.has(l.pivot.champ)} />
            </p>
            <h2>Le piège</h2>
            <p>
              {l.piege} <Avis ok={avis.has("piege")} />
            </p>
          </div>
        ) : null}

        {phase === 2 ? (
          <div className="pv-phase">
            <Epreuve ficheId={l.id} cas={l.epreuve.cas} raisonnement={l.epreuve.raisonnement} source={l.epreuve.source} />
            <h2>Pour aller plus loin</h2>
            <Ressources liens={l.plusLoin} />
          </div>
        ) : null}

        <div className="pv-b-bas">
          <span className="pv-ou">Phase {phase + 1} sur 3</span>
          <span className="pv-b-actions">
            <button type="button" className="btn" onClick={() => aller(phase - 1)} disabled={phase === 0}>
              Précédent
            </button>
            {phase < 2 ? (
              <button type="button" className="btn btn-principal" onClick={() => aller(phase + 1)}>
                Continuer
              </button>
            ) : (
              <MarquerAcquis ficheId={l.id} libelle="Marquer acquis" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
