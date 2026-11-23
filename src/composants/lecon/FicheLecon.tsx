"use client";

import Link from "next/link";
import { useState } from "react";
import { Epreuve } from "@/composants/Epreuve";
import { premiereLecture } from "@/composants/GesteFiche";
import { SuiteFiche } from "@/composants/NavigationFiche";
import { PromptApprendre } from "@/composants/PromptApprendre";
import { Ressources } from "@/composants/Ressources";
import type { Lecon } from "@/contenu/lecon";
import type { DonneesPubliques } from "@/contenu/publiques";
import { competenceFaite } from "@/lib/parcours";
import { useParcours } from "@/lib/stockage";
import { Avis, DiagrammeFiche, Puces, SchemaChaine } from "./commun";
import { MarquerAcquis } from "./MarquerAcquis";
import "./lecon.css";

const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;
const NOM_TYPE = { cours: "Cours", video: "Vidéo", doc: "Documentation", opensource: "Open source", certif: "Certification", spec: "Spécification" } as const;
const ETAPES = ["avant", "compare", "apres"] as const;

/**
 * La fiche, en leçon continue. À gauche, le schéma avant / après reste en vue, avec la position dans le domaine dessous ;
 * à droite, trois phases (partir de l'existant, voir ce qui change, pratiquer) avec une barre de progression et « Continuer » en bas.
 * Chaque phase fait avancer le schéma. Rien n'est réécrit : tous les textes viennent de la fiche.
 */
