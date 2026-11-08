"use client";

import Link from "next/link";
import { calculerBilan, calculerPlan, LIBELLE_GROUPE, type Groupe } from "@/lib/bilan";
import { effacerBilan, useBilan } from "@/lib/stockage";
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

export function PlanVue({ donnees }: { donnees: DonneesPubliques }) {
  const bilan = useBilan();
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

  return (
    <div className="lecture">
      <div className="entete-plan">
        <div>
          <p className="pastille">Votre plan</p>
          <h1 className="titre-page">{metier.nom}</h1>
        </div>
        <button type="button" className="btn no-print" onClick={() => window.print()}>
          Imprimer
        </button>
      </div>
      <p className="sous-titre" style={{ marginBottom: 0 }}>
        {plan.verifiees} fiche{plan.verifiees > 1 ? "s" : ""} vérifiée{plan.verifiees > 1 ? "s" : ""} sur {plan.total}
      </p>
      <div className="jauge" role="progressbar" aria-valuemin={0} aria-valuemax={plan.total} aria-valuenow={plan.verifiees} aria-label="Fiches vérifiées">
        <span style={{ width: `${pourcentage}%` }} />
      </div>

      {plan.termine ? (
        <section className="couche fin-plan" aria-labelledby="fin-titre">
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

      {reprise ? (
        <Link className="couche-chaude suite carte-reprise" href={`/fiche/${reprise.id}`} style={{ marginTop: "var(--e-6)" }}>
          <div>
            <span className="pastille">Reprendre</span>
            <p>{reprise.titre}</p>
          </div>
          <span className="btn btn-principal">{reprise.temps} min →</span>
        </Link>
      ) : null}

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

      <div className="actions-plan">
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
