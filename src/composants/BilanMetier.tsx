"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { calculerBilan, calculerPlan, type Bilan } from "@/lib/bilan";
import { ecrireBilan, useBilan } from "@/lib/stockage";
import type { FicheLite, MetierLite } from "@/contenu/publiques";

type Props = { metier: MetierLite; portrait: string; fiches: Record<string, FicheLite> };

const LIBELLE_STATUT = { acquis: "reste valable", transpose: "change de forme" } as const;

export function BilanMetier({ metier, portrait, fiches }: Props) {
  const router = useRouter();
  const enregistre = useBilan();
  const memeMetier = enregistre?.metier === metier.id ? enregistre : null;
  // Rendu serveur = tout coché ; ensuite le choix local, sinon le bilan déjà enregistré pour ce métier.
  const [local, setLocal] = useState<string[] | null>(null);
  const decoches = local ?? memeMetier?.decoches ?? [];

  const bilan = calculerBilan(metier, fiches, decoches);
  const progression: Bilan = memeMetier ?? { v: 1, metier: metier.id, decoches, fiches: {} };
  const plan = calculerPlan({ ...progression, decoches }, metier, fiches);
  const premiere = plan.reprise ? fiches[plan.reprise] : null;
  const commence = plan.lues > 0;

  const basculer = (id: string) => setLocal(decoches.includes(id) ? decoches.filter((d) => d !== id) : [...decoches, id]);

  /** Le bilan n'est enregistré qu'ici, au clic (BACKLOG.md E5-2). */
  const enregistrer = (): boolean => {
    if (enregistre && enregistre.metier !== metier.id) {
      const avance = Object.values(enregistre.fiches).some((f) => f.lu || f.verifie);
      if (avance && !window.confirm("Votre plan actuel sera remplacé. Continuer ?")) return false;
    }
    ecrireBilan({ v: 1, metier: metier.id, decoches, fiches: memeMetier ? memeMetier.fiches : {} });
    return true;
  };
  const aller = (chemin: string) => {
    if (enregistrer()) router.push(chemin);
  };

  return (
    <div className="lecture">
      <Link href="/" className="retour">
        ‹ Changer de métier
      </Link>
      <h1 className="titre-page">{metier.nom}</h1>
      <p className="sous-titre">{portrait}</p>

      <h2 className="sr-only">Ce que vous faites aujourd'hui</h2>
      <p className="sous-titre" id="consigne">
        Ce que vous faites aujourd'hui. Décochez ce qui ne vous parle pas.
      </p>
      <ul className="couche liste-sf" aria-labelledby="consigne">
        {metier.savoirFaire.map((s) => {
          const coche = !decoches.includes(s.id);
          return (
            <li key={s.id}>
              <label className="ligne-sf">
                <input type="checkbox" checked={coche} onChange={() => basculer(s.id)} />
                <span className="case" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                </span>
                <span className="texte">{s.texte}</span>
                <span className="pastille">{coche ? LIBELLE_STATUT[s.statut] : "à découvrir"}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <section className="bilan" aria-live="polite" aria-label="Votre bilan">
        <p className="phrase-cle">
          Votre métier tient. <span>{bilan.total} choses évoluent : on les prend une par une.</span>
        </p>
        <div className="tuiles">
          <div className="couche tuile">
            <i className="repere" style={{ background: "var(--teinte-forme)" }} />
            <b>{bilan.forme}</b>
            <span className="libelle">changent de forme</span>
          </div>
          <div className="couche tuile">
            <i className="repere" style={{ background: "var(--teinte-nouveau)" }} />
            <b>{bilan.nouveaux}</b>
            <span className="libelle">sont vraiment nouveaux</span>
          </div>
          <div className="couche tuile">
            <i className="repere" style={{ background: "var(--teinte-lacher)" }} />
            <b>{bilan.lacher}</b>
            <span className="libelle">réflexes à lâcher</span>
          </div>
        </div>
        {bilan.decouvrir > 0 ? (
          <p className="sous-titre" style={{ marginTop: "var(--e-3)", marginBottom: 0 }}>
            {bilan.decouvrir} fiche{bilan.decouvrir > 1 ? "s" : ""} à découvrir : elles restent dans votre plan.
          </p>
        ) : null}
      </section>

      {premiere ? (
        <div className="couche-chaude suite">
          <div>
            <span className="pastille">{commence ? "Pour reprendre" : "Pour commencer"}</span>
            <p>{premiere.titre}</p>
          </div>
          <button type="button" className="btn btn-principal" onClick={() => aller(`/fiche/${premiere.id}`)}>
            {commence ? "Reprendre" : "Commencer"} · {premiere.temps} min
          </button>
        </div>
      ) : (
        <div className="couche-chaude suite">
          <p>Toutes les fiches de votre plan sont vérifiées.</p>
          <button type="button" className="btn btn-principal" onClick={() => aller("/plan")}>
            Voir mon plan
          </button>
        </div>
      )}
      <button type="button" className="lien-discret" onClick={() => aller("/plan")}>
        Voir les {bilan.total} fiches du plan
      </button>
    </div>
  );
}
