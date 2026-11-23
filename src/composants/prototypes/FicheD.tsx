"use client";

import Link from "next/link";
import { useState } from "react";
import { COCKPIT, type DirectionFiche } from "@/app/prototypes/directions";
import type { Lecon } from "@/app/prototypes/lecon";
import { Epreuve } from "@/composants/Epreuve";
import { Ressources } from "@/composants/Ressources";
import { competenceFaite } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import { Avis, DiagrammeFiche, Puces, SchemaChaine } from "./communs";
import { MarquerAcquis } from "./MarquerAcquis";

const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;
const ETAPES = ["avant", "compare", "apres"] as const;

/**
 * Direction D : B et C mêlés. La colonne de gauche est celle de C (le schéma avant / après reste en vue, avec la position dans le domaine
 * dessous) ; la colonne de droite est celle de B (trois phases, barre de progression, « Continuer » en bas). Chaque phase fait avancer le schéma.
 */
export function FicheD({ l, dir }: { l: Lecon; dir: DirectionFiche }) {
  const [phase, setPhase] = useState(0);
  const parcours = useParcours();
  const avis = new Set(l.avis);
  const avecAvant = l.schema.avant !== null;
  const phases = [
    { nom: avecAvant ? "Partir de l'existant" : "Partir de ce que vous savez", sous: avecAvant ? "ce que vous faisiez" : "ce qui reste vrai" },
    { nom: "Voir ce qui change", sous: "le schéma, le piège" },
    { nom: "Pratiquer", sous: "un cas, puis la suite" },
  ];
  const aller = (p: number) => {
    setPhase(p);
    document.getElementById("pv-d-haut")?.scrollIntoView({ block: "start" });
  };
  const faite = (v: Lecon["voisines"][number]) => (parcours ? competenceFaite({ id: v.id, fiches: v.fiches }, parcours) : false);
  const rang = l.voisines.findIndex((v) => v.courante) + 1;
  // Fenêtre de 7 étapes autour de l'étape courante : pas de liste à faire défiler.
  const debut = Math.max(0, Math.min(rang - 1 - 3, l.voisines.length - 7));
  const fenetre = l.voisines.slice(debut, debut + 7);
  const avant = debut;
  const apres = l.voisines.length - (debut + fenetre.length);

  return (
    <div className="pv-c pv-d">
      <div className="pv-c-gauche">
        <div className="pv-c-fixe">
          <p className="pv-ou">
            Phase {phase + 1} sur 3 · {phases[phase].nom}
          </p>
          <SchemaChaine schema={l.schema} etape={avecAvant ? ETAPES[phase] : "tout"} />
          <div className="pv-b-cote pv-d-domaine" aria-label="Dans ce domaine">
            <p className="pv-petit-titre">
              {l.domaine} · étape {rang} sur {l.voisines.length}
            </p>
            {avant > 0 ? <p className="pv-ou">… {avant} étape{avant > 1 ? "s" : ""} avant</p> : null}
            <ol>
              {fenetre.map((v) => (
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
            {apres > 0 ? <p className="pv-ou">… {apres} étape{apres > 1 ? "s" : ""} après</p> : null}
          </div>
        </div>
      </div>

      <div className="pv-c-droite pv-d-droite" id="pv-d-haut">
        <p className="pv-fil">
          <Link href={`/prototypes/${COCKPIT}/cockpit`}>Mon cockpit</Link> › {l.domaine}
        </p>
        <h1 className="pv-titre">{l.titre}</h1>
        <p className="pv-meta">
          <span>{GENRE[l.genre]}</span>
          <span>{l.minutes} min</span>
          {l.brouillon ? <span>en relecture</span> : null}
        </p>

        <div className="pv-phases" role="group" aria-label="Phases de la leçon">
          {phases.map((p, i) => (
            <button key={p.nom} type="button" onClick={() => aller(i)} aria-current={i === phase ? "step" : undefined} data-faite={i < phase ? "oui" : "non"}>
              <b>{p.nom}</b>
              <small>{p.sous}</small>
            </button>
          ))}
        </div>

        {phase === 0 ? (
          <div className="pv-phase">
            {l.resume.avant ? <p className="pv-chapo">{l.resume.avant}</p> : <p className="pv-chapo">{l.resume.apres}</p>}
            <h2>Ce qui reste vrai</h2>
            <Puces items={l.resteVrai} />
          </div>
        ) : null}

        {phase === 1 ? (
          <div className="pv-phase">
            <h2>Ce qui change</h2>
            <Puces items={l.change} />
            <h2>{l.pivot.libelle}</h2>
            <p className={l.pivot.champ === "reflexe" ? "pv-citation" : undefined}>
              {l.pivot.champ === "reflexe" ? `« ${l.pivot.texte} »` : l.pivot.texte} <Avis ok={avis.has(l.pivot.champ)} />
            </p>
            <h2>Le piège</h2>
            <p>
              {l.piege} <Avis ok={avis.has("piege")} />
            </p>
            {l.diagramme ? (
              <DiagrammeFiche diagramme={l.diagramme} />
            ) : null}
          </div>
        ) : null}

        {phase === 2 ? (
          <div className="pv-phase">
            {avecAvant ? (
              <p className="pv-chapo">
                {l.resume.apres} <Avis ok={avis.has("resume")} />
              </p>
            ) : null}
            <h2>En télécom, concrètement</h2>
            <p>
              {l.exemple} <Avis ok={avis.has("exemple")} />
            </p>
            <h2>Prédisez, puis vérifiez</h2>
            <Epreuve ficheId={l.id} cas={l.epreuve.cas} raisonnement={l.epreuve.raisonnement} source={l.epreuve.source} />
            <h2>Pour aller plus loin</h2>
            <Ressources liens={l.plusLoin} />
            <p className="pv-d-outils">
              <Link href="/roadmap">Assistant</Link>
              <a href={l.signaler} target="_blank" rel="noopener noreferrer">
                Signaler une erreur
              </a>
              <a href={l.proposer} target="_blank" rel="noopener noreferrer">
                Proposer une correction
              </a>
            </p>
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
