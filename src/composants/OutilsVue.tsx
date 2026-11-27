"use client";

import Link from "next/link";
import { useState } from "react";
import type { Outils, Projet } from "@/contenu/schemas";

type Props = {
  outils: Outils;
  roles: Projet["roles"];
  /** Titre de chaque compétence citée par un outil. */
  competences: Record<string, string>;
  /** Fiches qui citent chaque outil (identifiant → titre). */
  fiches: Record<string, { id: string; titre: string }[]>;
};

/** Les outils groupés par fonction ; un rôle choisi éclaire sa pile sans cacher le reste. */
export function OutilsVue({ outils, roles, competences, fiches }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const nb = role ? outils.outils.filter((o) => o.roles.includes(role)).length : outils.outils.length;

  return (
    <>
      <div className="projet-choix" role="group" aria-label="Rôle">
        <button type="button" className="projet-pilule" aria-pressed={role === null} onClick={() => setRole(null)}>
          Tous les rôles
        </button>
        {roles.map((r) => (
          <button key={r.id} type="button" className="projet-pilule" aria-pressed={role === r.id} onClick={() => setRole(r.id)}>
            {r.libelle}
          </button>
        ))}
      </div>
      <p className="projet-aide" aria-live="polite">
        {role ? `${nb} outils pour ce rôle, les autres sont estompés.` : `${nb} outils.`}
      </p>

      {outils.categories.map((k) => (
        <section key={k.id} className="outils-categorie">
          <h2>{k.libelle}</h2>
          <p className="projet-aide">{k.intro}</p>
          {k.sous_categories.map((s) => {
            const liste = outils.outils.filter((o) => o.categorie === k.id && o.sousCategorie === s.id);
            if (liste.length === 0) return null;
            return (
              <div key={s.id} className="outils-sous">
                <h3>{s.libelle}</h3>
                <ul className="outils-liste">
                  {liste.map((o) => (
                    <li key={o.id} className={role && !o.roles.includes(role) ? "outil est-estompe" : "outil"}>
                      <p className="outil-nom">
                        <a href={o.url} rel="noopener noreferrer" target="_blank">
                          {o.nom}
                        </a>
                      </p>
                      <ul className="outil-liens">
                        {(fiches[o.id] ?? []).map((f) => (
                          <li key={f.id}>
                            Fiche : <Link href={`/fiche/${f.id}`}>{f.titre}</Link>
                          </li>
                        ))}
                        {o.competences.map((id) => (
                          <li key={id}>
                            <Link href={`/competence/${id}`}>{competences[id]}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      ))}
    </>
  );
}
