import type { Metadata } from "next";
import { FeuilleVivante } from "@/composants/FeuilleVivante";
import { donneesPubliques } from "@/contenu/publiques";

export const metadata: Metadata = { title: "Ma feuille de route" };

export default function PageRoadmap() {
  return <FeuilleVivante donnees={donneesPubliques()} />;
}