export function FicheLecon({ l, donnees }: { l: Lecon; donnees: DonneesPubliques }) {
  const [phase, setPhase] = useState(0);
  const parcours = useParcours();
  const avis = new Set(l.avis);
  const avecAvant = l.schema.avant !== null;
  const lecture = l.plusLoin.length > 0 ? premiereLecture(l.plusLoin) : null;
  const phases = [
    { nom: avecAvant ? "Partir de l'existant" : "Partir de ce que vous savez", sous: avecAvant ? "ce que vous faisiez" : "ce qui reste vrai" },
    { nom: "Voir ce qui change", sous: "le schéma, le piège" },
    { nom: "Pratiquer", sous: "un cas, puis la suite" },
  ];
  const aller = (p: number) => {
    setPhase(p);
    document.getElementById("lc-haut")?.scrollIntoView({ block: "start" });
  };
  const faite = (v: Lecon["voisines"][number]) => (parcours ? competenceFaite({ id: v.id, fiches: v.fiches }, parcours) : false);
  const rang = l.voisines.findIndex((v) => v.courante) + 1;
  // Fenêtre de 7 étapes autour de l'étape courante : pas de liste à faire défiler.
  const debut = Math.max(0, Math.min(rang - 1 - 3, l.voisines.length - 7));
  const fenetre = l.voisines.slice(debut, debut + 7);
  const apres = l.voisines.length - (debut + fenetre.length);
  const recents = l.historique.slice(0, 3);
  const anciens = l.historique.slice(3);

  return (
    <div className="lc-fiche">
      <div className="lc-gauche">
        <div className="lc-fixe">
          <p className="lc-ou">
            Phase {phase + 1} sur 3 · {phases[phase].nom}
          </p>
          <SchemaChaine schema={l.schema} etape={avecAvant ? ETAPES[phase] : "tout"} />
          <nav className="lc-domaine" aria-label="Dans ce domaine">
            <p className="lc-petit-titre">
              {l.domaine} · étape {rang} sur {l.voisines.length}
            </p>
            {debut > 0 ? <p className="lc-ou">… {debut} étape{debut > 1 ? "s" : ""} avant</p> : null}
            <ol>
              {fenetre.map((v) => (
                <li key={v.id} data-courante={v.courante ? "oui" : "non"}>
                  <span className={`lc-point lc-point-${faite(v) ? "faite" : v.courante ? "courant" : "avenir"}`} aria-hidden="true" />
                  {v.courante ? <span aria-current="step">{v.titre}</span> : <Link href={v.fiches[0] ? `/fiche/${v.fiches[0]}` : `/competence/${v.id}`}>{v.titre}</Link>}
                  <span className="lc-sr">{faite(v) ? " (acquise)" : v.courante ? " (en cours)" : ""}</span>
                </li>
              ))}
            </ol>
            {apres > 0 ? <p className="lc-ou">… {apres} étape{apres > 1 ? "s" : ""} après</p> : null}
          </nav>
        </div>
      </div>

      <article className="lc-droite" id="lc-haut">
        <p className="lc-fil">
          <Link href="/cockpit">Mon cockpit</Link> › {l.domaine}
        </p>
        <h1 className="lc-titre">{l.titre}</h1>
        <p className="lc-meta">
          <span>{GENRE[l.genre]}</span>
          <span>{l.minutes} min</span>
          {l.brouillon ? <span>en relecture</span> : null}
          {l.technos.length > 0 ? <span>{l.technos.map((t) => t.nom).join(" · ")}</span> : null}
        </p>

        <div className="lc-phases" role="group" aria-label="Phases de la leçon">
          {phases.map((p, i) => (
            <button key={p.nom} type="button" onClick={() => aller(i)} aria-current={i === phase ? "step" : undefined} data-faite={i < phase ? "oui" : "non"}>
              <b>{p.nom}</b>
              <small>{p.sous}</small>
            </button>
          ))}
        </div>

        {phase === 0 ? (
          <div className="lc-phase">
            <p className="lc-chapo">
              {l.resume.avant ?? l.resume.apres} <Avis ok={avis.has("resume")} />
            </p>
            <h2>Ce qui reste vrai</h2>
            <Puces items={l.resteVrai} />
            {lecture ? (
              <p className="lc-lire">
                <span className="lc-ou">À lire d'abord</span>
                <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                  {lecture.nom}
                </a>
                <span className="lc-ou">
                  {NOM_TYPE[lecture.type]}
                  {lecture.acces ? ` · ${lecture.acces}` : ""}
                  {lecture.langue ? ` · ${lecture.langue === "fr" ? "français" : "anglais"}` : ""}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        {phase === 1 ? (
          <div className="lc-phase">
            <h2>Ce qui change</h2>
            <Puces items={l.change} />
            <h2>{l.pivot.libelle}</h2>
            <p className={l.pivot.champ === "reflexe" ? "lc-citation" : undefined}>
              {l.pivot.champ === "reflexe" ? `« ${l.pivot.texte} »` : l.pivot.texte} <Avis ok={avis.has(l.pivot.champ)} />
            </p>
            <h2>Le piège</h2>
            <p>
              {l.piege} <Avis ok={avis.has("piege")} />
            </p>
            {l.diagramme ? <DiagrammeFiche diagramme={l.diagramme} /> : null}
            {avis.has("schema") ? (
              <p className="lc-ou">
                Le schéma <Avis ok />
              </p>
            ) : null}
          </div>
        ) : null}

        {phase === 2 ? (
          <div className="lc-phase">
            {avecAvant ? (
              <p className="lc-chapo">
                {l.resume.apres} <Avis ok={avis.has("resume")} />
              </p>
            ) : null}
            <h2>En télécom, concrètement</h2>
            <p>
              {l.exemple} <Avis ok={avis.has("exemple")} />
            </p>
            <details className="lc-prompt">
              <summary>Poser la bonne question à votre IA</summary>
              <PromptApprendre entree={l.prompt.entree} amorces={l.prompt.amorces} />
            </details>
            <Epreuve ficheId={l.id} cas={l.epreuve.cas} raisonnement={l.epreuve.raisonnement} source={l.epreuve.source} />

            <h2>Compétences de la feuille de route</h2>
            <ul className="lc-puces">
              {l.competences.map((x) => (
                <li key={x.id}>
                  <Link href={`/competence/${x.id}`} className="lc-lien">
                    {x.titre}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 id="plus-loin">Pour aller plus loin</h2>
            <p className="lc-ou">Le gratuit d'abord, le français avant l'anglais.</p>
            <Ressources liens={l.plusLoin} />
            <details className="lc-details">
              <summary>Sources de cette fiche</summary>
              <ul className="lc-liste-simple">
                {l.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.nom}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
            <details className="lc-details">
              <summary>Historique de la fiche</summary>
              <ul className="lc-liste-simple">
                {[...recents, ...anciens].map((h) => (
                  <li key={h.date + h.changement}>
                    {h.date} · {h.changement} <span className="lc-ou">({h.par})</span>
                  </li>
                ))}
              </ul>
            </details>
            <p className="lc-outils">
              <Link href="/roadmap">Refaire ma feuille de route</Link>
              <a href={l.signaler} target="_blank" rel="noopener noreferrer">
                Signaler une erreur
              </a>
              <a href={l.proposer} target="_blank" rel="noopener noreferrer">
                Proposer une correction
              </a>
            </p>
            <SuiteFiche ficheId={l.id} donnees={donnees} />
          </div>
        ) : null}

        <div className="lc-bas">
          <span className="lc-ou">Phase {phase + 1} sur 3</span>
          <span className="lc-actions">
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
      </article>
    </div>
  );
}
