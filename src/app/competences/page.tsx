import type { Metadata } from "next";
import Link from "next/link";
import { chargerContenu } from "@/contenu/charger";
import type { Fiche } from "@/contenu/schemas";
import "./competences.css";

export const metadata: Metadata = {
  title: "Les compétences",
  description: "Les compétences du cloud natif, regroupées par domaine.",
};

const NIVEAU = {
  fondamental: "Fondamental",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
  transverse: "Transverse",
} as const;

export default function PageCompetences() {
  const c = chargerContenu();
  const fichesParCompetence = new Map<string, Fiche[]>();
  for (const f of c.fiches) {
    for (const cid of f.competences) {
      const liste = fichesParCompetence.get(cid) ?? [];
      liste.push(f);
      fichesParCompetence.set(cid, liste);
    }
  }

  return (
    <article className="competences lecture">
      <h1>Les compétences</h1>
      <p className="competences-chapeau">
        Toutes les compétences du cloud natif, regroupées par domaine, à parcourir librement.
      </p>
      {c.domaines.map((d) => {
        const competences = c.competences.filter((x) => x.domaine === d.id);
        return (
          <section key={d.id} className="domaine">
            <h2>{d.nom}</h2>
            <ul className="domaine-liste">
              {competences.map((x) => {
                const fiches = fichesParCompetence.get(x.id) ?? [];
                return (
                  <li key={x.id} className="competence">
                    <h3 className="competence-titre">
                      <Link href={"/competence/" + x.id}>{x.titre}</Link>
                    </h3>
                    <span className="pastille">{NIVEAU[x.niveau]}</span>
                    <p className="competence-resume">{x.resume}</p>
                    {fiches.length > 0 ? (
                      <Link className="pastille competence-fiche" href={"/fiche/" + fiches[0].id}>
                        {fiches.length === 1 ? "fiche" : fiches.length + " fiches"}
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
