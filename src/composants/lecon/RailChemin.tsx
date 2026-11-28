"use client";

import Link from "next/link";
import { useState } from "react";
import type { Etape } from "@/lib/parcours";
import { lienEtape, type Chemin } from "./chemin";

const NIVEAU: Record<string, string> = { fondamental: "Les fondamentaux", intermediaire: "Le cœur du métier", avance: "Pour aller loin", transverse: "Transverse" };

/**
 * La colonne « Votre chemin », façon GOV.UK « step by step » : on y voit sa propre feuille de route, pas le domaine.
 * Trois chapitres dans l'ordre du chemin ; seul le chapitre en cours est déplié, « Tout montrer » déplie le reste.
 * La fiche ne l'affiche que si elle est dans le chemin (sinon, le menu du domaine).
 */
export function RailChemin({ c }: { c: Chemin }) {
  const [tout, setTout] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const courante = c.rang >= 0 ? c.etapes[c.rang] : null;
  // Trois chapitres dans l'ordre du chemin : on n'y revient jamais en arrière (une étape fondamentale tardive reste dans le chapitre en cours),
  // donc la numérotation est continue et chaque chapitre n'apparaît qu'une fois.
  const RANG: Record<string, number> = { fondamental: 0, intermediaire: 1, transverse: 1, avance: 2 };
  const CLE = ["fondamental", "intermediaire", "avance"];
  const blocs: { niveau: string; etapes: Etape[] }[] = [];
  let palier = 0;
  for (const e of c.etapes) {
    palier = Math.max(palier, RANG[e.niveau] ?? 1);
    const dernier = blocs[blocs.length - 1];
    if (dernier && dernier.niveau === CLE[palier]) dernier.etapes.push(e);
    else blocs.push({ niveau: CLE[palier], etapes: [e] });
  }
  const numero = new Map(c.etapes.map((e, i) => [e.id, i + 1]));

  return (
    <aside className="lc-rail rc" data-ferme={ouvert ? "non" : "oui"}>
      <nav aria-label="Votre chemin">
        <button type="button" className="lc-rail-bascule" onClick={() => setOuvert(!ouvert)} aria-expanded={ouvert}>
          Votre chemin{courante ? ` · étape ${c.rang + 1} sur ${c.etapes.length}` : ""} <span aria-hidden="true">{ouvert ? "▴" : "▾"}</span>
        </button>
        <p className="lc-petit-titre">Votre chemin</p>
        {courante ? (
          <p className="rc-pos">
            Étape {c.rang + 1} sur {c.etapes.length}
            <span className="rc-barre" aria-hidden="true">
              <span style={{ width: `${((c.rang + 1) / c.etapes.length) * 100}%` }} />
            </span>
          </p>
        ) : null}
        <button type="button" className="rc-tout" onClick={() => setTout(!tout)}>
          {tout ? "Replier" : "Tout montrer"}
        </button>
        <ol className="rc-blocs">
          {blocs.map((b, i) => {
            const enCours = b.etapes.some((e) => e.id === courante?.id);
            const faites = b.etapes.filter((e) => c.etats[e.id] === "faite").length;
            return (
              <li key={b.niveau + i} className="rc-bloc" data-encours={enCours ? "oui" : "non"}>
                <details open={tout || enCours}>
                  <summary>
                    <span className="rc-num">{i + 1}</span>
                    <span className="rc-nom">{NIVEAU[b.niveau] ?? b.niveau}</span>
                    <span className="rc-compte">
                      {faites}/{b.etapes.length}
                    </span>
                  </summary>
                  <ol>
                    {b.etapes.map((e) => {
                      const etat = c.etats[e.id];
                      const ici = e.id === courante?.id;
                      return (
                        <li key={e.id} data-etat={ici ? "ici" : etat}>
                          {ici ? (
                            <span aria-current="step">
                              <b>{numero.get(e.id)}.</b> {e.titre}
                            </span>
                          ) : (
                            <Link href={lienEtape(e)}>
                              <b>{numero.get(e.id)}.</b> {e.titre}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </details>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
