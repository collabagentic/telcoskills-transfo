import type { Metadata } from "next";
import Link from "next/link";
import { auditFiches } from "@/contenu/audit";
import { CATEGORIES, type Categorie } from "@/lib/prompt";

export const metadata: Metadata = { title: "Audit des fiches", robots: { index: false, follow: false } };

export default function PageAudit() {
  const a = auditFiches();
  const pluriel = (n: number) => (n > 1 ? "s" : "");
  return (
    <article className="texte-page audit">
      <p className="pastille">Audit</p>
      <h1>Où en sont les fiches</h1>
      <p className="chapeau">
        {a.finies} fiche{pluriel(a.finies)} finie{pluriel(a.finies)} sur {a.total} (relue par l'auteur) · {a.avecSchema} avec un schéma dessiné · {a.classementsValides} classement
        {pluriel(a.classementsValides)} validé{pluriel(a.classementsValides)}.
      </p>
      <p className="cockpit-texte">
        « Fini » veut dire relue. Les autres colonnes sont calculées depuis les fiches ; les notes et les classements validés se tiennent dans <code>content/audit.json</code>.
      </p>
      <div className="audit-defile">
        <table className="audit-table">
          <thead>
            <tr>
              <th scope="col">Fiche</th>
              <th scope="col">État</th>
              <th scope="col">Classement</th>
              <th scope="col">Contenu</th>
              <th scope="col">À vérifier</th>
            </tr>
          </thead>
          <tbody>
            {a.lignes.map((l) => (
              <tr key={l.id}>
                <th scope="row">
                  <Link href={`/fiche/${l.id}`}>{l.titre}</Link>
                  <span className="cockpit-texte">
                    {l.id} · mise à jour le {l.misAJour}
                  </span>
                </th>
                <td>
                  <span className={`audit-etat ${l.fini ? "audit-fini" : "audit-pas-fini"}`}>{l.fini ? "Fini" : "Pas fini"}</span>
                </td>
                <td>
                  {CATEGORIES[l.categorie as Categorie].nom}
                  <span className="cockpit-texte">
                    {l.genre === "transposition" ? "Transposition" : "Nouveauté"} · {l.classementValide ? "validé" : "à confirmer"}
                  </span>
                </td>
                <td>
                  <span className="cockpit-texte">
                    {l.temps} min · {l.schemaDessine ? "schéma dessiné" : "chaîne simple"} · {l.sources} source{pluriel(l.sources)} · {l.ressources} ressource{pluriel(l.ressources)}
                  </span>
                </td>
                <td>
                  <ul>
                    {l.aVerifier.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
