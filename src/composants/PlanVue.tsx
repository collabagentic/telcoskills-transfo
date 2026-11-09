"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CarteTransformation } from "./CarteTransformation";
import { calculerBilan, calculerPlan, LIBELLE_GROUPE, type Etat, type Groupe } from "@/lib/bilan";
import { cheminRestant } from "@/lib/carte";
import { definirObjectif, effacerBilan, useBilan } from "@/lib/stockage";
import type { DonneesPubliques } from "@/contenu/publiques";

const GROUPES: Groupe[] = ["forme", "nouveau", "decouvrir"];
const LIBELLE_ETAT = { "a-lire": "à lire", lu: "lu", verifie: "vérifié" } as const;

/** Les trois liens « pour aller plus loin » les plus cités par les fiches du plan, libres d'abord (BACKLOG.md E8-3). */
function meilleursLiens(ids: string[], donnees: DonneesPubliques) {
  const compte = new Map<string, { nom: string; url: string; acces: string; n: number }>();
  for (const id of ids) {
    for (const l of donnees.fiches[id]?.liens ?? []) {
      const actuel = compte.get(l.url) ?? { nom: l.nom, url: l.url, acces: l.acces, n: 0 };
      actuel.n += 1;
      compte.set(l.url, actuel);
    }
  }
  return [...compte.values()].sort((a, b) => Number(b.acces === "gratuit") - Number(a.acces === "gratuit") || b.n - a.n).slice(0, 3);
}

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

