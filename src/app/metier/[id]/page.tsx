import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BilanMetier } from "@/composants/BilanMetier";
import { chargerContenu } from "@/contenu/charger";
import { donneesPubliques } from "@/contenu/publiques";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return chargerContenu().metiers.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = chargerContenu().metiers.find((x) => x.id === id);
  return { title: m ? m.nom : "Métier" };
}

export default async function PageMetier({ params }: Props) {
  const { id } = await params;
  const m = chargerContenu().metiers.find((x) => x.id === id);
  if (!m) notFound();
  const donnees = donneesPubliques();
  return <BilanMetier metier={donnees.metiers[m.id]} portrait={m.portrait} fiches={donnees.fiches} />;
}
