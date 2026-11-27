import type { Metadata } from "next";
import Link from "next/link";
import { ProjetVue } from "@/composants/ProjetVue";
import { chargerContenu } from "@/contenu/charger";
import "./projet.css";

export const metadata: Metadata = {
  title: "Le projet",
  description: "Déployer un cœur 5G sur un CaaS, phase par phase : qui fait quoi, quels livrables, et à quoi sert chaque compétence.",
};

export default function PageProjet() {
  const c = chargerContenu();
  const p = c.projet;
  const premiereFiche = new Map<string, string>();
  for (const f of c.fiches) for (const id of f.competences) if (!premiereFiche.has(id)) premiereFiche.set(id, f.id);
  const citees = new Set(p.phases.flatMap((ph) => ph.activites.flatMap((a) => a.competences)));
  const competences = Object.fromEntries(
    c.competences.filter((x) => citees.has(x.id)).map((x) => [x.id, { titre: x.titre, fiche: premiereFiche.get(x.id) }]),
  );

  return (
    <article className="projet lecture">
      <p className="sur-titre">Le projet</p>
      <h1>{p.titre}</h1>
      <p className="projet-chapeau">{p.resume}</p>
      <p className="projet-hypotheses">
        <strong>Hypothèses.</strong> {p.contexte}
      </p>
      <p className="projet-aide">
        {p.phases.length} phases, {p.roles.length} rôles. {p.source} Les outils de chaque rôle sont sur la page <Link href="/outils">Les outils</Link>.
      </p>
      <ProjetVue projet={p} competences={competences} />
    </article>
  );
}
