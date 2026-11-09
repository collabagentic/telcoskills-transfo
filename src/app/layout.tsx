import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnTete } from "@/composants/EnTete";
import { PiedDePage } from "@/composants/PiedDePage";

const geist = Geist({ subsets: ["latin"], variable: "--police-texte", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--police-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "TelcoSkills · Transformation", template: "%s · TelcoSkills" },
  description: "Le telco cloud : par où commencer ? Une feuille de route qui se resserre sur ce qui change pour votre métier.",
  // Pas d'indexation tant que l'auteur n'a pas dit « on ouvre » (BACKLOG.md E0-4, lot 8).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#08090b" }, { media: "(prefers-color-scheme: light)", color: "#f6f5f2" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <a className="evitement" href="#contenu">
          Aller au contenu
        </a>
        <div className="scene">
          <div className="page">
            <EnTete />
            <main id="contenu">{children}</main>
            <PiedDePage />
          </div>
        </div>
      </body>
    </html>
  );
}