export function PlanVue({ donnees }: { donnees: DonneesPubliques }) {
  const bilan = useBilan();
  const large = useEcranLarge();
  const [choixVue, setChoixVue] = useState<"carte" | "liste" | null>(null);
  const metier = bilan ? donnees.metiers[bilan.metier] : undefined;

  if (!bilan || !metier) {
    return (
      <div className="vide">
        <h1 className="titre-page">Commencez par votre métier</h1>
        <p>Votre plan se construit à partir de ce que vous faites déjà.</p>
        <Link className="btn btn-principal" href="/">
          Choisir mon métier
        </Link>
      </div>
    );
  }

  const plan = calculerPlan(bilan, metier, donnees.fiches);
  const resume = calculerBilan(metier, donnees.fiches, bilan.decoches);
  const reprise = plan.reprise ? donnees.fiches[plan.reprise] : null;
  const pourcentage = plan.total ? Math.round((plan.verifiees / plan.total) * 100) : 0;
  const etats: Record<string, Etat> = Object.fromEntries(plan.lignes.map((l) => [l.id, l.etat]));
  const modes = Object.fromEntries(plan.lignes.map((l) => [l.id, l.mode]));
  const objectif = bilan.objectif && metier.ordre.includes(bilan.objectif) ? bilan.objectif : null;
  const reste = objectif ? cheminRestant(objectif, metier.ordre, metier.dependances, etats) : [];
  const minutesRestantes = reste.reduce((n, id) => n + (donnees.fiches[id]?.temps ?? 0), 0);
  const vue = choixVue ?? (large ? "carte" : "liste");

  return (
    <div>
      <div className="entete-plan lecture">
        <div>
          <p className="pastille">Votre plan</p>
          <h1 className="titre-page">{metier.nom}</h1>
        </div>
        <button type="button" className="btn no-print" onClick={() => window.print()}>
          Imprimer
        </button>
      </div>

      {plan.termine ? (
        <section className="couche fin-plan lecture" aria-labelledby="fin-titre">
          <h2 id="fin-titre">Vous avez transformé votre métier.</h2>
          <p className="sous-titre" style={{ marginTop: "var(--e-3)" }}>
            {resume.forme} savoir-faire transposé{resume.forme > 1 ? "s" : ""}, {resume.nouveaux} nouveauté{resume.nouveaux > 1 ? "s" : ""} découverte
            {resume.nouveaux > 1 ? "s" : ""}, {resume.lacher} réflexe{resume.lacher > 1 ? "s" : ""} lâché{resume.lacher > 1 ? "s" : ""}.
          </p>
          <p>Pour aller plus loin, les ressources les plus citées par vos fiches :</p>
          <div className="liens-fin">
            {meilleursLiens(plan.lignes.map((l) => l.id), donnees).map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                {l.nom} <span className="sr-only">(nouvel onglet)</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="cockpit" aria-label="Cockpit">
        <div className="couche cockpit-carte">
          <span className="pastille">Où j'en suis</span>
          <p className="cockpit-chiffre mono">
            {plan.verifiees}
            <small> / {plan.total}</small>
          </p>
          <p className="cockpit-texte">
            fiche{plan.verifiees > 1 ? "s" : ""} vérifiée{plan.verifiees > 1 ? "s" : ""} · {plan.lues} lue{plan.lues > 1 ? "s" : ""}
          </p>
          <div className="jauge" role="progressbar" aria-valuemin={0} aria-valuemax={plan.total} aria-valuenow={plan.verifiees} aria-label="Fiches vérifiées">
            <span style={{ width: `${pourcentage}%` }} />
          </div>
        </div>

        {reprise ? (
          <Link className="couche-chaude cockpit-carte carte-reprise" href={`/fiche/${reprise.id}`}>
            <span className="pastille" style={{ color: "var(--accent-texte)" }}>
              Prochaine étape
            </span>
            <p className="cockpit-titre">{reprise.titre}</p>
            <span className="btn btn-principal">Reprendre · {reprise.temps} min →</span>
          </Link>
        ) : (
          <div className="couche cockpit-carte">
            <span className="pastille">Prochaine étape</span>
            <p className="cockpit-titre">Toutes les fiches sont vérifiées.</p>
          </div>
        )}

        <div className="couche cockpit-carte">
          <label className="pastille" htmlFor="objectif">
            Mon objectif
          </label>
          <select id="objectif" className="selecteur" value={objectif ?? ""} onChange={(e) => definirObjectif(e.target.value || null)}>
            <option value="">Aucun objectif choisi</option>
            {metier.ordre.map((id) => (
              <option key={id} value={id}>
                {donnees.fiches[id]?.titre}
              </option>
            ))}
          </select>
          {objectif ? (
            reste.length === 0 ? (
              <p className="cockpit-texte">Objectif atteint : cette fiche et ses prérequis sont vérifiés.</p>
            ) : (
              <>
                <p className="cockpit-texte">
                  {reste.length} étape{reste.length > 1 ? "s" : ""} à vérifier, environ {minutesRestantes} min de lecture.
                </p>
                <ol className="chemin">
                  {reste.map((id) => (
                    <li key={id}>
                      <Link href={`/fiche/${id}`}>{donnees.fiches[id]?.titre}</Link>
                    </li>
                  ))}
                </ol>
              </>
            )
          ) : (
            <p className="cockpit-texte">Choisissez une transformation à atteindre : le chemin restant s'affiche ici et sur la carte.</p>
          )}
        </div>
      </section>

      <div className="bascule no-print" role="group" aria-label="Affichage du plan">
        <button type="button" className="btn btn-lien" aria-pressed={vue === "carte"} onClick={() => setChoixVue("carte")}>
          Carte
        </button>
        <button type="button" className="btn btn-lien" aria-pressed={vue === "liste"} onClick={() => setChoixVue("liste")}>
          Liste
        </button>
      </div>

      {vue === "carte" ? (
        <CarteTransformation metier={metier} fiches={donnees.fiches} modes={modes} etats={etats} objectif={objectif} />
      ) : (
        <div className="lecture">
          {GROUPES.map((g) => {
            const lignes = plan.lignes.filter((l) => l.groupe === g);
            if (lignes.length === 0) return null;
            return (
              <section className="groupe" key={g} aria-labelledby={`g-${g}`}>
                <h2 id={`g-${g}`}>{LIBELLE_GROUPE[g]}</h2>
                <ul className="couche">
                  {lignes.map((l) => {
                    const f = donnees.fiches[l.id];
                    return (
                      <li key={l.id}>
                        <Link className="ligne-plan" href={`/fiche/${l.id}`}>
                          <span className={`etat etat-${l.etat === "a-lire" ? "vide" : l.etat}`} aria-hidden="true" />
                          <span className="titre">{f.titre}</span>
                          {f.statut === "brouillon" ? <span className="pastille pastille-relecture">en relecture</span> : null}
                          <span className="pastille">{f.temps} min</span>
                          <span className="pastille" style={{ minWidth: "4.5rem", justifyContent: "flex-end" }}>
                            {LIBELLE_ETAT[l.etat]}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <div className="actions-plan lecture">
        <Link className="btn" href={`/metier/${metier.id}`}>
          Modifier mon bilan
        </Link>
        <button
          type="button"
          className="btn btn-lien"
          onClick={() => {
            if (window.confirm("Effacer votre plan de ce navigateur ?")) effacerBilan();
          }}
        >
          Effacer mon plan
        </button>
      </div>
    </div>
  );
}
