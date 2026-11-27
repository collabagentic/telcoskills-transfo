import type { Metadata } from "next";
import Link from "next/link";
import { OutilsVue } from "@/composants/OutilsVue";
import { chargerContenu } from "@/contenu/charger";
import { titreFiche } from "@/contenu/lecture";
import "../projet/projet.css";

export const metadata: Metadata = {
  title: "Les outils",
  description: "Les outils open source d'une pile cloud télécom, groupés par fonction, avec les rôles qui s'en servent.",
};

export default function PageOutils() {
  const c = chargerContenu();
  const citees = new Set(c.outils.outils.flatMap((o) => o.competences));
  const competences = Object.fromEntries(c.competences.filter((x) => citees.has(x.id)).map((x) => [x.id, x.titre]));
  const fiches: Record<string, { id: string; titre: string }[]> = {};
  for (const f of c.fiches) for (const t of f.technos) (fiches[t] ??= []).push({ id: f.id, titre: titreFiche(f) });

  return (
    <article className="projet lecture">
      <p className="sur-titre">Les outils</p>
      <h1>Les outils de la pile</h1>
      <p className="projet-chapeau">
        {c.outils.outils.length} outils open source, groupés par fonction. Choisissez un rôle du <Link href="/projet">projet</Link> pour voir la pile de cette équipe.
      </p>
      <p className="projet-aide">{c.outils.source}</p>
      <OutilsVue outils={c.outils} roles={c.projet.roles} competences={competences} fiches={fiches} />
    </article>
  );
}
