"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COCKPIT, type DirectionFiche } from "@/app/prototypes/directions";
import type { Lecon } from "@/app/prototypes/lecon";
import { Epreuve } from "@/composants/Epreuve";
import { Ressources } from "@/composants/Ressources";
import { Avis, DiagrammeFiche, Puces, SchemaChaine } from "./communs";
import { MarquerAcquis } from "./MarquerAcquis";

const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;
const ETAPES = ["avant", "compare", "apres"] as const;

/**
 * Direction C : le schéma d'abord. Le schéma « avant / après » reste en vue pendant la lecture ; les trois temps du texte
 * (ce que vous faisiez, ce qui change, ce que vous écrivez maintenant) le font passer d'un état à l'autre, au défilement ou au clic.
 */
export function FicheC({ l, dir }: { l: Lecon; dir: DirectionFiche }) {
  const [etape, setEtape] = useState(0);
  const texte = useRef<HTMLDivElement>(null);
  const avis = new Set(l.avis);
  const avecAvant = l.schema.avant !== null;

  useEffect(() => {
    const racine = texte.current;
    if (!racine || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) if (e.isIntersecting) setEtape(Number((e.target as HTMLElement).dataset.etape));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    racine.querySelectorAll("[data-etape]").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const titres = [avecAvant ? "Ce que vous faisiez" : "Ce que vous savez déjà", "Ce qui change", avecAvant ? "Ce que vous écrivez maintenant" : "Ce que vous écrivez"];
  const mode = avecAvant ? ETAPES[etape] : "tout";
  const aller = (i: number) => {
    setEtape(i);
    document.getElementById(`pv-c-etape-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="pv-c">
      <div className="pv-c-gauche">
        <div className="pv-c-fixe">
          <div className="pv-c-commandes">
            <span className="pv-ou">
              {etape + 1} sur 3 · {titres[etape]}
            </span>
            <span className="pv-b-actions">
              <button type="button" className="btn" onClick={() => aller(etape - 1)} disabled={etape === 0}>
                Précédent
              </button>
              <button type="button" className="btn" onClick={() => aller(etape + 1)} disabled={etape === 2}>
                Suivant
              </button>
            </span>
          </div>
          <SchemaChaine schema={l.schema} etape={mode} />
        </div>
      </div>

      <div className="pv-c-droite" ref={texte}>
        <p className="pv-fil">
          <Link href={`/prototypes/${COCKPIT}/cockpit`}>Mon cockpit</Link> › {l.domaine}
        </p>
        <h1 className="pv-titre">{l.titre}</h1>
        <p className="pv-meta">
          <span>{GENRE[l.genre]}</span>
          <span>{l.minutes} min</span>
          {l.brouillon ? <span>en relecture</span> : null}
        </p>

        <section className="pv-c-etape" id="pv-c-etape-0" data-etape="0" data-actif={etape === 0 ? "oui" : "non"} onClick={() => setEtape(0)}>
          <span className="pv-c-n">1</span>
          <h2>{titres[0]}</h2>
          <div className="pv-c-corps">
            {l.resume.avant ? <p>{l.resume.avant}</p> : null}
            <Puces items={l.resteVrai} />
          </div>
        </section>
        <section className="pv-c-etape" id="pv-c-etape-1" data-etape="1" data-actif={etape === 1 ? "oui" : "non"} onClick={() => setEtape(1)}>
          <span className="pv-c-n">2</span>
          <h2>{titres[1]}</h2>
          <div className="pv-c-corps">
            <Puces items={l.change} />
            <p>
              <strong>Le piège.</strong> {l.piege} <Avis ok={avis.has("piege")} />
            </p>
          </div>
        </section>
        <section className="pv-c-etape" id="pv-c-etape-2" data-etape="2" data-actif={etape === 2 ? "oui" : "non"} onClick={() => setEtape(2)}>
          <span className="pv-c-n">3</span>
          <h2>{titres[2]}</h2>
          <div className="pv-c-corps">
            <p>
              {l.resume.apres} <Avis ok={avis.has("resume")} />
            </p>
            <p>
              {l.exemple} <Avis ok={avis.has("exemple")} />
            </p>
            <p>
              <strong>{l.pivot.libelle}.</strong> {l.pivot.champ === "reflexe" ? `« ${l.pivot.texte} »` : l.pivot.texte} <Avis ok={avis.has(l.pivot.champ)} />
            </p>
          </div>
        </section>

        {l.diagramme ? (
          <DiagrammeFiche diagramme={l.diagramme} />
        ) : null}

        <h2 className="pv-c-h2">Prédisez, puis vérifiez</h2>
        <Epreuve ficheId={l.id} cas={l.epreuve.cas} raisonnement={l.epreuve.raisonnement} source={l.epreuve.source} />

        <div className="pv-pied-lecon">
          <MarquerAcquis ficheId={l.id} />
        </div>

        <div className="pv-c-outils">
          <Link href="/roadmap">Assistant</Link>
          <a href="#pv-c-ressources">Ressources ({l.plusLoin.length})</a>
          <a href={l.signaler} target="_blank" rel="noopener noreferrer">
            Signaler une erreur
          </a>
          <a href={l.proposer} target="_blank" rel="noopener noreferrer">
            Proposer une correction
          </a>
        </div>
        <h2 id="pv-c-ressources">Pour aller plus loin</h2>
        <Ressources liens={l.plusLoin} />
      </div>
    </div>
  );
}
