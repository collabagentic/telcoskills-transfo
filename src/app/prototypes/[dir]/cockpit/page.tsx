import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarreProto } from "@/composants/prototypes/communs";
import { CockpitProto } from "@/composants/prototypes/CockpitProto";
import { donneesPubliques } from "@/contenu/publiques";
import { COCKPIT } from "../../directions";
import "../../proto.css";

export const dynamicParams = false;

type Props = { params: Promise<{ dir: string }> };

export function generateStaticParams() {
  return [{ dir: COCKPIT }];
}

export const metadata: Metadata = { title: "Prototype B · Cockpit" };

export default async function PrototypeCockpit({ params }: Props) {
  const { dir } = await params;
  if (dir !== COCKPIT) notFound();
  return (
    <div className="proto">
      <BarreProto page="cockpit" />
      <CockpitProto donnees={donneesPubliques()} />
    </div>
  );
}
