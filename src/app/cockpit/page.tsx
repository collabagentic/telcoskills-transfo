import type { Metadata } from "next";
import { Cockpit } from "@/composants/Cockpit";
import { donneesPubliques } from "@/contenu/publiques";

export const metadata: Metadata = { title: "Mon cockpit" };

export default function PageCockpit() {
  return <Cockpit donnees={donneesPubliques()} />;
}
