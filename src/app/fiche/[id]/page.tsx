import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FicheLecon } from "@/composants/lecon/FicheLecon";
import { chargerContenu } from "@/contenu/charger";
import { construireLecon } from "@/contenu/lecon";
import { titreFiche } from "@/contenu/lecture";
import { donneesPubliques } from "@/contenu/publiques";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return chargerContenu().fiches.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const f = chargerContenu().fiches.find((x) => x.id === id);
  if (!f) return { title: "Fiche" };
  return { title: titreFiche(f), description: f.resume.apres, openGraph: { title: titreFiche(f), description: f.resume.apres } };
}

export default async function PageFiche({ params }: Props) {
  const { id } = await params;
  const c = chargerContenu();
  const f = c.fiches.find((x) => x.id === id);
  if (!f) notFound();
  return (
    <div className="lc-page">
      <FicheLecon l={construireLecon(f, c)} donnees={donneesPubliques()} />
    </div>
  );
}
