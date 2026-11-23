import Link from "next/link";
import type { Direction } from "@/app/prototypes/directions";
import type { Lecon } from "@/app/prototypes/lecon";
import { Diagramme } from "@/composants/Diagramme";
import { Epreuve } from "@/composants/Epreuve";
import { PromptApprendre } from "@/composants/PromptApprendre";
import { Ressources } from "@/composants/Ressources";
import { Avis, Puces, SchemaChaine } from "./communs";
import { MarquerAcquis } from "./MarquerAcquis";

const GENRE = { transposition: "Change de forme", nouveaute: "Vraiment nouveau" } as const;

/** Direction A : une leçon continue. Sommaire à gauche, outils à droite, rien d'autre que la lecture au centre. */
export function FicheA({ l, dir }: { l: Lecon; dir: Direction }) {
  const avis = new Set(l.avis);
  return (
    <div className="pv-a">
      <aside className="pv-a-sommaire" aria-label="Dans cette leçon">
        <p className="pv-petit-titre">Dans cette leçon</p>
        <ol>
          <li><a href="#comprendre">Comprendre</a></li>
          <li><a href="#voir">Voir la différence</a></li>
          <li><a href="#pratiquer">Pratiquer</a></li>
          <li><a href="#plus-loin">Aller plus loin</a></li>
        </ol>
        <p className="pv-ou">{l.domaine}</p>
      </aside>

      <article className="pv-lecture" id="comprendre">
        <p className="pv-fil">
          <Link href={`/prototypes/${dir}/cockpit`}>Mon cockpit</Link> › {l.domaine}
        </p>
        <h1 className="pv-titre">{l.titre}</h1>
        <p className="pv-meta">
          <span>{GENRE[l.genre]}</span>
          <span>{l.minutes} min</span>
          {l.brouillon ? <span>en relecture</span> : null}
        </p>

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

        <h2 id="voir">Voir la différence</h2>
        <SchemaChaine schema={l.schema} />
        {l.diagramme ? (
          <div className="pv-diagramme">
            <Diagramme diagramme={l.diagramme} />
          </div>
        ) : null}

        <h2>{l.pivot.libelle}</h2>
        <p className={l.pivot.champ === "reflexe" ? "pv-citation" : undefined}>
          {l.pivot.champ === "reflexe" ? `« ${l.pivot.texte} »` : l.pivot.texte} <Avis ok={avis.has(l.pivot.champ)} />
        </p>
        <h2>Le piège</h2>
        <p>
          {l.piege} <Avis ok={avis.has("piege")} />
        </p>
        <h2>En télécom, concrètement</h2>
        <p>
          {l.exemple} <Avis ok={avis.has("exemple")} />
        </p>

        <h2 id="pratiquer">Pratiquer</h2>
        <Epreuve ficheId={l.id} cas={l.epreuve.cas} raisonnement={l.epreuve.raisonnement} source={l.epreuve.source} />

        <h2 id="plus-loin">Pour aller plus loin</h2>
        <Ressources liens={l.plusLoin} />

        <div className="pv-pied-lecon">
          <MarquerAcquis ficheId={l.id} />
          <Link className="pv-suite" href={`/prototypes/${dir}/cockpit`}>
            Retour au cockpit →
          </Link>
        </div>
      </article>

      <aside className="pv-a-outils" aria-label="Outils">
        <p className="pv-petit-titre">Outils</p>
        <ul>
          <li>
            <Link href="/roadmap">Assistant : refaire ma feuille de route</Link>
          </li>
          <li>
            <details>
              <summary>Prompt pour apprendre</summary>
              <PromptApprendre entree={l.prompt.entree} amorces={l.prompt.amorces} />
            </details>
          </li>
          <li>
            <details>
              <summary>Sources de la fiche</summary>
              <ul className="pv-liste-simple">
                {l.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.nom}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li>
            <a href={l.signaler} target="_blank" rel="noopener noreferrer">
              Signaler une erreur
            </a>
          </li>
          <li>
            <a href={l.proposer} target="_blank" rel="noopener noreferrer">
              Proposer une correction
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
