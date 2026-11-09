import type { Metadata } from "next";
import { Assistant } from "@/composants/Assistant";
import { donneesPubliques } from "@/contenu/publiques";

export const metadata: Metadata = { title: "Composer ma feuille de route" };

export default function PageRoadmap() {
  return <Assistant donnees={donneesPubliques()} />;
}
