import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BarreNavigation, type Entree } from "@/composants/BarreNavigation";
import { chargerContenu } from "@/contenu/charger";
import { titreFiche } from "@/contenu/lecture";
import { PiedDePage } from "@/composants/PiedDePage";
import { SITE } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--police-texte", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--police-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "TelcoSkills · Transformation", template: "%s · TelcoSkills" },
  metadataBase: new URL(SITE),
  description: "Vous connaissez déjà le télécom : ce qui reste, ce qui change et ce qu'il faut apprendre pour passer au cloud natif. Une feuille de route sans compte, des fiches sourcées.",
  openGraph: { siteName: "TelcoSkills", locale: "fr_FR", type: "website" },
  // Pas d'indexation tant que l'auteur n'a pas dit « on ouvre » (BACKLOG.md E0-4, lot 8).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f6f8fb" };

/** Ce que la recherche de la barre trouve : fiches, compétences, outils. */
function entreesRecherche(): Entree[] {
  const c = chargerContenu();
  return [
    ...c.fiches.map((f) => ({ t: titreFiche(f), h: `/fiche/${f.id}`, k: "Fiche" })),
    ...c.competences.map((x) => ({ t: x.titre, h: `/competence/${x.id}`, k: "Compétence" })),
    ...c.outils.outils.map((o) => ({ t: o.nom, h: `/outils#${o.id}`, k: "Outil" })),
  ];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <a className="evitement" href="#contenu">
          Aller au contenu
        </a>
        <div className="scene">
          <div className="page">
            <BarreNavigation entrees={entreesRecherche()} />
            <main id="contenu">{children}</main>
            <PiedDePage />
          </div>
        </div>
      </body>
    </html>
  );
}
