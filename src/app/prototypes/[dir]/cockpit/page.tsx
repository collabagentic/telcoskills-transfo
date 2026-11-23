import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarreProto } from "@/composants/prototypes/communs";
import { CockpitProto } from "@/composants/prototypes/CockpitProto";
import { donneesPubliques } from "@/contenu/publiques";
import { DIRECTIONS, type Direction } from "../../directions";
import "../../proto.css";

export const dynamicParams = false;

type Props = { params: Promise<{ dir: string }> };

export function generateStaticParams() {
  return DIRECTIONS.map((dir) => ({ dir }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dir } = await params;
  return { title: `Prototype ${dir.toUpperCase()} · Cockpit` };
}

export default async function PrototypeCockpit({ params }: Props) {
  const { dir } = await params;
  if (!(DIRECTIONS as readonly string[]).includes(dir)) notFound();
  const d = dir as Direction;
  return (
    <div className="proto">
      <BarreProto dir={d} page="cockpit" />
      <CockpitProto donnees={donneesPubliques()} dir={d} />
    </div>
  );
}
