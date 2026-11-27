"use client";

import Link from "next/link";
import { useState } from "react";
import type { Projet } from "@/contenu/schemas";

type Props = {
  projet: Projet;
  /** Titre de chaque compétence citée, et sa première fiche s'il y en a une. */
  competences: Record<string, { titre: string; fiche?: string }>;
};

/** Le projet fil rouge : un rôle à la fois (ou aucun), puis les phases. Le rôle choisi éclaire ses activités, il ne cache rien. */
export function ProjetVue({ projet, competences }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const libelle = new Map(projet.roles.map((r) => [r.id, r.libelle]));
  const choisi = projet.roles.find((r) => r.id === role);

  return (
    <>
      <section className="projet-roles" aria-labelledby="titre-roles">
        <h2 id="titre-roles">Qui intervient, et quand</h2>
        <p className="projet-aide">Choisissez un rôle : ses activités ressortent dans chaque phase.</p>
        <div className="projet-choix" role="group" aria-label="Rôle">
          <button type="button" className="projet-pilule" aria-pressed={role === null} onClick={() => setRole(null)}>
            Tous les rôles
          </button>
          {projet.roles.map((r) => (
            <button key={r.id} type="button" className="projet-pilule" aria-pressed={role === r.id} onClick={() => setRole(r.id)}>
              {r.libelle}
            </button>
          ))}
        </div>
        {choisi ? <p className="projet-role-desc">{choisi.description}</p> : null}

        <div className="projet-matrice-cadre">
          <table className="projet-matrice">
            <caption>Nombre d&apos;activités par rôle et par phase</caption>
            <thead>
              <tr>
                <th scope="col">Rôle</th>
                {projet.phases.map((p, i) => (
                  <th key={p.id} scope="col" title={p.titre}>
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projet.roles.map((r) => (
                <tr key={r.id} className={role === r.id ? "est-choisi" : role ? "est-estompe" : undefined}>
                  <th scope="row">{r.libelle}</th>
                  {projet.phases.map((p) => {
                    const n = p.activites.filter((a) => a.roles.includes(r.id)).length;
                    return (
                      <td key={p.id} data-n={n}>
                        {n > 0 ? n : <span aria-label="aucune">·</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="projet-aide">Les numéros de colonne sont ceux des phases ci-dessous.</p>
      </section>

      <ol className="projet-phases">
        {projet.phases.map((p, i) => {
          const activites = role ? p.activites.filter((a) => a.roles.includes(role)) : p.activites;
          return (
            <li key={p.id} id={p.id} className="projet-phase">
              <h2 className="projet-phase-titre">
                <span className="projet-numero">{i + 1}</span>
                {p.titre}
              </h2>
              <p className="projet-objectif">{p.objectif}</p>

              <h3>Livrables</h3>
              <ul className="projet-livrables">
                {p.livrables.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>

              <h3>
                Activités{role ? ` du rôle ${libelle.get(role)}` : ""} ({activites.length})
              </h3>
              {activites.length === 0 ? (
                <p className="projet-aide">Ce rôle n&apos;intervient pas dans cette phase.</p>
              ) : (
                <ul className="projet-activites">
                  {activites.map((a) => (
                    <li key={a.titre} className="projet-activite">
                      <p className="projet-activite-titre">{a.titre}</p>
                      <p className="projet-activite-roles">{a.roles.map((r) => libelle.get(r)).join(" · ")}</p>
                      {a.competences.length > 0 ? (
                        <ul className="projet-competences">
                          {a.competences.map((id) => {
                            const c = competences[id];
                            return (
                              <li key={id}>
                                <Link href={c.fiche ? `/fiche/${c.fiche}` : `/competence/${id}`}>{c.titre}</Link>
                                {c.fiche ? <span className="projet-a-fiche">fiche</span> : null}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}

              <details className="projet-details">
                <summary>Jalon : {p.jalon.titre}</summary>
                <ul>
                  {p.jalon.criteres.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </details>
              {p.risques.length > 0 ? (
                <details className="projet-details">
                  <summary>Risques fréquents ({p.risques.length})</summary>
                  <ul>
                    {p.risques.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}
