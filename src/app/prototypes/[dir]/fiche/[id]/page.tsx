import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarreProto } from "@/composants/prototypes/communs";
import { FicheC } from "@/composants/prototypes/FicheC";
import { FicheD } from "@/composants/prototypes/FicheD";
import { chargerContenu } from "@/contenu/charger";
import { titreFiche } from "@/contenu/lecture";
import { FICHES, type DirectionFiche } from "../../../directions";
import { construireLecon } from "../../../lecon";
import "../../../proto.css";

export const dynamicParams = false;

type Props = { params: Promise<{ dir: string; id: string }> };

export function generateStaticParams() {
  return FICHES.flatMap((dir) => chargerContenu().fiches.map((f) => ({ dir, id: f.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dir, id } = await params;
  const f = chargerContenu().fiches.find((x) => x.id === id);
  return { title: `Prototype ${dir.toUpperCase()} · ${f ? titreFiche(f) : "Fiche"}` };
}

export default async function PrototypeFiche({ params }: Props) {
  const { dir, id } = await params;
  const c = chargerContenu();
  const f = c.fiches.find((x) => x.id === id);
  if (!f || !(FICHES as readonly string[]).includes(dir)) notFound();
  const d = dir as DirectionFiche;
  const l = construireLecon(f, c);
  return (
    <div className="proto">
      <BarreProto page="fiche" dir={d} ficheId={f.id} />
      {d === "c" ? <FicheC l={l} dir={d} /> : <FicheD l={l} dir={d} />}
    </div>
  );
}
