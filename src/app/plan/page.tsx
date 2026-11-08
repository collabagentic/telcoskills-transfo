import type { Metadata } from "next";
import { PlanVue } from "@/composants/PlanVue";
import { donneesPubliques } from "@/contenu/publiques";

export const metadata: Metadata = { title: "Votre plan" };

export default function PagePlan() {
  return <PlanVue donnees={donneesPubliques()} />;
}
